provider "aws" {
}

module "cert" {
  source = "github.com/azavea/terraform-aws-acm-certificate?ref=2.0.1"


  domain_name               = var.domain_name
  subject_alternative_names = var.alternative_names
  hosted_zone_id            = var.hosted_zone_id
  validation_record_ttl     = "60"
}
