module "db" {
  source                  = "terraform-aws-modules/rds-aurora/aws"
  version                 = "~> 2.0"
  name                    = "aurora-rds-mysql"
  engine                  = "aurora"
  engine_mode             = "serverless"
  instance_type           = "db.t2.small" # obligatoire, mais ignoré dans le cadre d'un déploiement serverless
  replica_scale_enabled   = false         # nécessaire pour pouvoir faire un déploiement serverless
  replica_count           = 0             # nécessaire pour pouvoir faire un déploiement serverless
  vpc_id                  = var.vpc_id
  subnets                 = var.private_subnets
  allowed_security_groups = [var.sg_id]
  allowed_cidr_blocks = [
    "10.0.0.0/16",
    "10.0.0.0/8", # correspond au block des worker nodes du cluster EKS
  ]
  database_name       = "wordpressdb"
  username            = "dbadmin"
  password            = "totototototo"
  skip_final_snapshot = "true"
}
