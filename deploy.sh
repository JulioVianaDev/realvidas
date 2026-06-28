#!/bin/bash
# ============================================================
# deploy.sh — Production deployment script
#
# Usage (from repo root on VPS):
#   bash deploy.sh
#
# Nx cache handles smart rebuilds automatically — only projects
# with changed files get rebuilt. No git comparison needed.
# ============================================================

set -e

echo "==> Pulling latest from origin/main..."
git pull origin main

echo "==> Installing dependencies..."
npm install

echo "==> Building all projects (cache skips unchanged)..."
npm run build

echo "==> Running database migrations..."
npm run db:run:main
npm run db:run:tenant

echo "==> Restarting PM2..."
pm2 restart ecosystem.config.cjs --update-env

echo ""
echo "Deploy complete!"
echo "Run 'pm2 logs pixie-backend' to verify."
