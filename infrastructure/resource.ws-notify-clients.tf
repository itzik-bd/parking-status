data "archive_file" "ws-notify-clients-code" {
  type        = "zip"
  source_dir  = "${path.root}/../lambda/ws-notify-clients"
  output_path = "${path.root}/../target/ws-notify-clients.zip"
}

resource "aws_lambda_function" "ws-notify-clients" {
  filename          = data.archive_file.ws-notify-clients-code.output_path
  source_code_hash  = data.archive_file.ws-notify-clients-code.output_base64sha256

  function_name     = "${local.resource_prefix}ws-notify-clients"
  role              = aws_iam_role.iam_role.arn
  handler           = "lambda.handler"
  runtime           = local.nodejs_version
  timeout           = 30

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.ws-table.name
      WS_ENDPOINT_URL = replace(aws_apigatewayv2_stage.api-gateway-stage.invoke_url, "wss://", "")
    }
  }
}

resource "aws_lambda_permission" "notify-clients-sns-permission-from-analyze-finish" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ws-notify-clients.arn
  principal     = "sns.amazonaws.com"
}

resource "aws_sns_topic_subscription" "analyze_finish_to_notify_clients" {
  topic_arn = aws_sns_topic.analyze-finish.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.ws-notify-clients.arn
}
resource "aws_sns_topic_subscription" "refresh_to_notify_clients" {
  topic_arn = aws_sns_topic.refresh.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.ws-notify-clients.arn
}

resource "aws_cloudwatch_log_group" "log-retention-ws-notify-clients" {
  name = "/aws/lambda/${aws_lambda_function.ws-notify-clients.function_name}"
  retention_in_days = local.log_retention_days
}
