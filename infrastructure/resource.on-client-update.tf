data "archive_file" "on-client-update-code" {
  type        = "zip"
  source_dir  = "${path.root}/../lambda/on-client-update"
  output_path = "${path.root}/../target/on-client-update.zip"
}

resource "aws_lambda_function" "on-client-update" {
  filename          = data.archive_file.on-client-update-code.output_path
  source_code_hash  = data.archive_file.on-client-update-code.output_base64sha256

  function_name     = "${local.resource_prefix}on-client-update"
  role              = aws_iam_role.iam_for_lambda.arn
  handler           = "lambda.handler"
  runtime           = local.nodejs_version
  timeout           = 30
  reserved_concurrent_executions = 1 # important - there should be single invocation at a time to avoid the need of locks

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.ws-table.name,
      SNS_TOPIC_ARN = aws_sns_topic.refresh.arn,
    }
  }
}

resource "aws_lambda_event_source_mapping" "ws-table-to-on-client-update" {
  event_source_arn  = aws_dynamodb_table.ws-table.stream_arn
  function_name     = aws_lambda_function.on-client-update.arn
  starting_position = "LATEST"
  batch_size = 1
}

resource "aws_cloudwatch_log_group" "log-retention-on-client-update" {
  name = "/aws/lambda/${aws_lambda_function.on-client-update.function_name}"
  retention_in_days = local.log_retention_days
}
