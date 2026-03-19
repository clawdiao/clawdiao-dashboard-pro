#!/bin/bash
# Gerador de licenças de teste
# Uso: ./generate-license.sh email@exemplo.com

if [ -z "$1" ]; then
  echo "Uso: $0 email@exemplo.com"
  exit 1
fi

EMAIL=$1
SECRET="clawdiao_secret_123"

curl -X POST http://localhost:3001/generate-license \
  -H "Authorization: Bearer $SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\"}"

echo ""
