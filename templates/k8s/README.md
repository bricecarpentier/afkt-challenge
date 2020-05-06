# k8s

Collection de templates [mustache](http://mustache.github.io/) exploités par `aha` pour configurer notre cluster kubernetes.

- [aurora](./aurora.yaml.mustache) génère le service permettant d'accéder au cluster RDS depuis les pods
- [secret](./secret.yaml.mustache) crée le secret contenant le mot de passe mysql afin d'éviter de passer cette information en dur dans le containeur ou en variable d'environnement (qui sont accessibles en clair également)
- [wpapp](./wpapp.yaml.mustache) provisionne un pod contenant un conteneur nginx et un conteneur wordpress utilisant php-fpm et communiquant via fastcgi
- [service](./service.yaml.mustache) expose le conteneur nginx de chaque pod sous forme de loadbalancer aws
