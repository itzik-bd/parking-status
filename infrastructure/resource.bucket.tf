locals {
  mime_types = {
    "css"  = "text/css"
    "html" = "text/html"
    "ico"  = "image/vnd.microsoft.icon"
    "js"   = "application/javascript"
    "json" = "application/json"
    "map"  = "application/json"
    "png"  = "image/png"
    "svg"  = "image/svg+xml"
    "txt"  = "text/plain"
  }
}

resource "aws_s3_bucket" "bucket" {
  bucket = "${var.app_name}--${var.environment_name}"
  acl = "private"
}

resource "aws_s3_bucket_object" "web_files" {
  for_each = fileset("${path.root}/../web/", "*.*")
  bucket = aws_s3_bucket.bucket.id
  key = each.value
  source = "${path.root}/../web/${each.value}"
  etag = filemd5("${path.root}/../web/${each.value}")
  content_type = lookup(tomap(local.mime_types), element(split(".", each.key), length(split(".", each.key)) - 1))
}

data "aws_iam_policy_document" "bucket_policy_doc" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    principals {
      identifiers = [aws_cloudfront_origin_access_identity.s3_distribution_access_identity.iam_arn]
      type = "AWS"
    }
    resources = [
      "${aws_s3_bucket.bucket.arn}/*"
    ]
  }
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.bucket.id
  policy = data.aws_iam_policy_document.bucket_policy_doc.json
}
