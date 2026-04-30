# Boilerplate web simple

Cette application est une base prête à modifier pour créer un petit outil web.

Elle contient déjà :

- une inscription et une connexion
- un dashboard protégé
- une gestion de notes
- un backend local avec une API prête à étendre
- une configuration simple avec Supabase et Vercel

## 1. Installer le projet

Installez Docker Desktop, puis lancez cette commande dans votre terminal :

```bash
curl -fsSL https://raw.githubusercontent.com/daverag/formation-ia/main/install.sh | bash
```

Si le repo est privé ou pas encore publié, utilisez :

```bash
FORMATION_IA_REPO_URL=https://github.com/daverag/formation-ia.git bash -c "$(curl -fsSL https://raw.githubusercontent.com/daverag/formation-ia/main/install.sh)"
```

Le script clone le projet, puis lance automatiquement `./setup`.

Si le projet est déjà cloné, ouvrez ce dossier dans votre terminal.

Lancez :

```bash
./setup
```

Le script va :

- créer le fichier `.env`
- récupérer les clés Supabase
- lancer Docker
- appliquer la première migration
- créer le compte admin
- écrire les identifiants dans `.admin-credentials.txt`

Ouvrez ensuite l’adresse affichée à la fin du script.

Avec la valeur par défaut :

```text
http://localhost:8080
```

La première installation peut prendre quelques minutes, le temps que Docker prépare le projet.

Pour arrêter le projet :

```bash
docker compose down
```

Pour relancer tout le projet ensuite :

```bash
npm run dev
```

Cette commande utilise Docker quand il fonctionne. Elle lance le frontend et le backend.

Si Docker n'est pas disponible, elle lance les deux services localement avec Node et Vite.

## 2. Informations demandées par setup

Le script demande :

- le port local de l’application
- l’URL Supabase
- le Supabase access token
- l’email admin

Le Supabase access token sert à récupérer les clés du projet et à appliquer la migration SQL.

Il reste uniquement dans le fichier local `.env`, qui est ignoré par Git.

## 3. Compte admin

Le compte admin est créé par `./setup`.

Le script génère toujours un nouveau mot de passe et l’écrit ici :

```text
.admin-credentials.txt
```

Ce fichier est ignoré par Git. Il reste sur votre ordinateur et ne part pas sur Vercel ou GitHub.

Pour régénérer seulement le compte admin :

```bash
docker compose run --rm app npm run setup-admin
```

Si le compte existe déjà, le script garde le même email et remplace le mot de passe par un nouveau.

## 4. Où modifier le code

Les fichiers importants sont dans `src`.

- `src/pages` : les grandes pages de l’application
- `src/components` : les petits blocs réutilisables
- `src/hooks` : la logique partagée
- `src/services` : la connexion à Supabase
- `src/styles.css` : le style visuel
- `backend` : l'API locale du projet

Pour modifier le dashboard, commencez par `src/pages/Dashboard.jsx`.

Pour modifier les notes, regardez `src/components/NoteForm.jsx` et `src/components/NotesList.jsx`.

Pour tester le backend :

```bash
curl http://localhost:8080/api/health
```

## 5. Commandes utiles

Relancer le projet :

```bash
npm run dev
```

Voir les logs :

```bash
docker compose logs -f
```

Arrêter un projet lancé en arrière-plan :

```bash
docker compose down
```

Construire la version de production :

```bash
docker compose run --rm app npm run build
```

Appliquer la migration Supabase :

```bash
docker compose run --rm app npm run migrate
```

## 6. Comment ajouter une fonctionnalité simple

Faites un petit changement à la fois.

Exemple :

1. Commencez le changement.
2. Modifiez une petite partie.
3. Testez dans le navigateur.
4. Sauvegardez.
5. Continuez ou terminez le changement.

Commencer :

```bash
npm run work:start "nom du changement"
```

Sauvegarder une étape :

```bash
npm run work:save "message court"
```

Terminer :

```bash
npm run work:finish "message final"
```

Voir où vous en êtes :

```bash
npm run work:status
```

Annuler le travail en cours :

```bash
npm run work:cancel
```

Ces commandes testent le projet et envoient les sauvegardes sur GitHub automatiquement.

## 7. Déployer

Créez un compte Vercel.

Importez ce projet dans Vercel.

Dans les réglages du projet Vercel, ajoutez les mêmes variables que dans `.env` :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Cliquez ensuite sur Deploy.

## 8. Que faire si ça ne marche pas

Vérifiez dans cet ordre :

1. Docker Desktop est ouvert.
2. La commande `docker compose up` est lancée dans le bon dossier.
3. Le fichier `.env` existe.
4. Les clés Supabase sont correctes.
5. Le fichier `supabase-schema.sql` a bien été exécuté dans Supabase.
6. Vous avez relancé `docker compose up` après avoir modifié `.env`.

Si le projet est cassé après un changement, lancez :

```bash
docker compose run --rm app npm run reset
```

Cela revient au dernier commit Git stable.
