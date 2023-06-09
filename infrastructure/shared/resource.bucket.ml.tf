resource "aws_s3_bucket" "bucket-ml" {
  bucket = "${local.app_name}-ml"
}

resource "aws_s3_bucket_ownership_controls" "bucket-images-ownership-controls" {
  bucket = aws_s3_bucket.bucket-ml.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "bucket-images-acl" {
  depends_on = [aws_s3_bucket_ownership_controls.bucket-images-ownership-controls]

  bucket = aws_s3_bucket.bucket-ml.id
  acl    = "private"
}

data "aws_iam_policy_document" "bucket_policy_doc_images" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    principals {
      identifiers = ["*"]
      type        = "AWS"
    }
    resources = [
      "${aws_s3_bucket.bucket-ml.arn}/parking-status-dataset.tgz"
    ]
  }
}

resource "aws_s3_bucket_policy" "bucket_policy-images" {
  bucket = aws_s3_bucket.bucket-ml.id
  policy = data.aws_iam_policy_document.bucket_policy_doc_images.json
}
