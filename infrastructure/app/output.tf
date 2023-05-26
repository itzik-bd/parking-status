output "application-url" {
  description = "Application URL"
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}

output "distribution-id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.s3_distribution.id
}
