# Artifakt Challenge

## TL;DR

```bash
npx @softwaregardeners/aha deploy a.superb.domainname.tld --dbPassword=<a secure db password>
```

`aha` signifie "an hour ago"

## Requirements:

- les commandes `aws` (package `aws-cli`), `terraform` et `kubectl`, et bien évidemment `npx`
- Une hosted zone route53 pour le domaine choisi (requis pour la génération du certificat ssl). Cette zone doit être la bonne (= que des enregistrements NS pointent dessus). Voir limitations. **Attention: pour le domaine `a.superb.domainname.tld`, la zone considérée est `suberb.domainname.tld`**

## Abstract

La solution se présente sous forme d'une application en ligne de commande développé avec node.js et exécutée via npx (de manière à ne pas nécessiter d'installation globale et à assurer une mise à jour systématique avant exécution).
Cette application a sensiblement le flow suivant:

1. vérification de la présence de binaires essentiels sur le système (aws-cli, terraform, kubectl)
2. création d'un repertoire dans le home directory de l'utilisateur
3. création de fichiers .tf dans ce repertoire, passage de paramètres permettant de générer le vpc, le cluster eks et le cluster rds
4. configuration de kubectl à partie de l'output du provisionning du cluster eks
5. génération de spec k8s à partir de template présent dans le package et de l'output du provisionning terraform (certificats, password et endpoint db)
6. application desdites specs

## Limitations

- Pour une raison que je n'ai pas réussi à déterminer, Chrome ne semble pas traiter correctement les feuilles de style issues de wordpress et envoyées par nginx. Firefox et Safari (desktop et mobile) les acceptent sans problème.
- Il aurait été nettement préférable de mettre le cluster et le cluster rds dans deux vpc différents et de créer un point de peering entre les deux. Malheureusement après quelques tentatives infructueuses j'ai préféré mettre cet élément de côté afin de livrer une solution acceptable mais perfectible plutôt que rien.
- Il est pour le moment nécessaire qu'une hosted zone soit présente dans Route53 pour le domaine demandé **et** que cette zone soit valide (= que des enregistrements NS pointent dessus)

## Améliorations

- Il aurait été encore plus sexy de générer un nom de domaine automatique à la manière de `now.sh`. Ce ne serait d'ailleurs pas nécessairement beaucoup plus compliqué mais un petit peu hors-scope
- Le mot de passe pourrait être récupéré via un prompt s'il n'est pas passé en paramètre
