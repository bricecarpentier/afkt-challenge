provider "aws" {
  region = "eu-central-1"
}

resource "aws_route53_zone" "default" {
  name = "s.afkt.software-gardeners.fr"
}

module "cert" {
  source = "github.com/azavea/terraform-aws-acm-certificate?ref=2.0.1"


  domain_name               = var.domain_name
  subject_alternative_names = var.alternative_names
  hosted_zone_id            = aws_route53_zone.default.zone_id
  validation_record_ttl     = "60"
}


output "cert_arn" {
  description = "ARN of the SSL certificate"
  value       = module.cert.arn
}
