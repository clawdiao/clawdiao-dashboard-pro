# 🎓 Guia de Treinamento — TrafficOS Pro

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Acesso Rápido](#acesso-rápido)
3. [Dashboard](#dashboard)
4. [Gestão de Empresas](#gestão-de-empresas)
5. [Campanhas](#campanhas)
6. [IA para Estratégia](#ia-para-estratégia)
7. [Testes A/B](#testes-ab)
8. [Relatórios](#relatórios)
9. [Insights](#insights)
10. [Histórico](#histórico)
11. [Treinamento](#treinamento)
12. [Configurações](#configurações)
13. [Fluxo Diário](#fluxo-diário)
14. [Troubleshooting](#troubleshooting)

---

## 1️⃣ Visão Geral

**TrafficOS Pro** é um sistema completo de gestão de tráfego pago para agências e consultorias.

**Funcionalidades principais:**
- Dashboard com KPIs em tempo real
- Cadastro de múltiplas empresas (clientes)
- Gestão de campanhas (Meta, Google, TikTok)
- Criação de estratégias com IA (Claude)
- Testes A/B automatizados
- Relatórios inteligentes
- Insights automáticos
- Centro de treinamento integrado

---

## 2️⃣ Acesso Rápido

### URL
https://trafficos-pro.vercel.app

### Login (Removido — Acesso Direto)
O sistema agora carrega automaticamente como **Admin**.

**Usuário padrão:** Admin (acesso total)

---

## 3️⃣ Dashboard

### O que você vê:
- **4 cards de KPIs:**
  - Investimento Total (com % vs mês anterior)
  - ROAS Médio (retorno sobre investimento)
  - Leads Gerados
  - CPL Médio (custo por lead)

- **Gráfico de barras:** Investimento por dia da semana
- **Gráfico donut:** Distribuição por plataforma (Meta, Google, TikTok, Outros)
- **Tabela de campanhas recentes:**
  - Cliente, Campanha, Plataforma
  - Status (Ativa/Pausada/Teste)
  - Barra de progresso do orçamento
  - ROAS, Leads, CPL

---

## 4️⃣ Gestão de Empresas

### Adicionar Nova Empresa
1. Clique **"Empresas"** no menu lateral
2. Clique **"+ Nova Empresa"**
3. Preencha:
   - **Nome da Empresa:** (cliente)
   - **Segmento:** Saúde, Imóveis, E-commerce, etc.
   - **Senha de Acesso:** (para login da empresa)
   - **Plataformas:** Meta, Google, TikTok (separados por vírgula)
   - **Orçamento Mensal:** valor inicial

4. Clique **"Criar Empresa"**

### Dados padrão (já cadastrados):
| Empresa | Segmento | Senha |
|---------|----------|-------|
| Clínica Saúde+ | Saúde | clinica123 |
| Imobiliária VX | Imóveis | vx1234 |
| Escola FutureKids | Educação | future123 |
| E-commerce ModaBR | E-commerce | moda123 |

---

## 5️⃣ Campanhas

### Visualizar Todas as Campanhas
- Clique **"Campanhas"** no menu
- Use o filtro para ver por empresa
- Tabela completa com todos os KPIs

### Criar Nova Campanha (manual)
1. Vá em **Empresas**
2. Clique **"Editar"** na empresa desejada
3. Adicione manualmente na lista (ou use a IA)

---

## 6️⃣ IA para Estratégia

### Gerar Campanha com IA
1. Clique **"Criar com IA"** no menu
2. Preencha o formulário:
   - **Segmento** do cliente
   - **Objetivo** (Leads, Vendas, Awareness, etc.)
   - **Plataforma** (Meta, Google, TikTok, Combinado)
   - **Orçamento Mensal**
   - **Diferencial do Produto** (o que torna único)
   - **Público-Alvo** (descrição)
   - **Tom de Comunicação** (Profissional, Amigável, Urgente, etc.)

3. Clique **"🤖 Gerar Estratégia com IA"**
4. Aguarde a geração (usa Claude via API)

### Resultado inclui:
- Estrutura de campanhas (3 fases)
- 2 copies prontos para usar
- Segmentação recomendada
- Metas de CPL e ROAS
- Próximos passos técnicos

---

## 7️⃣ Testes A/B

### Visualizar Testes Ativos
- Clique **"Testes A/B"** no menu
- Veja cards lado a lado: **Variante A vs Variante B**
- Métricas comparadas:
  - CTR (Click Through Rate)
  - CPC (Custo por Clique)
  - Conversões
  - CPL (Custo por Lead)
  - Confiança estatística

### Badge de Vencedor
- 🏆 Mostrado automaticamente para a variante com melhor CPL e confiança > 90%

---

## 8️⃣ Relatórios

### Gerar Relatório
1. Clique **"Relatórios"**
2. Selecione:
   - **Empresa** (ou Todas)
   - **Período** (7, 30 ou 90 dias)
3. Clique **"Gerar Relatório"**

### O que contém:
- Métricas consolidadas (Investimento, ROAS, Leads, CPL)
- Análise por campanha
- Insights automáticos
- Recomendações priorizadas
- Próximos passos

### Botão "Gerar para Cliente"
Cria texto executivo profissional para enviar ao cliente.

---

## 9️⃣ Insights

### Alertas Automáticos
- 🚨 **ROAS abaixo do mínimo** — campanhas performando mal
- 🏆 **Oportunidade de escala** — campanhas podem aumentar orçamento
- ⚗️ **Tendência em teste A/B** — resultado significativo
- 💡 **Oportunidade de retargeting** — audięncia quente não explorada
- 📅 **Sazonalidade** — padrões de desempenho por dia/semana

### Aprofundar
Clique **"Aprofundar"** em qualquer insight para análise detalhada com IA.

---

## 🔟 Histórico

### Log de Todas as Ações
- **Data/Hora** de cada evento
- **Empresa** envolvida
- **Tipo** (Campanha, Relatório, Teste A/B, etc.)
- **Ação** realizada
- **Detalhes** da ação

### Busca
Digite no campo de busca para filtrar rapidamente.

---

## 1️⃣1️⃣ Centro de Treinamento

### Módulos Disponíveis
1. Introdução ao Tráfego Pago (100%)
2. Meta Ads Fundamentals (80%)
3. Google Ads para Iniciantes (45%)
4. TikTok Ads Masterclass (0%)
5. Copywriting para Anúncios (30%)
6. Análise de Dados e ROI (60%)
7. Testes A/B Avançados (0%)
8. Automação de Campanhas (0%)

### Como usar
- Clique em **"Treinamento"** no menu
- Cada card mostra progresso
- Botão **"Continuar"** ou **"Revisar"**
- Interatividade futura com IA (GPT-4)

---

## 1️⃣2️⃣ Configurações

### Configurar IA
1. Vá em **"Configurações"**
2. **Anthropic API Key** — para Claude (estratégias)
3. **OpenAI API Key** — para GPT-4 (treinamento)
4. **Modelo Padrão** — selecione

### Banco de Dados
A Conexão NeonDB já está configurada via variáveis de ambiente no Vercel.

---

## 1️⃣3️⃣ Fluxo Diário Recomendado

### Manhã (15 min)
1. **Dashboard** — ver KPIs gerais
2. **Insights** — analisar alertas
3. **Campanhas** — identificar underperformers

### Meio do dia (30 min)
1. **Testes A/B** — implementar vencedores
2. **Criar com IA** — novas campanhas se necessário
3. **Empresas** — cadastrar novos clientes

### Final do dia (15 min)
1. **Relatórios** — gerar para clientes
2. **Histórico** — revisar o que foi feito
3. **Planejar** — ajustes para o próximo dia

---

## 1️⃣4️⃣ Troubleshooting

### Erro: "Backend indisponível"
- Verifique se as variáveis NEONDB_URL e API_SECRET estão no Vercel
- Sistema usa localStorage como fallback

### Dados não aparecem
- Clique em **"Atualizar"** ou recarregue a página (F5)
- Verifique se há dados na tabela `empresas` no NeonDB

### IA não gera estratégia
- Adicione API key da Anthropic em Configurações
- Verifique se a chave tem créditos

### Botão "Salvar" não funciona
- Abra o console do navegador (F12)
- Verifique erros em vermelho
- Pode ser falta de conexão com API

---

## 🎯 **Dicas de Eficiência**

1. **Use o botão DEV ACCESS** para login rápido (mas agora não precisa)
2. **Filtre por empresa** em Campanhas para não sobrecarregar a visão
3. **Copie insights** e Cole no Slack/email dos clientes
4. **Salve relatórios PDF** (Ctrl+P → Salvar como PDF)
5. **Treine a equipe** no Centro de Treinamento
6. **Configure API keys** uma vez e esqueça

---

## 📞 **Suporte**

**Problemas?**
1. Verifique console do navegador (F12)
2. Teste a API: `/api/neondb` (deve retornar erro 401 se auth desligado)
3. Consulte logs no Vercel Dashboard → Functions

---

**Versão:** 2.0 — Acesso direto, sem login  
**Última atualização:** 20/03/2026  
**Status:** ✅ Funcional
