locals {
  web_output_dir = "${path.root}/../../target/web-app"
  mime_types = {
    "css"  = "text/css"
    "html" = "text/html"
    "ico"  = "image/vnd.microsoft.icon"
    "js"   = "application/javascript"
    "json" = "application/json"
    "map"  = "application/json"
    "png"  = "image/png"
    "jpeg" = "image/jpeg"
    "svg"  = "image/svg+xml"
    "txt"  = "text/plain"
  }
}

resource "aws_s3_bucket" "bucket-web-app" {
  bucket = "${local.resource_prefix}web-app"
}

resource "aws_s3_object" "web_files" {
  for_each     = fileset(local.web_output_dir, "**/*.*")
  bucket       = aws_s3_bucket.bucket-web-app.id
  key          = each.value
  source       = "${local.web_output_dir}/${each.value}"
  etag         = filemd5("${local.web_output_dir}/${each.value}")
  content_type = lookup(tomap(local.mime_types), element(split(".", each.key), length(split(".", each.key)) - 1))
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
