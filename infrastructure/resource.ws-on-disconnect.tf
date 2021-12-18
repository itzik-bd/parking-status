data "archive_file" "ws-on-disconnect-code" {
  type        = "zip"
  source_dir  = "${path.root}/../lambda/ws-on-disconnect"
  output_path = "${path.root}/../target/ws-on-disconnect.zip"
}

resource "aws_lambda_function" "ws-on-disconnect" {
  filename          = data.archive_file.ws-on-disconnect-code.output_path
  source_code_hash  = data.archive_file.ws-on-disconnect-code.output_base64sha256

  function_name     = "${var.app_name}--${var.environment_name}--ws-on-disconnect"
  role              = aws_iam_role.iam_for_lambda.arn
  handler           = "lambda.handler"
  runtime           = "nodejs14.x"
  timeout           = 30

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.ws-table.name
    }
  }
}

resource "aws_lambda_permission" "ws-on-disconnect-permission" {
  statement_id  = "AllowExecutionFromApiGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ws-on-disconnect.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.api-gateway.execution_arn}/*/*"
}

