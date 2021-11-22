data "archive_file" "video-stream-capture-code" {
  type        = "zip"
  source_dir  = "${path.root}/../lambda/video-stream-capture"
  output_path = "${path.root}/../target/video-stream-capture.zip"
}

resource "aws_lambda_function" "video-stream-capture" {
  filename          = data.archive_file.video-stream-capture-code.output_path
  source_code_hash  = data.archive_file.video-stream-capture-code.output_base64sha256

  function_name     = "${var.app_name}--${var.environment_name}--video-stream-capture"
  role              = aws_iam_role.iam_for_lambda.arn
  handler           = "lambda.handler"
  runtime           = "python3.8"
  timeout           = 30
  layers            = [
    aws_serverlessapplicationrepository_cloudformation_stack.ffmpeg_layer.outputs["LayerVersion"]
  ]

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.bucket.bucket
      CAMERA_ADDRESS = var.camera_address
    }
  }
}

# see https://serverlessrepo.aws.amazon.com/applications/us-east-1/145266761615/ffmpeg-lambda-layer
resource "aws_serverlessapplicationrepository_cloudformation_stack" "ffmpeg_layer" {
  name           = "${var.app_name}--${var.environment_name}--ffmpeg-lambda-layer"
  application_id = "arn:aws:serverlessrepo:us-east-1:145266761615:applications/ffmpeg-lambda-layer"
  capabilities = [
    "CAPABILITY_IAM"
  ]
}
