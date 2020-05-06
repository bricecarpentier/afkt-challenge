# Terraform

Ces différents modules gèrent chacun un aspect du déploiement.

- [cert](./cert/) provisionne un certificat valide
- [vpc](./vpc/) provisionne notre cluster privé virtuel, qui contiendra le cluster EKS et le cluster RDS
- [eks](./eks/) provisionne le cluster kubernetes managé par aws
- [db](./db/) provisionne le cluster RDS Aurora mysql. Ce dossier aurait du s'appeler `rds` pour un naming plus cohérent.

J'exploite dans la mesure du possible [les modules terraform-aws-modules](https://registry.terraform.io/modules/terraform-aws-modules).
