resource "aws_s3_bucket" "bucket" {
  bucket = "${var.app_name}--${var.environment_name}"
  acl = "private"
}
