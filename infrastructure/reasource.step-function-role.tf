resource "aws_iam_role" "iam_for_step_function" {
  name = "${local.resource_prefix}step-function-role"
  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Principal": {
          "Service": [
            "states.amazonaws.com",
          ]
        },
        "Effect": "Allow",
        "Sid": ""
      }
    ]
  })
}

resource "aws_iam_role_policy" "test_policy" {
  name = "${local.resource_prefix}step-function-role-policy"
  role = aws_iam_role.iam_for_step_function.id

  policy = jsonencode({
    Version: "2012-10-17",
    Statement: [
      {
        "Effect": "Allow",
        "Action": [
          "lambda:InvokeFunction"
        ],
        "Resource": "*"
      }
    ]
  })
}
