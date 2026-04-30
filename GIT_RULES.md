# Sauvegarde simple du projet

Git sert à garder une version stable du projet et à revenir en arrière si un changement casse quelque chose.

Vous n’avez pas besoin d’apprendre Git pour utiliser ce projet. Utilisez seulement les commandes ci-dessous.

## Commencer un changement

Avant de modifier le projet :

```bash
npm run work:start "nom du changement"
```

Exemple :

```bash
npm run work:start "ajout du champ telephone"
```

Cette commande prépare un espace de travail séparé et l’envoie sur GitHub.

## Sauvegarder pendant le travail

Quand une petite étape fonctionne :

```bash
npm run work:save "message court"
```

Exemple :

```bash
npm run work:save "ajout du champ dans le formulaire"
```

Cette commande teste le projet, sauvegarde les fichiers et envoie la sauvegarde sur GitHub.

## Terminer le changement

Quand tout est terminé et testé :

```bash
npm run work:finish "message final"
```

Exemple :

```bash
npm run work:finish "ajout du telephone aux notes"
```

Cette commande teste le projet, remet le changement dans la version stable et envoie la version stable sur GitHub.

## Voir l’état du projet

Si vous ne savez plus où vous êtes :

```bash
npm run work:status
```

## Annuler le travail en cours

Si le changement en cours est mauvais et doit être supprimé :

```bash
npm run work:cancel
```

La commande demande une confirmation avant de supprimer le travail.

## Règles simples

- Commencez toujours par `npm run work:start`.
- Sauvegardez souvent avec `npm run work:save`.
- Terminez avec `npm run work:finish`.
- Ne tapez pas de commandes `git add`, `git commit`, `git merge` ou `git push` à la main.
- Ne mettez jamais `.env` ou `.admin-credentials.txt` dans Git.
