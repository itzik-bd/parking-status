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
    key     = "terraform.tfstate"
  }
}

locals {
  app_name = "parking-status"

  default_tags = {
    App = local.app_name
    Env = var.environment_name
  }
  nodejs_version        = "nodejs18.x"
  resource_prefix       = "${local.app_name}--${var.environment_name}--"
  resource_prefix_slim  = "${local.app_name}-${var.environment_name}-"
  log_retention_days    = 7
  refresh_delay_seconds = 15
  authorizer_region     = "us-east-1"
}

provider "aws" {
  region = "eu-central-1"

  default_tags {
    tags = local.default_tags
  }
}

provider "aws" {
  alias  = "useast1"
  region = local.authorizer_region

  default_tags {
    tags = local.default_tags
  }
}

module "lambda_edge_rule" {
  source = "./authorizer-lambda-edge"
  providers = {
    aws = aws.useast1
  }

  app_name           = local.app_name
  environment_name   = var.environment_name
  iam_for_lambda_arn = aws_iam_role.iam_role.arn
  nodejs_version     = local.nodejs_version
  name_prefix        = local.resource_prefix
  credentials_user   = var.credentials_user
  credentials_pass   = var.credentials_pass
}

# it's here as a workaround as the log group name contains the region
resource "aws_cloudwatch_log_group" "log-retention-authorizer" {
  name              = "/aws/lambda/${local.authorizer_region}.${module.lambda_edge_rule.authorizer_lambda_edge_name}"
  retention_in_days = local.log_retention_days
}
