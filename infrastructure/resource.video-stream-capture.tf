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

  # this layer was manually deployed from:
  # https://serverlessrepo.aws.amazon.com/applications/us-east-1/145266761615/ffmpeg-lambda-layer
  # TODO: automate it via terraform
  layers            = ["arn:aws:lambda:eu-central-1:814134525579:layer:ffmpeg:3"]

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.bucket.bucket
      CAMERA_ADDRESS = var.camera_address
    }
  }
}
