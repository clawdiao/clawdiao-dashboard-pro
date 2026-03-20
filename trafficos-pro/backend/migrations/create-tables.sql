-- Criação das tabelas do TrafficOS Pro
-- Execute: psql -d seu_banco -f migrations/create-tables.sql

-- Tabela de empresas
CREATE TABLE IF NOT EXISTS empresas (
  id BIGINT PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS campanhas (
  id VARCHAR(50) PRIMARY KEY,
  empresa_id BIGINT REFERENCES empresas(id) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS historico (
  id SERIAL PRIMARY KEY,
  empresa VARCHAR(255),
  tipo VARCHAR(100),
  acao VARCHAR(100),
  detalhes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_empresas_nome ON empresas(nome);
CREATE INDEX IF NOT EXISTS idx_campanhas_empresa ON campanhas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_campanhas_status ON campanhas(status);
CREATE INDEX IF NOT EXISTS idx_historico_empresa ON historico(empresa);
CREATE INDEX IF NOT EXISTS idx_historico_created ON historico(created_at DESC);

-- Dados iniciais (exemplo)
INSERT INTO empresas (id, nome, segmento, plataformas, campanhas, investimento, status, senha) VALUES
  (1, 'Clínica Saúde+', 'Saúde', 'Meta Ads', 4, 8000.00, 'ativa', 'clinica123'),
  (2, 'Imobiliária VX', 'Imóveis', 'Google Ads', 3, 12000.00, 'ativa', 'vx1234'),
  (3, 'Escola FutureKids', 'Educação', 'Meta, Google', 2, 5500.00, 'teste', 'future123'),
  (4, 'E-commerce ModaBR', 'E-commerce', 'Meta Ads', 1, 7200.00, 'pausada', 'moda123')
ON CONFLICT (id) DO NOTHING;

INSERT INTO campanhas (id, empresa_id, nome, plataforma, status, orcamento, gasto, roas, leads, cpl) VALUES
  ('c1', 1, 'Meta Leads - Saúde+', 'Meta Ads', 'ativa', 3000.00, 2850.00, 4.2, 312, 9.13),
  ('c2', 2, 'Google Search - VX', 'Google Ads', 'ativa', 5000.00, 4800.00, 5.1, 187, 25.67),
  ('c3', 3, 'Meta + Google - FutureKids', 'Combinado', 'teste', 2500.00, 1200.00, 3.0, 203, 5.91),
  ('c4', 4, 'Meta Catalog - ModaBR', 'Meta Ads', 'pausada', 2000.00, 1800.00, 1.8, 89, 20.22)
ON CONFLICT (id) DO NOTHING;

INSERT INTO historico (empresa, tipo, acao, detalhes) VALUES
  ('Clínica Saúde+', 'Campanha', 'Criada', 'Nova campanha Meta Leads'),
  ('Imobiliária VX', 'Relatório', 'Gerado', 'Relatório mensal'),
  ('Escola FutureKids', 'Teste A/B', 'Concluído', 'Variação B venceu (94% confiança)');

-- Commitar mudanças
COMMIT;
