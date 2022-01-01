data "archive_file" "capture-analyzer-code" {
  type        = "zip"
  source_dir  = "${path.root}/../lambda/capture-analyzer"
  output_path = "${path.root}/../target/capture-analyzer.zip"
}

resource "aws_lambda_function" "capture-analyzer" {
  filename          = data.archive_file.capture-analyzer-code.output_path
  source_code_hash  = data.archive_file.capture-analyzer-code.output_base64sha256

  function_name     = "${var.app_name}--${var.environment_name}--capture-analyzer"
  role              = aws_iam_role.iam_for_lambda.arn
  handler           = "lambda.handler"
  runtime           = "nodejs14.x"
  timeout           = 30

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.bucket.bucket
      BUCKET_PENDING_DIR = local.pending_dir
      BUCKET_PROCESSED_DIR = local.processed_dir
    }
  }
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.bucket.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.capture-analyzer.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "${local.pending_dir}/"
  }

  depends_on = [aws_lambda_permission.allow_bucket]
}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.capture-analyzer.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.bucket.arn
}
