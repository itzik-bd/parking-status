data "archive_file" "refresh-if-active-clients-code" {
  type        = "zip"
  source_dir  = "${path.root}/../lambda/refresh-if-active-clients"
  output_path = "${path.root}/../target/refresh-if-active-clients.zip"
}

resource "aws_lambda_function" "refresh-if-active-clients" {
  filename          = data.archive_file.refresh-if-active-clients-code.output_path
  source_code_hash  = data.archive_file.refresh-if-active-clients-code.output_base64sha256

  function_name     = "${local.resource_prefix}refresh-if-active-clients"
  role              = aws_iam_role.iam_for_lambda.arn
  handler           = "lambda.handler"
  runtime           = local.nodejs_version
  timeout           = 30

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.ws-table.name,
      SNS_TOPIC_ARN = aws_sns_topic.refresh.arn,
    }
  }
}

resource "aws_cloudwatch_log_group" "log-retention-refresh-if-active-clients" {
  name = "/aws/lambda/${aws_lambda_function.refresh-if-active-clients.function_name}"
  retention_in_days = local.log_retention_days
}
