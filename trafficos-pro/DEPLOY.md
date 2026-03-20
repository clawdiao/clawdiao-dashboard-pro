# TrafficOS Pro — Deploy Rápido no Railway

## Pré-requisitos
- Conta no Railway (https://railway.app)
- Projeto GitHub (este repositório)
- NEONDB_URL (sua string de conexão)

## Passos

### 1. Fazer push do código
```bash
cd trafficos-pro
git add .
git commit -m "Deploy ready: complete Node.js backend + frontend"
git push origin master
```

### 2. Criar projeto no Railway
- Vá em https://railway.app/dashboard
- Clique "New Project"
- Conecte seu GitHub
- Selecione o repositório `trafficos-pro`

### 3. Configurar Variáveis de Ambiente
No Railway dashboard → Project → Settings → Variables:

```
NEONDB_URL=postgresql://neondb_owner:npg_l6bru0EiYdBN@ep-long-sea-am5yf903-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-projeto.railway.app
```

### 4. Build & Deploy
- Railway detecta Dockerfile automaticamente
- Build occurs automaticamente
- Deploy acontece sozinho

### 5. Acessar
Após deploy, Railway dá uma URL tipo:
https://trafficos-pro-production.up.railway.app

---

## Alternativa: Vercel (Serverless)

Se preferir Vercel, o `vercel.json` já está configurado. Basta:

```bash
vercel --prod
```

E adicionar `NEONDB_URL` nas variáveis do Vercel.

---

**Qual plataforma prefere?** Railway ou Vercel? 🚀
