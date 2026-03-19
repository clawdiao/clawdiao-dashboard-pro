#!/bin/bash
# Deploy Script — Clawdiao Dashboard PRO
# Uso: ./deploy.sh [vercel|github|all]

set -e

echo "🦁 Deploy Clawdiao Dashboard PRO"

# 1. Verificar variaveis
if [ ! -f .env ]; then
  echo "⚠ .env não encontrado. Copie .env.example para .env e preencha as chaves."
  exit 1
fi

# 2. Instalar dependencias
echo "📦 Instalando dependências..."
npm install

# 3. Testar server
echo "🧪 Testando license server..."
node stripe/license-server.js &
sleep 2
curl -s http://localhost:3001/status > /dev/null && echo "✅ License server OK" || { echo "❌ License server falhou"; exit 1; }
pkill -f "license-server.js"

# 4. Build ? (pure frontend, só copiar assets)
echo "📁 Copiando arquivos estáticos..."
cp -r dashboard-pro.html public/ 2>/dev/null || mkdir public && cp dashboard-pro.html public/
cp -r sales/checkout.html public/checkout.html 2>/dev/null || true

# 5. Deploy
case "$1" in
  vercel)
    echo "🚀 Deploy no Vercel..."
    vercel --prod --confirm
    ;;
  github)
    echo "🚀 Push para GitHub..."
    git add .
    git commit -m "Deploy $(date +%Y-%m-%d)"
    git push origin main
    ;;
  all|*)
    echo "🚀 Deploy completo (GitHub + Vercel)..."
    git add .
    git commit -m "Deploy $(date +%Y-%m-%d)"
    git push origin main
    sleep 3
    vercel --prod --confirm
    ;;
esac

echo "✅ Deploy finalizado!"
