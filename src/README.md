# aha

Application CLI développée en [TypeScript](typescriptlang.org) avec [oclif](https://oclif.io/).

Les dossiers intéressants sont:

- [commands](./commands) contient les trois commandes principales (`deploy`, `destroy` et `author`)
- [utils](./utils) aurait du s'appeler `tasks` et contient les sous-tasks permettant à chaque commande de s'exécuter.

Les commandes sont essentiellement des listes imbriquées de task décrivant leur flux.
