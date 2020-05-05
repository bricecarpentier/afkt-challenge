# will be used by both the eks and db modules
output "vpc_id" {
  description = "VPC id"
  value       = module.vpc.vpc_id
}

# will be used by both the eks and db modules
output "private_subnets" {
  description = "Private subnets"
  value = module.vpc.private_subnets
}

# will be used by the eks module
output "cluster_name" {
  description = "Cluster name"
  value = local.cluster_name
}