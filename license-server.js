const http = require('http');
const { LicenseManager } = require('./license-lib');

const PORT = process.env.PORT || 3001;
const stripeSecret = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const licenseSecret = process.env.LICENSE_SECRET || 'clawdiao_secret_123';

const lm = new LicenseManager('./licenses.json', stripeSecret);

function isAdmin(req) {
  const auth = req.headers.authorization || '';
  return auth === `Bearer ${licenseSecret}`;
}

function sendJSON(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Health
  if (url.pathname === '/status' && req.method === 'GET') {
    return sendJSON(res, 200, { status: 'ok', uptime: process.uptime() });
  }

  // Create checkout session
  if (url.pathname === '/create-checkout-session' && req.method === 'POST') {
    try {
      const { email, name } = await new Promise((resolve, reject) => {
        let body = ''; req.on('data', chunk => body += chunk); req.on('end', () => {
          try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
        });
      });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: process.env.STRIPE_PRICE_ID || 'price_placeholder', quantity: 1 }],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/obrigado?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout`,
        customer_email: email,
        metadata: { name }
      });
      return sendJSON(res, 200, { sessionId: session.id });
    } catch (e) {
      return sendJSON(res, 500, { error: e.message });
    }
  }

  // Webhook
  if (url.pathname === '/webhook' && req.method === 'POST') {
    const sig = req.headers['stripe-signature'];
    try {
      const buf = await new Promise(resolve => {
        let chunks = []; req.on('data', chunk => chunks.push(chunk)); req.on('end', () => resolve(Buffer.concat(chunks)));
      });
      const event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder');
      if (event.type === 'checkout.session.completed') {
        const key = await lm.createFromCheckout(event.data.object);
        console.log(`✅ License generated: ${key}`);
      }
      sendJSON(res, 200, { received: true });
    } catch (e) {
      sendJSON(res, 400, { error: e.message });
    }
    return;
  }

  // Verify license
  if (url.pathname.startsWith('/verify-license/') && req.method === 'GET') {
    const key = url.pathname.split('/')[2];
    const result = lm.verify(key);
    return sendJSON(res, result.valid ? 200 : 404, result);
  }

  // Generate manual (admin)
  if (url.pathname === '/generate-license' && req.method === 'POST') {
    if (!isAdmin(req)) return sendJSON(res, 401, { error: 'Unauthorized' });
    const { email } = await new Promise((resolve, reject) => {
      let body = ''; req.on('data', chunk => body += chunk); req.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
      });
    });
    const key = lm.generateManual(email);
    return sendJSON(res, 200, { license: key });
  }

  // List licenses (admin)
  if (url.pathname === '/licenses' && req.method === 'GET') {
    if (!isAdmin(req)) return sendJSON(res, 401, { error: 'Unauthorized' });
    return sendJSON(res, 200, { licenses: lm.listAll() });
  }

  sendJSON(res, 404, { error: 'Not found' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   🦁 License Server — Clawdiao Dashboard ║');
  console.log(`║   URL: http://localhost:${PORT}              ║`);
  console.log('╚══════════════════════════════════════════╝');
});
