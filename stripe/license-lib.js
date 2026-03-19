/**
 * license-lib — Lógica de licenças (shared between standalone and serverless)
 */

const fs = require('fs');
const path = require('path');
const { Stripe } = require('stripe');

class LicenseManager {
  constructor(dbPath, stripeSecret) {
    this.dbPath = dbPath;
    this.stripe = new Stripe(stripeSecret);
    this.licenses = {};
    this.load();
  }

  load() {
    if (fs.existsSync(this.dbPath)) {
      try { this.licenses = JSON.parse(fs.readFileSync(this.dbPath)); } catch (e) { this.licenses = {}; }
    }
  }

  save() {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.licenses, null, 2));
  }

  async createFromCheckout(session) {
    const email = session.customer_email;
    const key = this.generateKey();
    this.licenses[key] = {
      email,
      active: true,
      created_at: new Date().toISOString(),
      stripe_session: session.id
    };
    this.save();
    return key;
  }

  generateKey() {
    return 'CLAW-' + Math.random().toString(36).substr(2,4).toUpperCase() + '-' + Math.random().toString(36).substr(2,4).toUpperCase() + '-' + Math.random().toString(36).substr(2,4).toUpperCase();
  }

  verify(key) {
    const lic = this.licenses[key];
    if (lic && lic.active) return { valid: true, email: lic.email };
    return { valid: false };
  }

  generateManual(email) {
    const key = this.generateKey();
    this.licenses[key] = { email, active: true, created_at: new Date().toISOString(), manual: true };
    this.save();
    return key;
  }

  listAll() { return this.licenses; }
}

module.exports = { LicenseManager };
