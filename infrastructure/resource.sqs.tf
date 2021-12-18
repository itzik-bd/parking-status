resource "aws_sqs_queue" "analyze-finish" {
  name = "${var.app_name}--${var.environment_name}--analize-finish"
}
