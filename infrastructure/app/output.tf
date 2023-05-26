output "application_url" {
  description = "Application URL"
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}
