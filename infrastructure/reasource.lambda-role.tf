resource "aws_iam_role" "iam_for_lambda" {
  name = "${var.app_name}--${var.environment_name}--lambda-role"
  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Principal": {
          "Service": [
            "lambda.amazonaws.com",
            "edgelambda.amazonaws.com",
          ]
        },
        "Effect": "Allow",
        "Sid": ""
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "iam_for_lambda_policy_attachment" {
  for_each = toset([
    "arn:aws:iam::aws:policy/AmazonS3FullAccess",
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess",
    "arn:aws:iam::aws:policy/AmazonAPIGatewayInvokeFullAccess",
    "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole",
    "arn:aws:iam::aws:policy/AmazonSQSFullAccess", // for SendMessage
    "arn:aws:iam::aws:policy/AmazonSNSFullAccess", // for Publish
  ])

  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = each.value
}
