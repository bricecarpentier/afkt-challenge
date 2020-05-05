# those variables are to be filled with values from the vpc module's output
variable "cluster_name" {
  description = "Cluster name"
  type = string
}

variable "vpc_id" {
  description = "id of the VPC we want to include this rds cluster in"
  type = string
}

variable "private_subnets" {
  description = "ids of the subnets we want to include this rds cluster in"
  type = list
}
