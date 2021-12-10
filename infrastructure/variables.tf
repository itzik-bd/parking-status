variable "app_name" {
  type = string
}

variable "environment_name" {
  type = string
}

variable "camera_address" {
  type = string
}

variable "camera_poll_interval" {
  type = string
}

locals {
  pending_dir = "pending"
  processed_dir = "processed"
}
