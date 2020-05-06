# Deploy

Les tasks sont exécutées dans cet ordre:

- [ensure](./ensure.ts)
- [terraform](./terraform.ts)
- [kubectl](./kubectl.ts)
- [post-process](./post-process)

La majorité des tasks se ressemblant, je conseille de jeter un oeil à:

- [ensure-hosted-zone](./ensure-hosted-zone.ts) vérifie que zone est bien définie dans Route53 pour le domaine passé en paramètre **et** que les enregistrements NS de cette zone correspondent bien à ceux d'AWS
- [ensure-db-password](./ensure-db-password.ts) vérifie qu'un mot de passe non-vide a bien été passé en paramètre et le cas échéant le met dans le [contexte](./types.d.ts)
- [terraform-rds](./terraform-rds.ts) lance `terraform init && terraform plan && terraform apply && terraform output` non sans avoir préalablement créé un fichier `terraform.tfvars.json` dans le répertoire de travail
- [kubectl-expose-pods](./kubectl-expose-pods.ts) rend le template `service.yaml.mustache`
- [kubectl-apply](./kubectl-apply.ts) applique chaque fichier de configuration kubernetes dans le répertoire de travail
