output "db_endpoint" {
  description = "Endpoint for RDS cluster"
  value       = module.db.this_rds_cluster_endpoint
}

output "db_username" {
  description = "Username to connect to the database"
  value       = module.db.this_rds_cluster_master_username
}

output "db_name" {
  description = "Database name to use"
  value       = module.db.this_rds_cluster_database_name
}

output "db_port" {
  description = "Port for RDS cluster"
  value       = module.db.this_rds_cluster_port
}
