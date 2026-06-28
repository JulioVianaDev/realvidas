#!/bin/sh
set -e

echo "Waiting for database to be ready..."
while ! nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
  sleep 1
done
echo "Database is ready."

cd /app/apps/backend

echo "Running main database migrations (TypeORM)..."
npm run db:run:main

echo "Running tenant database migrations (TypeORM)..."
npm run db:run:tenant

echo "Starting NestJS application..."
exec node dist/main.js
