# Règles Git simples

Git sert à revenir en arrière si un changement casse le projet.

Vous n’êtes pas obligé de l’utiliser tous les jours.

## Règles

- Ne pas utiliser de branches.
- Faire un commit avant un gros changement.
- Modifier une seule chose à la fois.
- Tester avant de faire un commit.
- Si un problème arrive, revenir à la version précédente.

## Commandes utiles

Voir les changements :

```bash
git status
```

Enregistrer une version stable :

```bash
git add .
git commit -m "v1.1 - petite amélioration"
```

Revenir au dernier commit stable :

```bash
npm run reset
```
