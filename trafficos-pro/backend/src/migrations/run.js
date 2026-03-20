// Script para executar migrações no NeonDB
// Uso: npm run migrate

import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.NEONDB_URL,
  ssl: { rejectUnauthorized: false, sslmode: 'require' }
});

async function runMigrations() {
  console.log('🚀 Executando migrações...');

  try {
    const sqlPath = join(process.cwd(), 'migrations', 'create-tables.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    // Dividir em statements (simples, assume ; no final)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let count = 0;
    for (const stmt of statements) {
      try {
        await pool.query(stmt);
        count++;
      } catch (err) {
        // Ignora erros de "already exists"
        if (!err.message.includes('already exists')) {
          throw err;
        }
      }
    }

    console.log(`✅ ${count} statements executados com sucesso`);
    console.log('🎉 Migrações concluídas!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro nas migrações:', error.message);
    process.exit(1);
  }
}

runMigrations();
