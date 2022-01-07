locals {
  s3_web_app_origin_id = aws_s3_bucket.bucket-web-app.id
  s3_images_origin_id = aws_s3_bucket.bucket-images.id
  ws_gateway_id = "ws"
}
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.bucket-web-app.bucket_regional_domain_name
    origin_id   =  local.s3_web_app_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.s3_distribution_access_identity.cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = aws_s3_bucket.bucket-images.bucket_regional_domain_name
    origin_id   =  local.s3_images_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.s3_distribution_access_identity.cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = replace(aws_apigatewayv2_api.api-gateway.api_endpoint, "wss://", "")
    origin_id   = local.ws_gateway_id

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1","TLSv1.1"]
    }
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.s3_web_app_origin_id
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" // CachingOptimized
    compress               = true
    viewer_protocol_policy = "https-only"

    lambda_function_association {
      event_type   = "viewer-request"
      lambda_arn   = module.lambda_edge_rule.authorizer_lambda_edge_qualified_arn
      include_body = false
    }
  }

  # the status.json file contain the state,
  # so it shouldn't be cached
  ordered_cache_behavior {
    path_pattern     = "/images/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.s3_images_origin_id
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" // CachingOptimized
    compress               = true
    viewer_protocol_policy = "https-only"

    lambda_function_association {
      event_type   = "viewer-request"
      lambda_arn   = module.lambda_edge_rule.authorizer_lambda_edge_qualified_arn
      include_body = false
    }
  }

  # WebSocket
  ordered_cache_behavior {
    path_pattern     = "/${local.ws-stage-name}"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.ws_gateway_id
    cache_policy_id        = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" // CachingDisabled
    viewer_protocol_policy = "https-only"
    origin_request_policy_id = aws_cloudfront_origin_request_policy.web-socket-request-policy.id

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

resource "aws_cloudfront_origin_request_policy" "web-socket-request-policy" {
  name    = "websocket"
  cookies_config {
    cookie_behavior = "none"
  }
  headers_config {
    header_behavior = "whitelist"
    headers {
      items = [
        "Sec-WebSocket-Key",
        "Sec-WebSocket-Version",
        "Sec-WebSocket-Protocol",
        "Sec-WebSocket-Accept"
      ]
    }
  }
  query_strings_config {
    query_string_behavior = "none"
  }
}
