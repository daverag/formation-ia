# Règles pour l’assistant

Tu aides un utilisateur non technique.

## Règles

- Expliquer simplement.
- Donner une seule étape à la fois.
- Ne pas utiliser de jargon.
- Toujours choisir la solution la plus simple.
- Toujours garder la structure existante et ne jamais casser les fonctionnalités existantes.
- Ne jamais casser ce qui fonctionne déjà.
- Ne jamais réécrire toute l'application.
- Modifier seulement ce qui est nécessaire pour répondre à la demande.
- Préférer les petits changements progressifs.
- Réutiliser les composants existants quand c'est possible.
- Suivre le design et les habitudes déjà présents dans le projet.
- Utiliser Tailwind CSS pour toute l'interface.
- Pour les pages, composants et styles UI, utiliser Tailwind CSS par défaut.
- Ne pas ajouter de complexité inutile.
- Garder le code simple et lisible.
- En cas de doute, demander une précision au lieu de faire un gros changement.
- Améliorer et étendre l'application actuelle, ne pas la reconstruire.
- L'utilisateur peut écrire en français. Interpréter ses demandes clairement et les appliquer au projet existant.
- Ne jamais renommer ou supprimer des fichiers existants sauf si l'utilisateur le demande explicitement.
- Toujours tester avant de modifier.
- Éviter les refactors inutiles.
- Ne pas ajouter de dépendance sans vraie raison.
- Ne pas modifier plusieurs zones à la fois si ce n’est pas nécessaire.
- Dire clairement quels fichiers ont changé.

## Design

- Toujours garder une interface propre et moderne.
- Utiliser des espacements constants, avec assez d'air entre les éléments.
- Utiliser une mise en page simple avec une hiérarchie claire.
- Préférer les mises en page avec cartes pour le contenu.
- Utiliser des coins arrondis.
- Ajouter des ombres subtiles pour donner de la profondeur.
- Utiliser au maximum 2 ou 3 couleurs.
- Garder des couleurs douces, jamais trop saturées.
- S'inspirer des applications SaaS modernes comme Notion, Linear ou Stripe.
- Garder un style propre, minimal et professionnel.

## UX

- Garder les interactions simples et intuitives.
- Éviter les fonctionnalités inutiles.
- Chaque élément doit avoir une utilité claire.
- Les boutons doivent être bien visibles.
- Les actions importantes doivent ressortir.
- Les formulaires doivent rester simples et minimaux.

## Mise en page

- Réutiliser les composants de mise en page existants comme le header et le menu.
- Ne pas créer un nouveau système de mise en page.
- Suivre la structure actuelle des pages.
- Les nouvelles pages doivent être cohérentes avec les pages existantes.
- Utiliser une hiérarchie typographique claire : grand titre, sous-titre moyen, petit texte de contenu.
- Bien aligner les éléments, sans espacements aléatoires.
- Garder des marges cohérentes entre les pages.
- Ne pas surcharger l'interface.
- Préférer la simplicité à la complexité.

## Flux Git obligatoire

Utilise toujours les scripts du projet pour gérer Git.

- Pour commencer un changement : `npm run work:start "nom du changement"`.
- Pour sauvegarder : `npm run work:save "message court"`.
- Pour terminer : `npm run work:finish "message final"`.
- Pour annuler : `npm run work:cancel`.
- Pour vérifier l’état : `npm run work:status`.

N’utilise pas directement `git add`, `git commit`, `git merge` ou `git push` pour le travail normal.

Si l’utilisateur demande de sauvegarder, publier, finir ou envoyer sur GitHub, utilise ces scripts de façon automatique.

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
