# 🚀 DEPLOY NO VERCEL — Passo a Passo

## 📦 Estrutura esperada

```
sales/
├── .vercel/
│   └── output/
│       └── functions/   (automático)
├── api/
│   └── index.js         ← Serverless function
├── dashboard-pro.html   ← Dashboard (protegido por licença)
├── checkout.html        ← Checkout Stripe
├── obrigado.html        ← Página de confirmação
├── landing-page.html    ← Página de vendas
├── package.json         ← Dependências (stripe)
├── vercel.json          ← Config Vercel
└── .env.example         ← Variáveis de ambiente
```

## 1️⃣ Criar projeto no Vercel

```bash
# Na pasta sales/
vercel --prod
```

Ou no site Vercel: importe o repositório GitHub.

## 2️⃣ Configurar Environment Variables no Vercel

No dashboard do projeto Vercel → Settings → Environment Variables:

| Nome | Valor (test mode) |
|------|-------------------|
| `STRIPE_SECRET_KEY` | sk_test_xxx |
| `STRIPE_PUBLISHABLE_KEY` | pk_test_xxx |
| `STRIPE_PRICE_ID` | price_xxx |
| `STRIPE_WEBHOOK_SECRET` | whsec_xxx |
| `LICENSE_SECRET` | clawdiao_secret_123 |
| `FRONTEND_URL` | https://seu-app.vercel.app |

## 3️⃣ Webhook Stripe

No Stripe Dashboard → Developers → Webhooks:

- Endpoint: `https://seu-app.vercel.app/api/webhook`
- Events: `checkout.session.completed`
- Copie o `STRIPE_WEBHOOK_SECRET` gerado

## 4️⃣ Testar

1. Acesse: `https://seu-app.vercel.app/dashboard-pro.html`
2. Clique no botão "Desbloquear PRO"
3. Faça uma compra de teste (use cartão 4242 4242 4242 4242)
4. Após pagamento, webhook gera licença
5. Licença chega no email (ou gere manualmente)
6. Ative no dashboard

## 5️⃣ Gerar licenças manuais (opcional)

```bash
curl -X POST https://seu-app.vercel.app/api/generate-license \
  -H "Authorization: Bearer clawdiao_secret_123" \
  -H "Content-Type: application/json" \
  -d '{"email":"cliente@email.com"}'
```

## 📌 Notas

- O Vercel executa como serverless functions (não precisa de servidor rodando)
- Banco de dados de licenças fica em arquivo temporário (`/tmp/licenses.json`) no Vercel — NÃO persiste entre invocações!
- **Para produção com muitas licenças:** use PostgreSQL/NeonDB no lugar do arquivo JSON
- Dashboard é estático (HTML puro) — serve rápido
- License server é serverless (rápido, escala automático)

## 🎯 Próximos passos

- [ ] Criar repo GitHub e fazer push
- [ ] Conectar repo ao Vercel
- [ ] Configurar env vars
- [ ] Testar fluxo completo
- [ ] Colar links de marketing

Boa venda! 🚀
