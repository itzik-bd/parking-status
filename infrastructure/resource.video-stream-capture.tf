data "archive_file" "video-stream-capture-code" {
  type        = "zip"
  source_dir  = "${path.root}/../lambda/video-stream-capture"
  output_path = "${path.root}/../target/video-stream-capture.zip"
}

resource "aws_lambda_function" "video-stream-capture" {
  filename          = data.archive_file.video-stream-capture-code.output_path
  source_code_hash  = data.archive_file.video-stream-capture-code.output_base64sha256

  function_name     = "${local.resource_prefix}video-stream-capture"
  role              = aws_iam_role.iam_for_lambda.arn
  handler           = "lambda.handler"
  runtime           = "python3.8"
  timeout           = 30
  layers            = [
    aws_serverlessapplicationrepository_cloudformation_stack.ffmpeg_layer.outputs["LayerVersion"]
  ]

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.bucket-images.bucket
      CAMERA_ADDRESS = var.camera_address
    }
  }
}

# see https://serverlessrepo.aws.amazon.com/applications/us-east-1/145266761615/ffmpeg-lambda-layer
resource "aws_serverlessapplicationrepository_cloudformation_stack" "ffmpeg_layer" {
  name           = "${local.resource_prefix}ffmpeg-lambda-layer"
  application_id = "arn:aws:serverlessrepo:us-east-1:145266761615:applications/ffmpeg-lambda-layer"
  capabilities = [
    "CAPABILITY_IAM"
  ]
}

resource "aws_lambda_event_source_mapping" "video_stream_capture_event_source" {
  event_source_arn = aws_sqs_queue.video-stream-capture-queue.arn
  function_name    = aws_lambda_function.video-stream-capture.arn
}

resource "aws_sqs_queue" "video-stream-capture-queue" {
  name = "${local.resource_prefix}video-stream-capture-queue"
  policy = data.aws_iam_policy_document.sqs-allow-sns.json
}
resource "aws_sns_topic_subscription" "refresh_to_video-stream-capture" {
  topic_arn = aws_sns_topic.refresh.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.video-stream-capture-queue.arn
}

resource "aws_cloudwatch_log_group" "log-retention-video-stream-capture" {
  name = "/aws/lambda/${aws_lambda_function.video-stream-capture.function_name}"
  retention_in_days = local.log_retention_days
}

