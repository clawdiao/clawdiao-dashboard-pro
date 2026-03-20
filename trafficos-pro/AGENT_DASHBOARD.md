# 📊 Dashboard de Performance da Equipe de Agentes

## Visão Geral
Dashboard em tempo real das métricas de todos os agentes da equipe.

---

## 🎯 Métricas Principais

### Accuracy Score
- Definição: % de respostas corretas vs esperado
- Coleta: Avaliação humana ou benchmark automático
- Target: >95%
- Visual: Gauge meter (0-100%)

### Latency
- Definição: Tempo médio de resposta (ms)
- Coleta: Automática (timestamp início/fim)
- Target: <2000ms
- Visual: Line chart (tendência 7 dias)

### User Satisfaction
- Definição: Thumbs up/down, NPS
- Coleta: Feedback explícito do usuário
- Target: >90% positivo
- Visual: Donut chart (positivo/neutro/negativo)

### Task Completion Rate
- Definição: % de tarefas completadas sem abort
- Coleta: Logs de execução
- Target: >85%
- Visual: Progress bar

### Tool Usage Efficiency
- Definição: Uso correto de ferramentas vs tentativas
- Coleta: Logs de tool calls
- Target: >80%
- Visual: Bar chart por ferramenta

### Collaboration Index
- Definição: Participação em tasks colaborativas
- Coleta: Tags de colaboração
- Target: >80%
- Visual: Scatter plot (colaboração vs accuracy)

---

## 🏆 Leaderboard

| Rank | Agente | XP | Nível | Accuracy | Latency | Tasks |
|------|--------|----|-------|----------|---------|-------|
| 1 | CopyMaster | 15.2k | 🟣 Especialista | 98.2% | 1.2s | 1.4k |
| 2 | CodeBot | 12.8k | 🟣 Especialista | 97.5% | 1.8s | 1.2k |
| 3 | SEO_King | 10.1k | 🟣 Avançado | 96.1% | 1.5s | 980 |
| ... | ... | ... | ... | ... | ... | ... |

**Filtros:** Nível, Período (24h/7d/30d), Tipo de task

---

## 📈 Trends Analysis

### Accuracy over Time
```
Semana 1: 88% → Semana 2: 91% → Semana 3: 93% → Semana 4: 95%
```

### Most Improved
- CopyMaster: +5.2% accuracy
- CodeBot: -300ms latency

### Top Skills Used
1. google-search (45%)
2. web-scrape (32%)
3. code-execution (18%)
4. image-gen (5%)

---

## 🔔 Alertas Inteligentes

🚨 **Accuracy drop >5%** — Agente: CopyMaster (-6% nas últimas 2h)  
⚠️ **Latency increase >20%** — Agente: CodeBot (+25% hoje)  
✅ **New badge earned** — SEO_King alcançou "Speed Demon"  
🎉 **Level up** — CopyMaster → Nível 4 (Especialista)

---

## 🎁 Gamificação

### Badges Recentes
- 🏃 Fast Learner (10 tasks <1h) — CopyMaster
- 🎯 Problem Solver (5 complex tasks) — CodeBot
- 🤝 Team Player (10 helps) — SEO_King
- 💡 Innovator (3 new skills) — TrafficAI

### XP do Dia
1. CopyMaster: +450 XP
2. CodeBot: +380 XP
3. SEO_King: +290 XP

---

## 📚 Knowledge Base Stats

- Total artigos: 342
- Updates hoje: 12
- Contribuidores: 8 agentes
- Views: 1.2k (hoje)

---

## 🛠️ Implementation Notes

**Stack Sugerido:**
- Frontend: React + Recharts
- Backend: Next.js API routes
- DB: PostgreSQL (mesmo do TrafficOS)
- Auth: JWT (admin apenas)
- Real-time: Socket.io (opcional)

**Integração com TrafficOS:**
- `/api/agents/metrics` — endpoint de métricas
- `/api/agents/leaderboard` — ranking
- `/api/agents/:id/feedback` — feedback individual
- `/api/agents/:id/improvement-plan` — plano de evolução

---

**Status:** To be implemented  
**Priority:** HIGH — dá visibilidade à evolução da equipe  
**Owner:** Clawdiao
