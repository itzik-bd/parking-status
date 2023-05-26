data "archive_file" "refresh-trigger-code" {
  type        = "zip"
  source_dir  = "${path.root}/../lambda/refresh-trigger"
  output_path = "${path.root}/../target/refresh-trigger.zip"
}

resource "aws_lambda_function" "refresh-trigger" {
  filename         = data.archive_file.refresh-trigger-code.output_path
  source_code_hash = data.archive_file.refresh-trigger-code.output_base64sha256

  function_name                  = "${local.resource_prefix}refresh-trigger"
  role                           = aws_iam_role.iam_role.arn
  handler                        = "lambda.handler"
  runtime                        = local.nodejs_version
  timeout                        = 30
  reserved_concurrent_executions = 1 # important - there should be single invocation at a time to avoid the need of locks

  environment {
    variables = {
      TABLE_NAME    = aws_dynamodb_table.ws-table.name,
      SNS_TOPIC_ARN = aws_sns_topic.refresh.arn,
    }
  }
}

resource "aws_lambda_event_source_mapping" "ws-table-to-refresh-trigger" {
  event_source_arn  = aws_dynamodb_table.ws-table.stream_arn
  function_name     = aws_lambda_function.refresh-trigger.arn
  starting_position = "LATEST"
  batch_size        = 1
}

resource "aws_cloudwatch_log_group" "log-retention-refresh-trigger" {
  name              = "/aws/lambda/${aws_lambda_function.refresh-trigger.function_name}"
  retention_in_days = local.log_retention_days
}
