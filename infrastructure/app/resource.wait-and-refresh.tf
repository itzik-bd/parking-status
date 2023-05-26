resource "aws_sfn_state_machine" "wait-and-refresh" {
  name     = "${local.resource_prefix}wait-and-refresh"
  role_arn = aws_iam_role.iam_role.arn

  definition = <<EOF
{
  "Comment": "Wait and send to SNS",
  "StartAt": "WaitState",
  "States": {
    "WaitState": {
      "Type": "Wait",
      "Seconds": ${local.refresh_delay_seconds},
      "Next": "Lambda Invoke"
    },
    "Lambda Invoke": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "${aws_lambda_function.refresh-trigger.arn}"
      },
      "End": true
    }
  }
}
EOF
}

data "archive_file" "trigger-wait-and-refresh-code" {
  type        = "zip"
  source_dir  = "${path.root}/../../lambda/trigger-wait-and-refresh"
  output_path = "${path.root}/../../target/trigger-wait-and-refresh.zip"
}

resource "aws_lambda_function" "trigger-wait-and-refresh" {
  filename         = data.archive_file.trigger-wait-and-refresh-code.output_path
  source_code_hash = data.archive_file.trigger-wait-and-refresh-code.output_base64sha256

  function_name = "${local.resource_prefix}trigger-wait-and-refresh"
  role          = aws_iam_role.iam_role.arn
  handler       = "lambda.handler"
  runtime       = local.nodejs_version
  timeout       = 30

  environment {
    variables = {
      STEP_FUNCTION_ARN = aws_sfn_state_machine.wait-and-refresh.arn,
    }
  }
}

resource "aws_lambda_permission" "trigger-wait-and-refresh-sns-permission" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.trigger-wait-and-refresh.arn
  principal     = "sns.amazonaws.com"
}

resource "aws_sns_topic_subscription" "analyze_finish_to_trigger" {
  topic_arn = aws_sns_topic.analyze-finish.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.trigger-wait-and-refresh.arn
}

resource "aws_cloudwatch_log_group" "log-retention-trigger-wait-and-refresh" {
  name              = "/aws/lambda/${aws_lambda_function.trigger-wait-and-refresh.function_name}"
  retention_in_days = local.log_retention_days
}
