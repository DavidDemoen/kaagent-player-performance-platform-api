#!/bin/bash
set -a
source .env.local
set +a

echo "🛑 Stopping databases..."
docker stop kaagent-club-postgres kaagent-eval-postgres 2>/dev/null || true
docker rm kaagent-club-postgres kaagent-eval-postgres 2>/dev/null || true
docker volume rm postgres_club_data postgres_eval_data 2>/dev/null || true

echo "✅ Databases stopped (volumes preserved)"