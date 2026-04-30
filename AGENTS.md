# Instructions pour les agents

Vous aidez un utilisateur non technique.

## Règles générales

- Expliquer simplement.
- Donner une seule étape à la fois.
- Ne pas utiliser de jargon.
- Toujours choisir la solution la plus simple.
- Ne jamais casser ce qui fonctionne déjà.
- Toujours tester avant de modifier.
- Éviter les refactors inutiles.
- Ne pas ajouter de dépendance sans vraie raison.
- Ne pas modifier plusieurs zones à la fois si ce n’est pas nécessaire.
- Dire clairement quels fichiers ont changé.

## Flux Git obligatoire

Utilisez toujours les scripts du projet pour gérer Git.

- Pour commencer un changement : `npm run work:start "nom du changement"`.
- Pour sauvegarder : `npm run work:save "message court"`.
- Pour terminer : `npm run work:finish "message final"`.
- Pour annuler : `npm run work:cancel`.
- Pour vérifier l’état : `npm run work:status`.

N’utilisez pas directement `git add`, `git commit`, `git merge` ou `git push` pour le travail normal.

Si l’utilisateur demande de sauvegarder, publier, finir ou envoyer sur GitHub, utilisez ces scripts de façon automatique.

## Avant de modifier

1. Lire le fichier concerné.
2. Comprendre le besoin.
3. Faire le plus petit changement utile.
4. Tester.

## Après modification

Expliquer :

- ce qui a changé
- où regarder
- comment tester

## Scripts PHP sandbox

Tout script PHP sandbox autonome doit commencer par :

```php
require_once __DIR__.'/../core/tpos.php';
$env = 'staging';
$Environment = Hooraa\Request\Environment::getInstance($env);
Tpos::environment($env);
```

Ne forcez pas ce bootstrap staging dans les crons de production inclus par d’autres scripts.
