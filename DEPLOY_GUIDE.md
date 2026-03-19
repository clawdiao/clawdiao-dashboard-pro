# 🚀 GUIA DE DEPLOY — Clawdiao Dashboard PRO

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no [Stripe](https://stripe.com) (test mode)
- Conta no [Vercel](https://vercel.com) (ou Netlify)
- Repositório GitHub criado
- Neon DB (opcional — só para logs)

---

## 1️⃣ CONFIGURAR STRIPE

1. No Stripe Dashboard → Developers → API keys
2. Copie:
   - `STRIPE_SECRET_KEY` (sk_test_...)
   - `STRIPE_PUBLISHABLE_KEY` (pk_test_...)
3. Crie um Product → Price (R$ 297)
4. Copie o `STRIPE_PRICE_ID`
5. Em Developers → Webhooks → Add endpoint:
   - URL: `https://seu-vercel-app.vercel.app/api/webhook`
   - Events: `checkout.session.completed`
   - Copie o `STRIPE_WEBHOOK_SECRET`

---

## 2️⃣ CRIAR .env

```bash
cp .env.example .env
```

Preencha:

```env
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_PRICE_ID=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
LICENSE_SECRET=clawdiao_secret_123
FRONTEND_URL=https://seu-app.vercel.app
```

---

## 3️⃣ TESTAR LOCAL

```bash
npm install
npm start
```

- License server rodará em http://localhost:3001
- Dashboard: abra `dashboard-pro.html` no navegador
- Teste fluxo completo com Stripe test card `4242 4242 4242 4242`

---

## 4️⃣ DEPLOY NO VERCEL

```bash
# Login
vercel login

# Deploy (primeira vez)
vercel --prod

# Ou use o script
./deploy.sh all
```

O Vercel reconhecerá como estático (HTML) e servirá todos arquivos.

Para o license server, use o mesmo Vercel serverless functions:
- Mova `license-server.js` para `api/index.js` (ou use `vercel.json` para rotear)

---

## 5️⃣ CONFIGURAR LICENSE SERVER NO VERCEL

### Opção A — Serverless Function (recomendado)

```bash
mkdir -p api
mv stripe/license-server.js api/index.js
```

Edite `api/index.js` para usar `module.exports = handler` (formato Vercel).

### Opção B — Rodar separado (Railway/Render)

Suba `license-server.js` em um serviço Node.js separado e aponte `LICENSE_SERVER_URL` no dashboard.

---

## 6️⃣ ATUALIZAR URLs NO DASHBOARD

Em `dashboard-pro.html`, na seção do script de verificação, altere:

```js
fetch('http://localhost:3001/verify-license/' + key)
```

Para a URL do seu license server online (ex: `https://seu-api.vercel.app/verify-license/`).

---

## 7️⃣ CRIAR LICENÇAS DE TESTE

Com server rodando:

```bash
curl -X POST http://localhost:3001/generate-license \
  -H "Authorization: Bearer clawdiao_secret_123" \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com"}'
```

Resposta: `{"license":"CLAW-XXXX-XXXX-XXXX"}`

---

## 8️⃣ MONITORAR

- Logs do Stripe → Dashboard
- Verifique webhooks funcionando
- Teste compra com cartão de teste Stripe
- Valide licença sendo gerada automaticamente

---

## 🆘 TROUBLESHOOTING

- **Webhook não chega:** verifique URL, segredo, e que server está acessível publicamente
- **Licença não ativa:** verifique se license server está rodando e a chave Bates
- **Erro CORS:** adicione headers `Access-Control-Allow-Origin: *` no server

---

Pronto! Dashboard no ar vendendo. 🚀
