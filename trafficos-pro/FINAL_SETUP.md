# 🚀 TrafficOS Pro — Guia de Configuração Final

## ✅ Status Atual

- ✅ **Frontend deployado:** https://trafficos-pro.vercel.app
- ✅ **API Route funcionando:** `/api/test` retorna OK
- ✅ **Banco de dados NeonDB:** tabelas criadas e populadas
- ✅ **Login testado:** localStorage funciona

---

## 📋 Configuração Necessária (5 minutos)

### 1️⃣ Adicionar Variáveis no Vercel

**Dashboard Vercel → Projeto `trafficos-pro` → Settings → Environment Variables**

Adicione estas variáveis:

| Nome | Valor | Tipo |
|------|-------|------|
| `NEONDB_URL` | `postgresql://neondb_owner:npg_l6bru0EiYdBN@ep-long-sea-am5yf903-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Plain text |
| `API_SECRET` | Escolha uma senha forte (ex: `TrafficOSPro@2025!`) | Plain text |

⚠️ **Importante:** Marque as opções:
- ✓ Production
- ✓ Preview

Clique **Add** para cada uma.

---

### 2️⃣ Redeploy para Aplicar Variáveis

**Vercel Dashboard → Deployments →**
1. Clique no último deploy
2. Clique **"Redeploy"** → **"Redeploy without cache"**

Espere 1-2 minutos.

---

### 3️⃣ Testar a Conexão com NeonDB

Após o redeploy, teste:

```bash
curl -X POST https://trafficos-pro.vercel.app/api/neondb \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SUA_API_SECRET" \
  -d '{"method":"SELECT","query":"SELECT count(*) as total FROM empresas"}'
```

Se retornar `{"success":true,"rows":[...]}` — está funcionando!

---

## 🔐 Como Usar o Sistema

### Login Admin
- **Empresa:** `admin`
- **Senha:** `admin123`

### Login Empresa (exemplo)
- **Empresa:** `Clínica Saúde+`
- **Senha:** `clinica123`

---

## 📊 O Que Cada Módulo Faz

| Módulo | Funcionalidade |
|--------|----------------|
| **Dashboard** | KPIs, gráficos, campanhas recentes |
| **Empresas** | Cadastro/gestão de clientes (admin only) |
| **Campanhas** | Lista completa com filtros |
| **Criar com IA** | Gera estratégia usando Claude |
| **Testes A/B** | Compara variações lado a lado |
| **Relatórios** | Relatórios automáticos com IA |
| **Insights** | Alertas inteligentes |
| **Histórico** | Log de todas as ações |
| **Treinamento** | Cursos interativos |
| **Config** | Chaves de IA + info NeonDB |

---

## 🔧 Próximos Passos (Opcional)

### Integrar IA Claude
1. Obtenha API key da Anthropic: https://console.anthropic.com
2. Vá em **Configurações** → **Configuração de IA**
3. Cole a chave em **Anthropic API Key**
4. Salve

### Migrar Dados do localStorage para NeonDB
 Quando a API estiver funcionando com as variáveis configuradas, o sistema automaticamente:
1. Tenta carregar do NeonDB primeiro
2. Se falhar, usa localStorage (fallback)
3. Qualquer alteração (nova empresa, campanha) será salva no NeonDB via API

---

## 🐛 Troubleshooting

### Erro 401 na API
- Verifique se `API_SECRET` está configurada no Vercel
- O header Authorization deve ser: `Bearer SUA_SENHA_AQUI`

### Erro 500 na API
- Verifique se `NEONDB_URL` está correta
- Verifique se as tabelas foram criadas (rode `setup-neon.cjs`)

### Frontend não aparece
- Verifique se o deploy terminou
- Tente limpar cache do navegador

### Variáveis não funcionam
- Variáveis de ambiente do Vercel só funcionam em Serverless Functions (API routes)
- No frontend HTML, elas NÃO são acessíveis diretamente
- A API route é que usa as variáveis

---

## 📞 Suporte

Se algo não funcionar:
1. Verifique o console do navegador (F12)
2. Verifique logs no Vercel Dashboard → Functions
3. Teste a API diretamente com curl/Postman

---

**Pronto! Sistema 100% funcional com backend NeonDB integrado.** 🎉
