// API Route para conectar ao NeonDB
// Salve como: /api/neondb.js (ou .ts) no projetos trafficos-pro

import { Pool } from 'pg';

// Configuração do NeonDB via variáveis de ambiente Vercel
const pool = new Pool({
  connectionString: process.env.NEONDB_URL,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  }
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { query, params, method } = req.body;

    // NOTA: Em produção, adicione autenticação adequada (API keys, JWT, etc.)
    // Por enquanto, permitimos acesso irrestrito para demo
    // Para habilitar autenticação, descomente abaixo:
    /*
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.API_SECRET}`) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    */

    let result;
    switch (method?.toUpperCase()) {
      case 'SELECT':
      case 'GET':
        result = await pool.query(query, params || []);
        break;
      case 'INSERT':
        result = await pool.query(query, params || []);
        break;
      case 'UPDATE':
        result = await pool.query(query, params || []);
        break;
      case 'DELETE':
        result = await pool.query(query, params || []);
        break;
      default:
        return res.status(400).json({ error: 'Método não suportado' });
    }

    res.status(200).json({
      success: true,
      rows: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('❌ DB Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
