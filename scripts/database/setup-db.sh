#!/bin/bash
set -e
echo "🐘 Starting databases..."
docker-compose -f infra/docker/docker-compose.yaml --env-file .env.local up -d
echo "🔄 Generating migrations..."
# Generate database migrations
pnpm -F api db:generate:club && pnpm -F api db:generate:evaluations

# Run database migrations
pnpm -F api db:migrate:club && pnpm -F api db:migrate:evaluations
echo "✅ Databases are ready!"
