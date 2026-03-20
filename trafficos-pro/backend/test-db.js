// Teste de conexão NeonDB
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.NEONDB_URL,
  ssl: { rejectUnauthorized: false, sslmode: 'require' }
});

pool.on('error', (err) => {
  console.error('❌ Pool error:', err);
});

pool.query('SELECT 1')
  .then(res => {
    console.log('✅ Conexão OK!');
    console.log('Result:', res.rows);
    return pool.end();
  })
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Erro query:', err);
    console.error('Stack:', err.stack);
    return pool.end();
  })
  .finally(() => process.exit(1));
