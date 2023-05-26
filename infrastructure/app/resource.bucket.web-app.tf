resource "aws_s3_bucket" "bucket-web-app" {
  bucket = "${local.resource_prefix}web-app"
}

resource "aws_s3_bucket_cors_configuration" "bucket-web-app-cors-config" {
  bucket = aws_s3_bucket.bucket-web-app.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["http://localhost:4200"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_ownership_controls" "bucket-web-app-ownership-controls" {
  bucket = aws_s3_bucket.bucket-web-app.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "bucket-web-app-acl" {
  depends_on = [aws_s3_bucket_ownership_controls.bucket-web-app-ownership-controls]

  bucket = aws_s3_bucket.bucket-web-app.id
  acl    = "private"
}

data "aws_iam_policy_document" "bucket_policy_doc_web_app" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    principals {
      identifiers = [aws_cloudfront_origin_access_identity.s3_distribution_access_identity.iam_arn]
      type        = "AWS"
    }
    resources = [
      "${aws_s3_bucket.bucket-web-app.arn}/*"
    ]
  }
}

resource "aws_s3_bucket_policy" "bucket_policy-web-app" {
  bucket = aws_s3_bucket.bucket-web-app.id
  policy = data.aws_iam_policy_document.bucket_policy_doc_web_app.json
}
