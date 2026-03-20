-- Tabela para métricas de agentes
CREATE TABLE IF NOT EXISTS agent_metrics (
  id SERIAL PRIMARY KEY,
  agent_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Métricas
  accuracy_score DECIMAL(5,2) DEFAULT 0,
  latency_ms INTEGER DEFAULT 0,
  user_satisfaction DECIMAL(5,2) DEFAULT 0,
  task_completion_rate DECIMAL(5,2) DEFAULT 0,
  tool_usage_efficiency DECIMAL(5,2) DEFAULT 0,
  collaboration_index DECIMAL(5,2) DEFAULT 0,
  
  -- Estatísticas
  tasks_completed INTEGER DEFAULT 0,
  total_time_ms INTEGER DEFAULT 0,
  positive_feedback INTEGER DEFAULT 0,
  negative_feedback INTEGER DEFAULT 0,
  
  -- Metadados
  level VARCHAR(50) DEFAULT 'Iniciante',
  xp INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_agent_metrics_name_date ON agent_metrics(agent_name, date);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_level ON agent_metrics(level);

-- Dados iniciais (exemplo)
INSERT INTO agent_metrics (agent_name, date, accuracy_score, latency_ms, user_satisfaction, task_completion_rate, tool_usage_efficiency, collaboration_index, tasks_completed, total_time_ms, positive_feedback, negative_feedback, level, xp, badges)
VALUES
  ('CopyMaster', CURRENT_DATE, 98.2, 1250, 95.5, 96.0, 92.0, 88.0, 1420, 1775000, 1350, 45, 'Especialista', 15200, '["Fast Learner","Problem Solver","Team Player","Innovator"]'),
  ('CodeBot', CURRENT_DATE, 97.5, 1850, 93.0, 94.5, 88.0, 75.0, 1280, 2368000, 1100, 62, 'Especialista', 12800, '["Speed Demon","Full Stack","Innovator"]'),
  ('SEO_King', CURRENT_DATE, 96.1, 1580, 91.5, 92.0, 85.0, 70.0, 980, 1548400, 890, 48, 'Avançado', 10100, '["Fast Learner","Problem Solver"]')
ON CONFLICT DO NOTHING;

COMMIT;
