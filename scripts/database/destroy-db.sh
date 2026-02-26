#!/bin/bash
set -e

echo "⚠️  WARNING: This will DELETE all database volumes and data!"
read -p "Type 'yes' to confirm: " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Cancelled"
  exit 1
fi



echo "🗑️  Destroying databases and volumes..."
docker-compose -f infra/docker/docker-compose.yaml --env-file .env down -v

echo "💥 Database completely destroyed!"