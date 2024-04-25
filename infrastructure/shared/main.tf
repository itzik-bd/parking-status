terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.46"
    }
  }

  backend "s3" {
    region  = "eu-central-1"
    encrypt = true
    bucket  = "parking-status-tfstate"
    key     = "shared.tfstate"
  }
}

locals {
  app_name = "parking-status"

  default_tags = {
    App         = local.app_name
    SharedInfra = "true"
  }
}

provider "aws" {
  region = "eu-central-1"

  default_tags {
    tags = local.default_tags
  }
}