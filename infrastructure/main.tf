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

locals {
  default_tags = {
    App = var.app_name
    Env = var.environment_name
  }
  nodejs_version = "nodejs14.x"
  resource_prefix = "${var.app_name}--${var.environment_name}--"
}

provider "aws" {
  profile = "parking-status-cicd"
  region = "eu-central-1"

  default_tags {
    tags = local.default_tags
  }
}

provider "aws" {
  alias = "useast1"

  profile = "parking-status-cicd"
  region = "us-east-1"

  default_tags {
    tags = local.default_tags
  }
}

module "lambda_edge_rule" {
  source = "./authorizer-lambda-edge"
  providers = {
    aws = aws.useast1
  }

  app_name = var.app_name
  environment_name = var.environment_name
  iam_for_lambda_arn = aws_iam_role.iam_for_lambda.arn
  nodejs_version = local.nodejs_version
  name_prefix = local.resource_prefix
}
