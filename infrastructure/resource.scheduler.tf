locals {
  schedule = "cron(0/30 * * * ? *)"
}

resource "aws_cloudwatch_event_rule" "schedule" {
  name                = "schedule"
  description         = "Schedule for Lambda Function"
  schedule_expression = local.schedule
}

resource "aws_cloudwatch_event_target" "schedule_lambda" {
  rule      = aws_cloudwatch_event_rule.schedule.name
  target_id = "processing_lambda"
  arn       = aws_lambda_function.video-stream-capture.arn
}


resource "aws_lambda_permission" "allow_events_bridge_to_run_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.video-stream-capture.function_name
  principal     = "events.amazonaws.com"
}
