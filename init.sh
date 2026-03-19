#!/bin/bash
# Primeira execução — copia arquivos e instala deps

echo "🦁 Clawdiao Dashboard PRO — Setup"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "⚠ .env criado. Preencha as chaves Stripe e rode npm install"
fi

if [ ! -d node_modules ]; then
  npm install
fi

echo "✅ Setup completo!"
echo "👉 Rode: npm start (para testar) ou ./deploy.sh all (para deploy)"
