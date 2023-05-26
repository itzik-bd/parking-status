variable "environment_name" {
  type = string
}

variable "camera_address" {
  type = string
}

variable "credentials_user" {
  type      = string
  sensitive = true
}

variable "credentials_pass" {
  type      = string
  sensitive = true
}

variable "capture_analyzer_image_url" {
  type = string
}