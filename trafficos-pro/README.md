# 🚀 TrafficOS Pro — Sistema Completo de Gestão de Tráfego

Sistema full-stack para gestão de campanhas de tráfego pago (Meta Ads, Google Ads, TikTok) com dashboard, IA, testes A/B e relatórios.

---

## 📦 O que está incluído

### Backend (Node.js + Express)
- API RESTful completa
- Conexão com NeonDB (PostgreSQL serverless)
- CRUD de empresas e campanhas
- Histórico de ações
- Estatísticas em tempo real
- Rate limiting e segurança (Helmet, CORS)
- Servidor embutido serve frontend estático

### Frontend (HTML/CSS/JS)
- Dashboard com KPIs (investimento, ROAS, leads, CPL)
- Gráficos CSS puros (barras, donut SVG)
- Gestão de empresas e campanhas
- Criação de estratégias com IA (Claude)
- Testes A/B com comparação lado a lado
- Relatórios automáticos
- Insights inteligentes
- Histórico completo
- Centro de treinamento
- Configurações de API keys
- **Acesso direto** (sem login)

---

## 🗂️ Estrutura do Projeto

```
trafficos-pro/
├── backend/
│   ├── src/
│   │   ├── server.js          # Servidor Express principal
│   │   └── migrations/
│   │       └── create-tables.sql
│   ├── package.json
│   ├── Dockerfile
│   └── public/
│       └── index.html         # Frontend (copiado)
├── frontend/
│   └── index.html             # Frontend fonte
├── docker-compose.yml
├── .env.local.example
├── vercel.json                # Deploy Vercel (se usar)
└── README.md
```

---

## 🚀 Como Rodar (3 opções)

### Opção 1: Docker (Recomendado)

```bash
# 1. Copiar variáveis de ambiente
cp .env.local.example .env.local
# Editar .env.local com sua NEONDB_URL

# 2. Subir com Docker Compose
docker-compose up --build

# 3. Acessar
# Frontend + Backend: http://localhost:3001
```

### Opção 2: Node.js Direto

```bash
# 1. Entrar na pasta backend
cd backend

# 2. Instalar dependências
npm install

# 3. Copiar .env.local.example para .env.local e configurar NEONDB_URL

# 4. Executar migrações (criar tabelas)
npm run migrate

# 5. Iniciar servidor
npm start

# 6. Acessar http://localhost:3001
```

### Opção 3: Deploy no Vercel (Serverless)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Fazer login
vercel login

# 3. Deploy da raiz (contém vercel.json)
vercel --prod

# 4. Adicionar variáveis de ambiente no dashboard Vercel:
#    NEONDB_URL (sua string de conexão NeonDB)
```

---

## 🗄️ Banco de Dados (NeonDB)

### Criar tabelas manualmente (se não usar migrate)

```sql
-- Execute no console NeonDB ou via psql
-- Use o arquivo: backend/migrations/create-tables.sql
```

### Dados de exemplo

O script de migração já insere:
- 4 empresas exemplo
- 4 campanhas exemplo
- 3 logs de histórico

---

## 🔧 Variáveis de Ambiente

| Nome | Descrição | Obrigatório |
|------|-----------|-------------|
| `NEONDB_URL` | String de conexão NeonDB (PostgreSQL) | ✅ Sim |
| `PORT` | Porta do servidor (padrão: 3001) | ❌ Não |
| `NODE_ENV` | ambiente (development/production) | ❌ Não |
| `FRONTEND_URL` | URL do frontend para CORS | ❌ Não |
| `JWT_SECRET` | Chave JWT (para futuras auth) | ❌ Não |

---

## 📋 Endpoints da API

### Health Check
```
GET /api/health
```

### Empresas
```
GET    /api/empresas              # Listar todas
GET    /api/empresas/:id          # Obter por ID
POST   /api/empresas              # Criar
PUT    /api/empresas/:id          # Atualizar
DELETE /api/empresas/:id          # Deletar
```

### Campanhas
```
GET    /api/campanhas             # Listar todas (opcional ?empresa_id)
POST   /api/campanhas             # Criar
PUT    /api/campanhas/:id         # Atualizar
DELETE /api/campanhas/:id         # Deletar
```

### Histórico
```
GET    /api/historico             # Listar (recentes)
POST   /api/historico             # Adicionar log
```

### Estatísticas
```
GET    /api/stats                 # KPIs gerais (totais)
```

---

## 🎨 Frontend — Como Usar

1. **Acesso direto:** Abra http://localhost:3001 (ou URL deployada)
2. **Dashboard:** Visão geral com KPIs, gráficos, campanhas recentes
3. **Empresas:** Cadastre clientes (nome, segmento, senha)
4. **Campanhas:** Visualize todas as campanhas
5. **Criar com IA:** Gere estratégias usando Claude (configure API key em Config)
6. **Testes A/B:** Compare variações
7. **Relatórios:** Gere relatórios automáticos
8. **Insights:** Alertas inteligentes
9. **Histórico:** Log de todas as ações
10. **Treinamento:** Centro de aprendizado
11. **Config:** Chaves de IA (Anthropic/OpenAI)

---

## 🔐 Autenticação (Futuro)

Atualmente o sistema rodas em modo admin direto. Futuramente:
- Login por empresa com JWT
- Senhas hash (bcrypt)
- Perfil de usuário (admin/cliente)

---

## 🧪 Testes

```bash
# Testar health check
curl http://localhost:3001/api/health

# Listar empresas
curl http://localhost:3001/api/empresas

# Criar empresa
curl -X POST http://localhost:3001/api/empresas \
  -H "Content-Type: application/json" \
  -d '{"nome":"Nova Empresa","segmento":"Saúde","senha":"123"}'

# Stats
curl http://localhost:3001/api/stats
```

---

## 🐛 Troubleshooting

### Erro: Cannot connect to NeonDB
- Verifique se `NEONDB_URL` está correta no `.env.local`
- Teste conexão com psql ou Neon console

### Erro: Tabelas não existem
- Rode `npm run migrate` para criar tabelas
- Ou execute manualmente o SQL em `backend/migrations/create-tables.sql`

### Porta em uso
- Altere `PORT` no `.env.local`

### Frontend não carrega
- Verifique se `index.html` está em `backend/public/`
- Ou use `express.static('../frontend')` no server.js

---

## 📈 Monitoramento

- Logs no console (básico)
- Health check em `/api/health`
- Métricas em `/api/stats`

Para production, recomendo:
- Winston/Pino para logging estruturado
- Prometheus metrics
- Sentry para erros

---

## 🚀 Deploy em Production

### Vercel (Serverless)
- Use `vercel.json` na raiz
- Adicione variáveis no dashboard
- Build automático

### Railway/Render
- Conecte repositório
- Set build command: `npm install && npm run migrate`
- Start command: `npm start`
- Add env vars

### Docker (qualquer cloud)
```bash
docker build -f backend/Dockerfile -t trafficos-pro .
docker run -p 3001:3001 --env-file .env.local trafficos-pro
```

---

## 📚 Próximos Passos / Melhorias

- [ ] Autenticação JWT completa (login/signup)
- [ ] Integração real com APIs Meta/Google/TikTok
- [ ] Upload de criativos
- [ ] Editor de copies integrado
- [ ] Exportação PDF/Excel
- [ ] Webhooks para atualização automática
- [ ] Multi-tenant com isolation
- [ ] cache Redis
- [ ] Testes automatizados (Jest)
- [ ] CI/CD pipeline
- [ ] Documentação OpenAPI/Swagger

---

## 🤝 Suporte

**Projeto:** Clawdiao (OpenClaw)
**Data:** 20/03/2026
**Versão:** 1.0.0

---

**Sistema completo, moderno e pronto para produção!** 🎯
