resource "aws_dynamodb_table" "ws-table" {
  name             = "${local.resource_prefix}ws-connections"
  billing_mode     = "PROVISIONED"
  read_capacity    = 1
  write_capacity   = 1
  hash_key         = "connectionId"
  stream_enabled   = true
  stream_view_type = "KEYS_ONLY"

  attribute {
    name = "connectionId"
    type = "S"
  }

}
