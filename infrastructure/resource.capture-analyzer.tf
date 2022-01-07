data "archive_file" "capture-analyzer-code" {
  type        = "zip"
  source_dir  = "${path.root}/../lambda/capture-analyzer"
  output_path = "${path.root}/../target/capture-analyzer.zip"
}

resource "aws_lambda_function" "capture-analyzer" {
  filename          = data.archive_file.capture-analyzer-code.output_path
  source_code_hash  = data.archive_file.capture-analyzer-code.output_base64sha256

  function_name     = "${local.resource_prefix}capture-analyzer"
  role              = aws_iam_role.iam_for_lambda.arn
  handler           = "lambda.handler"
  runtime           = local.nodejs_version
  timeout           = 30
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.bucket-images.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.capture-analyzer.arn
    events              = ["s3:ObjectCreated:*"]
  }

  depends_on = [aws_lambda_permission.allow_bucket]
}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.capture-analyzer.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.bucket-images.arn
}

resource "aws_lambda_function_event_invoke_config" "capture-analyzer-sns-destination" {
  function_name = aws_lambda_function.capture-analyzer.function_name

  destination_config {
    on_success {
      destination = aws_sns_topic.analyze-finish.arn
    }
  }
}
