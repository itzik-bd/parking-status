terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.66"
    }
  }
}

variable "app_name" {}
variable "environment_name" {}
variable "iam_for_lambda_arn" {}

output "authorizer_lambda_edge_qualified_arn" {
  value = aws_lambda_function.authorizer_lambda_edge.qualified_arn
}

data "archive_file" "authorizer-code" {
  type        = "zip"
  source_dir  = "${path.root}/../lambda/authorizer"
  output_path = "${path.root}/../target/authorizer.zip"
}

resource "aws_lambda_function" "authorizer_lambda_edge" {
  filename          = data.archive_file.authorizer-code.output_path
  source_code_hash  = data.archive_file.authorizer-code.output_base64sha256

  function_name     = "${var.app_name}--${var.environment_name}--authorizer"
  role              = var.iam_for_lambda_arn
  handler           = "lambda.handler"
  runtime           = "nodejs14.x"
  timeout           = 5
  publish           = true
}