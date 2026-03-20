// TrafficOS Pro — Backend API
// Node.js + Express + PostgreSQL (NeonDB)

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { Pool } from 'pg';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por janela
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// ============================================
// SERVIÇÃO DE ARQUIVOS ESTÁTICOS (FRONTEND)
// ============================================
// Tentar servir de 'public' primeiro, depois '../frontend'
const staticPaths = ['public', '../frontend'];
let staticServed = false;

for (const staticPath of staticPaths) {
  try {
    app.use(express.static(staticPath));
    console.log(`📦 Servindo arquivos estáticos de: ${staticPath}`);
    staticServed = true;
    break;
  } catch (err) {
    // Ignora se diretório não existe
  }
}

if (!staticServed) {
  console.log('⚠️ Nenhum diretório estático encontrado (public ou ../frontend)');
}

// ============================================
// BANCO DE DADOS NEONDB
// ============================================
const pool = new Pool({
  connectionString: process.env.NEONDB_URL,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('✅ Connected to NeonDB');
});

pool.on('error', (err) => {
  console.error('❌ NeonDB connection error:', err);
});

// ============================================
// MIDDLEWARE DE LOGGING
// ============================================
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROTAS DA API
// ============================================

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

// ============================================
// EMPRESAS
// ============================================

// Listar todas as empresas
app.get('/api/empresas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM empresas ORDER BY nome');
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('GET /api/empresas error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obter empresa por ID
app.get('/api/empresas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM empresas WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Empresa não encontrada' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('GET /api/empresas/:id error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Criar nova empresa
app.post('/api/empresas', async (req, res) => {
  const { nome, segmento, plataformas, investimento, status, senha } = req.body;
  const id = Date.now();

  try {
    const result = await pool.query(
      `INSERT INTO empresas (id, nome, segmento, plataformas, investimento, status, senha)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, nome, segmento, plataformas, investimento || 0, status || 'ativa', senha]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('POST /api/empresas error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Atualizar empresa
app.put('/api/empresas/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, segmento, plataformas, investimento, status, senha, ultimo_login } = req.body;

  try {
    const result = await pool.query(
      `UPDATE empresas SET
         nome = COALESCE($1, nome),
         segmento = COALESCE($2, segmento),
         plataformas = COALESCE($3, plataformas),
         investimento = COALESCE($4, investimento),
         status = COALESCE($5, status),
         senha = COALESCE($6, senha),
         ultimo_login = COALESCE($7, ultimo_login)
       WHERE id = $8
       RETURNING *`,
      [nome, segmento, plataformas, investimento, status, senha, ultimo_login, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Empresa não encontrada' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('PUT /api/empresas/:id error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Deletar empresa
app.delete('/api/empresas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM empresas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Empresa não encontrada' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('DELETE /api/empresas/:id error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// CAMPANHAS
// ============================================

// Listar todas as campanhas
app.get('/api/campanhas', async (req, res) => {
  const { empresa_id } = req.query;
  try {
    let query = 'SELECT * FROM campanhas';
    let params = [];
    if (empresa_id) {
      query += ' WHERE empresa_id = $1';
      params.push(empresa_id);
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('GET /api/campanhas error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Criar campanha
app.post('/api/campanhas', async (req, res) => {
  const { id, empresa_id, nome, plataforma, status, orcamento, gasto, roas, leads, cpl } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO campanhas (id, empresa_id, nome, plataforma, status, orcamento, gasto, roas, leads, cpl)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [id, empresa_id, nome, plataforma, status || 'ativa', orcamento || 0, gasto || 0, roas || 0, leads || 0, cpl || 0]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('POST /api/campanhas error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Atualizar campanha
app.put('/api/campanhas/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, plataforma, status, orcamento, gasto, roas, leads, cpl } = req.body;

  try {
    const result = await pool.query(
      `UPDATE campanhas SET
         nome = COALESCE($1, nome),
         plataforma = COALESCE($2, plataforma),
         status = COALESCE($3, status),
         orcamento = COALESCE($4, orcamento),
         gasto = COALESCE($5, gasto),
         roas = COALESCE($6, roas),
         leads = COALESCE($7, leads),
         cpl = COALESCE($8, cpl)
       WHERE id = $9
       RETURNING *`,
      [nome, plataforma, status, orcamento, gasto, roas, leads, cpl, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Campanha não encontrada' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('PUT /api/campanhas/:id error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Deletar campanha
app.delete('/api/campanhas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM campanhas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Campanha não encontrada' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('DELETE /api/campanhas/:id error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// HISTÓRICO
// ============================================

// Listar histórico
app.get('/api/historico', async (req, res) => {
  const { limit = 100 } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM historico ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('GET /api/historico error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Adicionar log ao histórico
app.post('/api/historico', async (req, res) => {
  const { empresa, tipo, acao, detalhes } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO historico (empresa, tipo, acao, detalhes) VALUES ($1, $2, $3, $4) RETURNING *',
      [empresa, tipo, acao, detalhes]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('POST /api/historico error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// ESTATÍSTICAS (dashboard)
// ============================================

app.get('/api/stats', async (req, res) => {
  try {
    const [totalInvest, totalLeads, avgROAS] = await Promise.all([
      pool.query('SELECT COALESCE(SUM(gasto), 0) as total FROM campanhas'),
      pool.query('SELECT COALESCE(SUM(leads), 0) as total FROM campanhas'),
      pool.query('SELECT COALESCE(AVG(roas), 0) as avg FROM campanhas')
    ]);

    const totalInv = parseFloat(totalInvest.rows[0].total);
    const totalLd = parseInt(totalLeads.rows[0].total);
    const avgR = parseFloat(avgROAS.rows[0].avg);
    const avgCPL = totalLd > 0 ? (totalInv / totalLd) : 0;

    res.json({
      success: true,
      data: {
        totalInvest: totalInv,
        totalLeads: totalLd,
        avgROAS: avgR.toFixed(2),
        avgCPL: avgCPL.toFixed(2)
      }
    });
  } catch (error) {
    console.error('GET /api/stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 TrafficOS Pro API rodando na porta ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
});

// ============================================
// AGENT METRICS
// ============================================

// Listar todos os agentes (leaderboard)
app.get('/api/agents', async (req, res) => {
  const { limit = 20, orderBy = 'xp', orderDir = 'DESC' } = req.query;
  try {
    const orderField = orderBy === 'xp' ? 'xp' : orderBy === 'accuracy' ? 'accuracy_score' : 'xp';
    const result = await pool.query(
      SELECT * FROM agent_metrics WHERE date = CURRENT_DATE ORDER BY   LIMIT ,
      [parseInt(limit)]
    );
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('GET /api/agents error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Registrar m�tricas de um agente
app.post('/api/agents/metrics', async (req, res) => {
  const { agent_name, accuracy_score, latency_ms, user_satisfaction, task_completion_rate, tool_usage_efficiency, collaboration_index, tasks_completed, total_time_ms, positive_feedback, negative_feedback, level, xp_gain, new_badges } = req.body;
  try {
    const result = await pool.query(
      INSERT INTO agent_metrics (agent_name, date, accuracy_score, latency_ms, user_satisfaction, task_completion_rate, tool_usage_efficiency, collaboration_index, tasks_completed, total_time_ms, positive_feedback, negative_feedback, level, xp, badges)
       VALUES (, CURRENT_DATE, , , , , , , , , , , , , )
       ON CONFLICT (agent_name, date) DO UPDATE SET
         accuracy_score = EXCLUDED.accuracy_score,
         latency_ms = EXCLUDED.latency_ms,
         user_satisfaction = EXCLUDED.user_satisfaction,
         task_completion_rate = EXCLUDED.task_completion_rate,
         tool_usage_efficiency = EXCLUDED.tool_usage_efficiency,
         collaboration_index = EXCLUDED.collaboration_index,
         tasks_completed = agent_metrics.tasks_completed + EXCLUDED.tasks_completed,
         total_time_ms = agent_metrics.total_time_ms + EXCLUDED.total_time_ms,
         positive_feedback = agent_metrics.positive_feedback + EXCLUDED.positive_feedback,
         negative_feedback = agent_metrics.negative_feedback + EXCLUDED.negative_feedback,
         level = EXCLUDED.level,
         xp = agent_metrics.xp + EXCLUDED.xp,
         badges = CASE WHEN jsonb_array_length(agent_metrics.badges) < jsonb_array_length(EXCLUDED.badges) THEN EXCLUDED.badges ELSE agent_metrics.badges END,
         updated_at = NOW()
       RETURNING *,
      [agent_name, accuracy_score||0, latency_ms||0, user_satisfaction||0, task_completion_rate||0, tool_usage_efficiency||0, collaboration_index||0, tasks_completed||0, total_time_ms||0, positive_feedback||0, negative_feedback||0, level||'Iniciante', xp_gain||0, new_badges||'[]']
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('POST /api/agents/metrics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dashboard de estat�sticas gerais dos agentes
app.get('/api/agents/dashboard', async (req, res) => {
  try {
    const [totalAgents, avgAccuracy, avgLatency, totalTasks, avgSatisfaction] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM (SELECT DISTINCT agent_name FROM agent_metrics WHERE date = CURRENT_DATE) as t'),
      pool.query('SELECT AVG(accuracy_score) as avg FROM agent_metrics WHERE date = CURRENT_DATE'),
      pool.query('SELECT AVG(latency_ms) as avg FROM agent_metrics WHERE date = CURRENT_DATE'),
      pool.query('SELECT SUM(tasks_completed) as total FROM agent_metrics WHERE date = CURRENT_DATE'),
      pool.query('SELECT AVG(user_satisfaction) as avg FROM agent_metrics WHERE date = CURRENT_DATE')
    ]);
    res.json({
      success: true,
      data: {
        totalAgents: parseInt(totalAgents.rows[0].count),
        avgAccuracy: parseFloat(avgAccuracy.rows[0].avg).toFixed(2),
        avgLatency: Math.round(parseFloat(avgLatency.rows[0].avg)),
        totalTasksToday: parseInt(totalTasks.rows[0].total),
        avgSatisfaction: parseFloat(avgSatisfaction.rows[0].avg).toFixed(2),
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('GET /api/agents/dashboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

