resource "aws_sns_topic" "analyze-finish" {
  name = "${var.app_name}--${var.environment_name}--analize-finish"
}

resource "aws_sns_topic" "refresh" {
  name = "${var.app_name}--${var.environment_name}--refresh"
}
