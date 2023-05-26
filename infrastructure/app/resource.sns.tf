resource "aws_sns_topic" "analyze-finish" {
  name = "${local.resource_prefix}analize-finish"
}

resource "aws_sns_topic" "refresh" {
  name = "${local.resource_prefix}refresh"
}
