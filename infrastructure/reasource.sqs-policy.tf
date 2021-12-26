data "aws_iam_policy_document" "sqs-allow-sns" {
  statement {
    actions = [
      "sqs:SendMessage"
    ]
    principals {
      identifiers = ["sns.amazonaws.com"]
      type = "Service"
    }
    resources = [
      "*",
    ]
    effect = "Allow"
  }
}
