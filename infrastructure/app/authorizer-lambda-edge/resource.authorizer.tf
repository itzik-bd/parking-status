terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.65"
    }
  }
}

variable "app_name" {}
variable "environment_name" {}
variable "iam_for_lambda_arn" {}
variable "nodejs_version" {}
variable "name_prefix" {}
variable "credentials_user" { sensitive = true }
variable "credentials_pass" { sensitive = true }

output "authorizer_lambda_edge_qualified_arn" {
  value = aws_lambda_function.authorizer_lambda_edge.qualified_arn
}
output "authorizer_lambda_edge_name" {
  value = aws_lambda_function.authorizer_lambda_edge.function_name
}

resource "local_file" "credentials_file" {
  filename = "${path.root}/../../lambda/authorizer/credentials.js"
  content  = <<EOF
// this file was auto-generated by build process (terraform)
exports.USER = '${var.credentials_user}';
exports.PASS = '${var.credentials_pass}';
EOF
}

data "archive_file" "authorizer-code" {
  depends_on  = [local_file.credentials_file]
  type        = "zip"
  source_dir  = "${path.root}/../../lambda/authorizer"
  output_path = "${path.root}/../../target/authorizer.zip"
}

resource "aws_lambda_function" "authorizer_lambda_edge" {
  filename         = data.archive_file.authorizer-code.output_path
  source_code_hash = data.archive_file.authorizer-code.output_base64sha256

  function_name = "${var.name_prefix}authorizer"
  role          = var.iam_for_lambda_arn
  handler       = "lambda.handler"
  runtime       = var.nodejs_version
  timeout       = 5
  publish       = true
}
