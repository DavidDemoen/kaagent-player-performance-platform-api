#!/bin/bash
set -e

echo "⚠️  WARNING: This will DELETE all database volumes and data!"
read -p "Type 'yes' to confirm: " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Cancelled"
  exit 1
fi

set -a
source .env.local
set +a

echo "🗑️  Destroying databases and volumes..."
docker stop kaagent-club-postgres kaagent-eval-postgres 2>/dev/null || true
docker rm kaagent-club-postgres kaagent-eval-postgres 2>/dev/null || true
docker volume rm postgres_club_data postgres_eval_data 2>/dev/null || true

echo "💥 Database completely destroyed!"