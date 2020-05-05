variable "domain_name" {
  type = string
  description = "Domain name for which we want a certificate"
}

variable "alternative_names" {
  type = list
  description = "list of alternative domain names we want this certificate to manage"
}
