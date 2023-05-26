resource "aws_s3_bucket" "bucket-images-periodic" {
  bucket = "${local.resource_prefix}images-periodic"
}