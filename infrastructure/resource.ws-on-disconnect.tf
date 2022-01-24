data "archive_file" "ws-on-disconnect-code" {
  type        = "zip"
  source_dir  = "${path.root}/../lambda/ws-on-disconnect"
  output_path = "${path.root}/../target/ws-on-disconnect.zip"
}

resource "aws_lambda_function" "ws-on-disconnect" {
  filename          = data.archive_file.ws-on-disconnect-code.output_path
  source_code_hash  = data.archive_file.ws-on-disconnect-code.output_base64sha256

  function_name     = "${local.resource_prefix}ws-on-disconnect"
  role              = aws_iam_role.iam_role.arn
  handler           = "lambda.handler"
  runtime           = local.nodejs_version
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

resource "aws_cloudwatch_log_group" "log-retention-ws-on-disconnect" {
  name = "/aws/lambda/${aws_lambda_function.ws-on-disconnect.function_name}"
  retention_in_days = local.log_retention_days
}
