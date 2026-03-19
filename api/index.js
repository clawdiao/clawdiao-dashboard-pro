const { LicenseManager } = require('../stripe/license-lib');
const { Stripe } = require('stripe');

// Config
const stripeSecret = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const licenseSecret = process.env.LICENSE_SECRET || 'clawdiao_secret_123';
const dbPath = process.env.LICENSE_DB || '/tmp/licenses.json'; // Vercel é read-only fora /tmp

const stripe = new Stripe(stripeSecret);
const lm = new LicenseManager(dbPath, stripeSecret);

// Helper auth
function isAdmin(req) {
  const auth = req.headers.authorization || '';
  return auth === `Bearer ${licenseSecret}`;
}

// Handler principal
module.exports.handler = async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.status(204).end();
    return;
  }

  const url = new URL(req.url, `https://${req.headers.host}`);
  const pathname = url.pathname;

  // POST /create-checkout-session
  if (pathname === '/create-checkout-session' && req.method === 'POST') {
    try {
      const { email, name } = await req.json();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: process.env.STRIPE_PRICE_ID || 'price_placeholder', quantity: 1 }],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/obrigado?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout`,
        customer_email: email,
        metadata: { name }
      });
      return res.status(200).json({ sessionId: session.id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // POST /webhook
  if (pathname === '/webhook' && req.method === 'POST') {
    const sig = req.headers['stripe-signature'];
    try {
      const event = stripe.webhooks.constructEvent(await req.buffer, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder');
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const key = await lm.createFromCheckout(session);
        console.log(`License generated: ${key} for ${session.customer_email}`);
      }
      return res.status(200).json({ received: true });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  // GET /verify-license/:key
  if (pathname.startsWith('/verify-license/') && req.method === 'GET') {
    const key = pathname.split('/')[2];
    const result = lm.verify(key);
    return res.status(result.valid ? 200 : 404).json(result);
  }

  // POST /generate-license
  if (pathname === '/generate-license' && req.method === 'POST') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
    const { email } = await req.json();
    const key = lm.generateManual(email);
    return res.status(200).json({ license: key });
  }

  // GET /licenses (admin)
  if (pathname === '/licenses' && req.method === 'GET') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
    return res.status(200).json({ licenses: lm.listAll() });
  }

  // GET /status
  if (pathname === '/status' && req.method === 'GET') {
    return res.status(200).json({ status: 'ok', uptime: process.uptime() });
  }

  return res.status(404).json({ error: 'Not found' });
};
