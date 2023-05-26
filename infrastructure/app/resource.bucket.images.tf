resource "aws_s3_bucket" "bucket-images" {
  bucket = "${local.resource_prefix}images"
}

resource "aws_s3_bucket_lifecycle_configuration" "bucket-images-lifecycle-config" {
  bucket = aws_s3_bucket.bucket-images.id

  rule {
    id     = "image-cleanup"
    status = "Enabled"

    expiration {
      days = 1
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "bucket-images-cors-config" {
  bucket = aws_s3_bucket.bucket-images.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["http://localhost:4200"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_ownership_controls" "bucket-images-ownership-controls" {
  bucket = aws_s3_bucket.bucket-images.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "bucket-images-acl" {
  depends_on = [aws_s3_bucket_ownership_controls.bucket-images-ownership-controls]

  bucket = aws_s3_bucket.bucket-images.id
  acl    = "private"
}

data "aws_iam_policy_document" "bucket_policy_doc_images" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    principals {
      identifiers = [aws_cloudfront_origin_access_identity.s3_distribution_access_identity.iam_arn]
      type        = "AWS"
    }
    resources = [
      "${aws_s3_bucket.bucket-images.arn}/*"
    ]
  }
}

resource "aws_s3_bucket_policy" "bucket_policy-images" {
  bucket = aws_s3_bucket.bucket-images.id
  policy = data.aws_iam_policy_document.bucket_policy_doc_images.json
}
