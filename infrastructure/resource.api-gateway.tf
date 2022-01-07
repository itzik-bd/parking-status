locals {
  ws-stage-name = "ws"
}

resource "aws_apigatewayv2_api" "api-gateway" {
  name                       = "${local.resource_prefix}api-gateway"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"

}
resource "aws_apigatewayv2_stage" "api-gateway-stage" {
  api_id = aws_apigatewayv2_api.api-gateway.id
  name   = local.ws-stage-name
  auto_deploy = true
}

// connect route
resource "aws_apigatewayv2_route" "connect-route" {
  api_id    = aws_apigatewayv2_api.api-gateway.id
  route_key = "$connect"
  target = "integrations/${aws_apigatewayv2_integration.connect-route-integration.id}"
}
resource "aws_apigatewayv2_integration" "connect-route-integration" {
  api_id           = aws_apigatewayv2_api.api-gateway.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.ws-on-connect.invoke_arn
}

// disconnect route
resource "aws_apigatewayv2_route" "disconnect-route" {
  api_id    = aws_apigatewayv2_api.api-gateway.id
  route_key = "$disconnect"
  target = "integrations/${aws_apigatewayv2_integration.disconnect-route-integration.id}"
}
resource "aws_apigatewayv2_integration" "disconnect-route-integration" {
  api_id           = aws_apigatewayv2_api.api-gateway.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.ws-on-disconnect.invoke_arn
}
