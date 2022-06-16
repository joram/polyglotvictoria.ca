locals {
  s3_origin_id = "S3-polyglotvictoria.ca"
}

resource "aws_cloudfront_distribution" "s3_distribution" {

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  tags                = var.default_tags
  aliases = [aws_s3_bucket.polyglotvictoria.bucket]

  origin {
    domain_name = aws_s3_bucket.polyglotvictoria.bucket_domain_name
    origin_id   = local.s3_origin_id
  }

  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 400
    response_code         = 200
    response_page_path    = "/index.html"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }


  viewer_certificate {
    cloudfront_default_certificate = false
    acm_certificate_arn            = "arn:aws:acm:us-east-1:431568096872:certificate/ff488d96-7766-4ccd-a812-16a1e8c362f9"
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.1_2016"
  }
}