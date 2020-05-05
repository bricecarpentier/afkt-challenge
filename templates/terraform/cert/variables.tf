variable "hosted_zone_id" {
  type        = string
  description = "Id of the route53 hosted zone"
}

variable "domain_name" {
  type        = string
  description = "Domain name for which we want a certificate"
}

variable "alternative_names" {
  type        = list
  description = "list of alternative domain names we want this certificate to manage"
}
