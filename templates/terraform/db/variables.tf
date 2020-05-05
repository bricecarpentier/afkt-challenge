variable "vpc_id" {
  description = "id of the VPC we want to include this rds cluster in"
  type = string
}

variable "private_subnets" {
  description = "ids of the subnets we want to include this rds cluster in"
  type = list
}

variable "database_password" {
  description = "Master DB password"
  type        = string
}

variable "sg_id" {
  description = "id of the security group to allow"
  type = string
}