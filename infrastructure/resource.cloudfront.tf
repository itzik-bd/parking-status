locals {
  s3_origin_id = aws_s3_bucket.bucket.id
}
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.bucket.bucket_regional_domain_name
    origin_id   =  local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.s3_distribution_access_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" // CachingOptimized
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    lambda_function_association {
      event_type   = "viewer-request"
      lambda_arn   = module.lambda_edge_rule.authorizer_lambda_edge_qualified_arn
      include_body = false
    }
  }

  # the status.json file contain the state,
  # so it shouldn't be cached
  ordered_cache_behavior {
    path_pattern     = "/status.json"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.s3_origin_id
    cache_policy_id        = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" // CachingDisabled
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    lambda_function_association {
      event_type   = "viewer-request"
      lambda_arn   = module.lambda_edge_rule.authorizer_lambda_edge_qualified_arn
      include_body = false
    }
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["IL"]
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    minimum_protocol_version = "TLSv1"
  }
}

resource "aws_cloudfront_origin_access_identity" "s3_distribution_access_identity" {
}
