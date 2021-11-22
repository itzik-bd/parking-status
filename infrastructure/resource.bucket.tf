locals {
  bucket_name = "${var.app_name}--${var.environment_name}"
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
  bucket = local.bucket_name
  acl = "public-read"
  policy = data.aws_iam_policy_document.website_policy.json

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

resource "aws_s3_bucket_object" "web_files" {
  for_each = fileset("${path.root}/../web/", "*.*")
  bucket = aws_s3_bucket.bucket.id
  key = each.value
  source = "${path.root}/../web/${each.value}"
  etag = filemd5("${path.root}/../web/${each.value}")
  content_type = lookup(tomap(local.mime_types), element(split(".", each.key), length(split(".", each.key)) - 1))
}

data "aws_iam_policy_document" "website_policy" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    principals {
      identifiers = ["*"]
      type = "AWS"
    }
    resources = [
      "arn:aws:s3:::${local.bucket_name}/*"
    ]
  }
}
