resource "aws_iam_role" "iam_role" {
  name = "${local.resource_prefix}role"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Principal" : {
          "Service" : [
            "lambda.amazonaws.com",
            "edgelambda.amazonaws.com",
            "states.amazonaws.com",
          ]
        },
        "Effect" : "Allow",
        "Sid" : ""
      }
    ]
  })
}

resource "aws_iam_role_policy" "iam_role_policy" {
  name = "${local.resource_prefix}policy"
  role = aws_iam_role.iam_role.id

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "S3",
        "Effect" : "Allow",
        "Action" : [
          "s3:PutObject",
          "s3:GetObject",
        ],
        "Resource" : [
          "${aws_s3_bucket.bucket-images.arn}/*",
          "${aws_s3_bucket.bucket-images-periodic.arn}/*"
        ]
      },
      {
        "Sid" : "DynamoDB",
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:PutItem",
          "dynamodb:DeleteItem",
          "dynamodb:GetItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:UpdateItem",
        ],
        "Resource" : [
          aws_dynamodb_table.ws-table.arn,
        ]
      },
      {
        "Sid" : "DynamoDBStream",
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams",
        ],
        "Resource" : [
          "${aws_dynamodb_table.ws-table.arn}/stream/*",
        ]
      },
      {
        "Sid" : "AllowStepFunctionToCallLambda",
        "Effect" : "Allow",
        "Action" : [
          "lambda:InvokeFunction"
        ],
        "Resource" : [
          aws_lambda_function.refresh-trigger.arn // for StepFunction to call this lambda
        ]
      },
      {
        "Sid" : "SNS",
        "Effect" : "Allow",
        "Action" : [
          "sns:Publish"
        ],
        "Resource" : [
          aws_sns_topic.analyze-finish.arn,
          aws_sns_topic.refresh.arn,
        ]
      },
      {
        "Sid" : "StepFunction",
        "Effect" : "Allow",
        "Action" : [
          "states:StartExecution"
        ],
        "Resource" : [
          aws_sfn_state_machine.wait-and-refresh.arn
        ]
      },
      {
        "Sid" : "PullFromECR",
        "Effect" : "Allow",
        "Action" : "ecr:BatchGetImage",
        "Resource" : ["*"]
      }
    ]
  })
}


resource "aws_iam_role_policy_attachment" "iam_for_lambda_policy_attachment" {
  for_each = toset([
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    "arn:aws:iam::aws:policy/AmazonAPIGatewayInvokeFullAccess",
  ])

  role       = aws_iam_role.iam_role.name
  policy_arn = each.value
}
