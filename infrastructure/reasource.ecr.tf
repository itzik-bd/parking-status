resource "aws_ecr_repository" "capture-analyzer-registry" {
  name                 = "${local.resource_prefix_slim}capture-analyzer"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}