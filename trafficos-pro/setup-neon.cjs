// Script para setup completo do NeonDB + teste
// Execute: node setup-neon.js

const { Client } = require('pg');

const NEONDB_URL = "postgresql://neondb_owner:npg_l6bru0EiYdBN@ep-long-sea-am5yf903-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function setupDatabase() {
  console.log("🚀 Conectando ao NeonDB...");

  const client = new Client({
    connectionString: NEONDB_URL,
    ssl: { rejectUnauthorized: false, sslmode: 'require' }
  });

  try {
    await client.connect();
    console.log("✅ Conectado com sucesso!");

    // Criar tabela empresas
    console.log("\n📊 Criando tabela 'empresas'...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS empresas (
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
      )
    `);
    console.log("   ✅ Tabela empresas criada/verificada");

    // Criar tabela campanhas
    console.log("\n📊 Criando tabela 'campanhas'...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS campanhas (
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
      )
    `);
    console.log("   ✅ Tabela campanhas criada/verificada");

    // Criar tabela historico
    console.log("\n📊 Criando tabela 'historico'...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS historico (
        id SERIAL PRIMARY KEY,
        empresa VARCHAR(255),
        tipo VARCHAR(100),
        acao VARCHAR(100),
        detalhes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("   ✅ Tabela historico criada/verificada");

    // Inserir dados de exemplo (se não existirem)
    console.log("\n📥 Inserindo dados de exemplo...");

    // Verificar se já tem empresas
    const res = await client.query('SELECT COUNT(*) as count FROM empresas');
    if (parseInt(res.rows[0].count) === 0) {
      console.log("   🔄 Inserindo 4 empresas exemplo...");
      await client.query(`
        INSERT INTO empresas (nome, segmento, plataformas, campanhas, investimento, status, senha, ultimo_login) VALUES
        ('Clínica Saúde+', 'Saúde', 'Meta Ads', 4, 8000.00, 'ativa', 'clinica123', '2026-03-20 09:15'),
        ('Imobiliária VX', 'Imóveis', 'Google Ads', 3, 12000.00, 'ativa', 'vx1234', '2026-03-20 08:30'),
        ('Escola FutureKids', 'Educação', 'Meta, Google', 2, 5500.00, 'teste', 'future123', '2026-03-19 14:20'),
        ('E-commerce ModaBR', 'E-commerce', 'Meta Ads', 1, 7200.00, 'pausada', 'moda123', '2026-03-18 11:45')
      `);
      console.log("   ✅ Empresas inseridas");

      // Inserir campanhas exemplo
      console.log("   🔄 Inserindo campanhas exemplo...");
      await client.query(`
        INSERT INTO campanhas (id, empresa_id, nome, plataforma, status, orcamento, gasto, roas, leads, cpl) VALUES
        ('c1', 1, 'Meta Leads - Saúde+', 'Meta Ads', 'ativa', 3000.00, 2850.00, 4.2, 312, 9.13),
        ('c2', 2, 'Google Search - VX', 'Google Ads', 'ativa', 5000.00, 4800.00, 5.1, 187, 25.67),
        ('c3', 3, 'Meta + Google - FutureKids', 'Combinado', 'teste', 2500.00, 1200.00, 3.0, 203, 5.91),
        ('c4', 4, 'Meta Catalog - ModaBR', 'Meta Ads', 'pausada', 2000.00, 1800.00, 1.8, 89, 20.22)
      `);
      console.log("   ✅ Campanhas inseridas");

      // Inserir histórico exemplo
      console.log("   🔄 Inserindo histórico exemplo...");
      await client.query(`
        INSERT INTO historico (empresa, tipo, acao, detalhes) VALUES
        ('Clínica Saúde+', 'Campanha', 'Criada', 'Nova campanha Meta Leads'),
        ('Imobiliária VX', 'Relatório', 'Gerado', 'Relatório mensal'),
        ('Escola FutureKids', 'Teste A/B', 'Concluído', 'Variação B venceu (94% confiança)')
      `);
      console.log("   ✅ Histórico inserido");
    } else {
      console.log("   ⚠️  Banco já tem dados, pulando inserção");
    }

    console.log("\n🎉 SETUP COMPLETO! Banco de dados pronto.");
    console.log("\n📋 Próximos passos:");
    console.log("   1. Adicionar variáveis no Vercel:");
    console.log("      - NEONDB_URL (sua string de conexão)");
    console.log("      - API_SECRET (uma senha segura)");
    console.log("   2. Fazer deploy do projeto trafficos-pro");
    console.log("   3. Testar login com as credenciais padrão");

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Erro:", error.message);
    await client.end();
    process.exit(1);
  }
}

setupDatabase();
