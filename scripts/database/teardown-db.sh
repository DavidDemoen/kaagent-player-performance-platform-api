#!/bin/bash



echo "🛑 Stopping databases..."
docker-compose infra/docker/docker-compose.yaml --env-file .env down

echo "✅ Databases stopped (volumes preserved)"