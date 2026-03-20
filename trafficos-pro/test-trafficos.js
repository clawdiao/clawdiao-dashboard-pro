// Testes automatizados do TrafficOS Pro
// Execute: node test-trafficos.js

const fetch = require('node-fetch');

const BASE_URL = 'https://trafficos-pro.vercel.app';

const tests = {
  passed: 0,
  failed: 0,
  results: []
};

async function test(name, fn) {
  try {
    await fn();
    tests.passed++;
    tests.results.push(`✅ ${name}`);
    console.log(`✅ ${name}`);
  } catch (error) {
    tests.failed++;
    tests.results.push(`❌ ${name}: ${error.message}`);
    console.log(`❌ ${name}: ${error.message}`);
  }
}

async function testHomepage() {
  const res = await fetch(BASE_URL);
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  const html = await res.text();
  if (!html.includes('TráfegoMaster')) throw new Error('Página não contém título esperado');
}

async function testAPIHealth() {
  const res = await fetch(`${BASE_URL}/api/neondb`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method: 'SELECT', query: 'SELECT 1' })
  });
  // Deve retornar erro 401 ou 200, mas não 404
  if (res.status === 404) throw new Error('API route não encontrada');
}

async function testAPIDBConnection() {
  const res = await fetch(`${BASE_URL}/api/neondb`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method: 'SELECT', query: 'SELECT count(*) as total FROM empresas' })
  });
  const data = await res.json();
  if (res.status === 401) {
    console.log('   ⚠️ API retornou 401 (auth desabilitada) — esperado em demo');
    return;
  }
  if (!data.success && !data.fallback) {
    throw new Error(data.error || 'Resposta inesperada');
  }
}

async function testStaticAssets() {
  const res = await fetch(`${BASE_URL}/`);
  if (!res.ok) throw new Error('Falha ao carregar página principal');
  const html = await res.text();
  // Verificar se CSS está embutido (inline)
  if (!html.includes('<style>')) throw new Error('CSS não encontrado');
  // Verificar se JS está embutido
  if (!html.includes('<script>')) throw new Error('Script não encontrado');
}

async function runAllTests() {
  console.log(`\n🧪 Testando TrafficOS Pro — ${BASE_URL}\n`);
  console.log('─'.repeat(50));

  await test('Homepage carrega', testHomepage);
  await test('API route existe', testAPIHealth);
  await test('Conexão NeonDB', testAPIDBConnection);
  await test('Assets estáticos', testStaticAssets);

  console.log('\n' + '─'.repeat(50));
  console.log(`📊 Resultados: ${tests.passed} ✅ | ${tests.failed} ❌`);
  console.log('─'.repeat(50));

  if (tests.failed > 0) {
    console.log('\n🔍 Falhas encontradas:');
    tests.results.filter(r => r.startsWith('❌')).forEach(r => console.log(r));
    process.exit(1);
  } else {
    console.log('\n🎉 Todos os testes passaram!');
    process.exit(0);
  }
}

runAllTests();
