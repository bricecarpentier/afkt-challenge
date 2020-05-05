output "vpc_id" {
  description = "VPC id"
  value       = module.vpc.vpc_id
}

output "private_subnets" {
  description = "Private subnets"
  value = module.vpc.private_subnets
}

output "cluster_name" {
  description = "Cluster name"
  value = local.cluster_name
}