variable "app_name" {
  type = string
}

variable "environment_name" {
  type = string
}

variable "camera_address" {
  type = string
}

locals {
  pending_dir = "pending"
  processed_dir = "processed"
  nodejs_version = "nodejs14.x"
}
