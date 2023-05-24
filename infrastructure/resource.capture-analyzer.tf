data "archive_file" "capture-analyzer-code" {
  type        = "zip"
  source_dir  = "${path.root}/../lambda/capture-analyzer"
  output_path = "${path.root}/../target/capture-analyzer.zip"
}

resource "aws_lambda_function" "capture-analyzer" {
  package_type = "Image"
  image_uri    = "${aws_ecr_repository.capture-analyzer-registry.repository_url}:latest"

  function_name = "${local.resource_prefix}capture-analyzer"
  role          = aws_iam_role.iam_role.arn
  timeout       = 30

  environment {
    variables = {
      IMAGES_BUCKET_NAME = aws_s3_bucket.bucket-images.bucket
    }
  }
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

resource "aws_cloudwatch_log_group" "log-retention-capture-analyzer" {
  name              = "/aws/lambda/${aws_lambda_function.capture-analyzer.function_name}"
  retention_in_days = local.log_retention_days
}
