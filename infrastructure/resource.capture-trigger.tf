data "archive_file" "capture-trigger-code" {
  type        = "zip"
  source_dir  = "${path.root}/../lambda/capture-trigger"
  output_path = "${path.root}/../target/capture-trigger.zip"
}

resource "aws_lambda_function" "capture-trigger" {
  filename          = data.archive_file.capture-trigger-code.output_path
  source_code_hash  = data.archive_file.capture-trigger-code.output_base64sha256

  function_name     = "${local.resource_prefix}capture-trigger"
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

resource "aws_lambda_event_source_mapping" "capture-trigger_event_source" {
  event_source_arn = aws_sqs_queue.trigger-queue.arn
  function_name    = aws_lambda_function.capture-trigger.arn
}

resource "aws_sqs_queue" "trigger-queue" {
  name = "${local.resource_prefix}trigger-queue"
  policy = data.aws_iam_policy_document.sqs-allow-sns.json
  delay_seconds = 15 // to avoid too many frequent updates
}
resource "aws_sns_topic_subscription" "analyze_finish_to_trigger" {
  topic_arn = aws_sns_topic.analyze-finish.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.trigger-queue.arn
}
