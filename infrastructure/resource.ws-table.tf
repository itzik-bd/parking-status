resource "aws_dynamodb_table" "ws-table" {
  name           = "${var.app_name}--${var.environment_name}--ws-connections"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "connectionId"

  attribute {
    name = "connectionId"
    type = "S"
  }

}
