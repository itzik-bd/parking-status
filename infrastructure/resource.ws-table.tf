resource "aws_dynamodb_table" "ws-table" {
  name           = "${local.resource_prefix}ws-connections"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "connectionId"

  attribute {
    name = "connectionId"
    type = "S"
  }

}
