# Boilerplate web simple

Cette application est une base prête à modifier pour créer un petit outil web.

Elle contient déjà :

- une inscription et une connexion
- un dashboard protégé
- une gestion de notes
- une configuration simple avec Supabase et Vercel

## 1. Installer

Installez Node.js, puis ouvrez ce dossier dans votre terminal.

Lancez :

```bash
npm install
```

Créez un fichier `.env` en copiant `.env.example`.

Dans `.env`, remplacez les valeurs par celles de votre projet Supabase :

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Dans Supabase, ouvrez l’éditeur SQL et copiez le contenu du fichier `supabase-schema.sql`.

## 2. Lancer le projet

Lancez :

```bash
npm run dev
```

Ouvrez l’adresse affichée dans le terminal.

## 3. Où modifier le code

Les fichiers importants sont dans `src`.

- `src/pages` : les grandes pages de l’application
- `src/components` : les petits blocs réutilisables
- `src/hooks` : la logique partagée
- `src/services` : la connexion à Supabase
- `src/styles.css` : le style visuel

Pour modifier le dashboard, commencez par `src/pages/Dashboard.jsx`.

Pour modifier les notes, regardez `src/components/NoteForm.jsx` et `src/components/NotesList.jsx`.

## 4. Comment ajouter une fonctionnalité simple

Faites un petit changement à la fois.

Exemple :

1. Ajoutez un champ dans le formulaire.
2. Ajoutez ce champ dans Supabase.
3. Affichez ce champ dans la liste.
4. Testez dans le navigateur.
5. Faites un commit Git si tout fonctionne.

## 5. Déployer

Créez un compte Vercel.

Importez ce projet dans Vercel.

Dans les réglages du projet Vercel, ajoutez les mêmes variables que dans `.env` :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Cliquez ensuite sur Deploy.

## 6. Que faire si ça ne marche pas

Vérifiez dans cet ordre :

1. `npm install` a bien été lancé.
2. Le fichier `.env` existe.
3. Les clés Supabase sont correctes.
4. Le fichier `supabase-schema.sql` a bien été exécuté dans Supabase.
5. Vous avez relancé `npm run dev` après avoir modifié `.env`.

Si le projet est cassé après un changement, lancez :

```bash
npm run reset
```

Cela revient au dernier commit Git stable.
