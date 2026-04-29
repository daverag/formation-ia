#!/usr/bin/env bash
set -e

DEFAULT_REPO_URL="https://github.com/daverag/formation-ia.git"
REPO_URL="${FORMATION_IA_REPO_URL:-$DEFAULT_REPO_URL}"
APP_DIR="${FORMATION_IA_DIR:-formation-ia}"

if ! command -v git >/dev/null 2>&1; then
  echo "Git est introuvable."
  echo "Installez Git, puis relancez cette commande."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose est introuvable."
  echo "Installez Docker Desktop, ouvrez-le, puis relancez cette commande."
  exit 1
fi

if [ "$REPO_URL" = "$DEFAULT_REPO_URL" ]; then
  echo "URL du repo Git à cloner :"
  read -r -p "> " REPO_URL
fi

if [ -z "$REPO_URL" ]; then
  echo "Installation annulée. Aucune URL Git fournie."
  exit 1
fi

if [ -d "$APP_DIR" ]; then
  echo "Le dossier $APP_DIR existe déjà."
  echo "Entrez dans ce dossier et lancez ./setup."
  exit 1
fi

echo ""
echo "Clonage du projet..."
git clone "$REPO_URL" "$APP_DIR"

cd "$APP_DIR"

echo ""
echo "Lancement du setup..."
./setup
