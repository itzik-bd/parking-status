data "archive_file" "ws-notify-clients-code" {
  type        = "zip"
  source_dir  = "${path.root}/../lambda/ws-notify-clients"
  output_path = "${path.root}/../target/ws-notify-clients.zip"
}

resource "aws_lambda_function" "ws-notify-clients" {
  filename          = data.archive_file.ws-notify-clients-code.output_path
  source_code_hash  = data.archive_file.ws-notify-clients-code.output_base64sha256

  function_name     = "${var.app_name}--${var.environment_name}--ws-notify-clients"
  role              = aws_iam_role.iam_for_lambda.arn
  handler           = "lambda.handler"
  runtime           = "nodejs14.x"
  timeout           = 30

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.ws-table.name
      WS_ENDPOINT_URL = replace(aws_apigatewayv2_stage.api-gateway-stage.invoke_url, "wss://", "")
    }
  }
}

resource "aws_lambda_event_source_mapping" "example" {
  event_source_arn = aws_sqs_queue.analyze-finish.arn
  function_name    = aws_lambda_function.ws-notify-clients.arn
}
