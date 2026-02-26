#!/bin/bash
set -e
echo "🐘 Starting databases..."
docker-compose -f infra/docker/docker-compose.yaml --env-file .env up -d
echo "🔄 Generating migrations..."
pnpm db:generate:club && pnpm db:generate:evaluations

pnpm db:migrate:club && pnpm  db:migrate:evaluations
echo "✅ Databases are ready!"
