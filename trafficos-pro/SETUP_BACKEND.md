# 🚀 Configuração do Backend — TrafficOS Pro

## 📋 Índice
1. [Estrutura do Projeto](#estrutura)
2. [Variáveis de Ambiente](#variaveis)
3. [API Routes](#api-routes)
4. [Deploy no Vercel](#deploy)
5. [Testar Conexão](#testar)

---

## 📁 Estrutura do Projeto

```
trafficos-pro/
├── trafficos-pro.html      (Frontend)
├── api/
│   └── neondb.js           (API Route)
├── package.json
└── vercel.json
```

---

## 🔐 Variáveis de Ambiente no Vercel

Vá em: **Dashboard Vercel → trafficos-pro → Settings → Environment Variables**

### Adicione estas variáveis:

| Nome | Valor | Tipo |
|------|-------|------|
| `NEONDB_URL` | `postgresql://neondb_owner:npg_l6bru0EiYdBN@ep-long-sea-am5yf903-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Plain text |
| `API_SECRET` | `sua-senha-secreta-aqui` (ex: `minhasenha123`) | Plain text |

⚠️ **Importante:** A `NEONDB_URL` deve ser exatamente a string fornecida, sem espaços.

---

## 🔗 API Routes

O arquivo `api/neondb.js` oferece estas operações:

### POST `/api/neondb`

**Body:**
```json
{
  "method": "SELECT",
  "query": "SELECT * FROM empresas WHERE id = $1",
  "params": [1]
}
```

**Headers:**
```
Authorization: Bearer {API_SECRET}
```

**Resposta:**
```json
{
  "success": true,
  "rows": [{...}],
  "count": 1
}
```

---

## 🗄️ Criar Tabelas no NeonDB

Execute no seu NeonDB (via console ou cliente):

```sql
-- Tabela de empresas
CREATE TABLE empresas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  segmento VARCHAR(100),
  plataformas TEXT,
  campanhas INTEGER DEFAULT 0,
  investimento DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'ativa',
  senha VARCHAR(255) NOT NULL,
  ultimo_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de campanhas
CREATE TABLE campanhas (
  id VARCHAR(50) PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas(id),
  nome VARCHAR(255) NOT NULL,
  plataforma VARCHAR(100),
  status VARCHAR(50),
  orcamento DECIMAL(12,2),
  gasto DECIMAL(12,2) DEFAULT 0,
  roas DECIMAL(6,2),
  leads INTEGER,
  cpl DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de histórico
CREATE TABLE historico (
  id SERIAL PRIMARY KEY,
  empresa VARCHAR(255),
  tipo VARCHAR(100),
  acao VARCHAR(100),
  detalhes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_empresas_nome ON empresas(nome);
CREATE INDEX idx_campanhas_empresa ON campanhas(empresa_id);
```

---

## 🚀 Deploy

1. Commit tudo e push
2. Vercel vai instalar `pg` automaticamente (package.json)
3. Deploy automático

---

## 🧪 Testar Conexão

Depois do deploy, teste:

```bash
curl -X POST https://trafficos-pro.vercel.app/api/neondb \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sua_senha_secreta" \
  -d '{"method":"SELECT","query":"SELECT * FROM empresas"}'
```

Deve retornar JSON com as empresas.

---

## 🔄 Frontend — Atualizar para usar API

No `trafficos-pro.html`, substitua as funções que usam localStorage por chamadas à API.

Exemplo:

```javascript
async function getEmpresas() {
  const res = await apiCall('SELECT', 'SELECT * FROM empresas ORDER BY id');
  if (res.success) {
    empresas = res.rows;
    renderEmpresasTable();
  }
}

async function loginEmpresa(nome, senha) {
  const res = await apiCall(
    'SELECT',
    'SELECT * FROM empresas WHERE LOWER(nome) = LOWER($1) AND senha = $2',
    [nome.toLowerCase(), senha]
  );
  if (res.rows.length > 0) {
    user = { empresa: res.rows[0].nome, empresaId: res.rows[0].id, isAdmin: false };
    showDashboard();
  } else {
    alert('Empresa ou senha incorretos');
  }
}
```

---

## 📝 Próximos Passos

1. Criar as tabelas no NeonDB
2. Adicionar variáveis no Vercel
3. Rearquear `initDB()` para usar API em vez de localStorage
4. Testar login
5. Fazer deploy

---

**Precisa de ajuda com algum passo? É só falar!** 🚀
