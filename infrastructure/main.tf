terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.66"
    }
  }

  backend "s3" {
    profile = "parking-status-cicd"
    region = "eu-central-1"

    encrypt = true
    bucket = "parking-status-tfstate"
    key    = "terraform.tfstate"
  }
}

provider "aws" {
  profile = "parking-status-cicd"
  region = "eu-central-1"

  default_tags {
    tags = {
      App = var.app_name
      Env = var.environment_name
    }
  }
}
