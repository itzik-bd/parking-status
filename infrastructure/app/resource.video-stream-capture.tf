data "archive_file" "video-stream-capture-code" {
  type        = "zip"
  source_dir  = "${path.root}/../lambda/video-stream-capture"
  output_path = "${path.root}/../target/video-stream-capture.zip"
}

resource "aws_lambda_function" "video-stream-capture" {
  filename         = data.archive_file.video-stream-capture-code.output_path
  source_code_hash = data.archive_file.video-stream-capture-code.output_base64sha256

  function_name = "${local.resource_prefix}video-stream-capture"
  role          = aws_iam_role.iam_role.arn
  handler       = "lambda.handler"
  runtime       = "python3.8"
  timeout       = 30
  layers = [
    aws_serverlessapplicationrepository_cloudformation_stack.ffmpeg_layer.outputs["LayerVersion"],
    aws_serverlessapplicationrepository_cloudformation_stack.image_magick_layer.outputs["LayerVersion"]
  ]

  environment {
    variables = {
      IMAGES_PERIODIC_BUCKET_NAME = aws_s3_bucket.bucket-images-periodic.bucket
      IMAGES_BUCKET_NAME          = aws_s3_bucket.bucket-images.bucket
      CAMERA_ADDRESS              = var.camera_address
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

# see https://serverlessrepo.aws.amazon.com/applications/us-east-1/145266761615/image-magick-lambda-layer
resource "aws_serverlessapplicationrepository_cloudformation_stack" "image_magick_layer" {
  name           = "${local.resource_prefix}image-magick-lambda-layer"
  application_id = "arn:aws:serverlessrepo:us-east-1:145266761615:applications/image-magick-lambda-layer"
  capabilities = [
    "CAPABILITY_IAM"
  ]
}

resource "aws_lambda_permission" "video-stream-capture-sns-permission" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.video-stream-capture.arn
  principal     = "sns.amazonaws.com"
}

resource "aws_sns_topic_subscription" "refresh_to_video-stream-capture" {
  topic_arn = aws_sns_topic.refresh.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.video-stream-capture.arn
}

resource "aws_cloudwatch_log_group" "log-retention-video-stream-capture" {
  name              = "/aws/lambda/${aws_lambda_function.video-stream-capture.function_name}"
  retention_in_days = local.log_retention_days
}

