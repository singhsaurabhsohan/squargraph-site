import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const ignored = new Set(['.git', 'node_modules', 'dist']);

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

async function collect(dir, extensions) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignored.has(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await collect(absolute, extensions));
    else if (entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext))) out.push(absolute);
  }
  return out;
}

async function text(relative) {
  return readFile(path.join(root, relative), 'utf8');
}

function requireText(source, needle, label) {
  if (!source.includes(needle)) errors.push(`${label}: expected ${JSON.stringify(needle)}`);
}

for (const required of [
  'supabase/production_hardening.sql',
  'supabase/lock_public_form_tables.sql',
  'supabase/functions/public-form-submit/index.ts',
  'supabase/functions/squargraph-payments/index.ts',
  'supabase/functions/squargraph-payment-webhook/index.ts',
]) {
  if (!await exists(path.join(root, required))) errors.push(`Missing hardened production resource: ${required}`);
}

const files = await collect(root, ['.html', '.js', '.mjs', '.ts', '.sql', '.md', '.json', '.yml', '.yaml']);
for (const file of files) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const source = await readFile(file, 'utf8');

  // Actual secret values must never be committed. Environment variable names and documentation are allowed.
  if (/\b(?:sk|sb)_service_role_[A-Za-z0-9._-]{12,}\b/.test(source)) {
    errors.push(`${relative}: possible committed service-role secret`);
  }
  if (/rzp_(?:test|live)_[A-Za-z0-9]+\s*[:=]\s*["'][A-Za-z0-9]{20,}["']/.test(source) && /key_secret/i.test(source)) {
    errors.push(`${relative}: possible committed Razorpay secret`);
  }

  // Payment checkout must not be independently implemented in HTML pages.
  if (relative.endsWith('.html') && /new\s+(?:window\.)?Razorpay\s*\(/.test(source)) {
    errors.push(`${relative}: direct Razorpay Checkout implementation bypasses shared verified payment flow`);
  }

  // General lead submissions must pass through the Edge Function gateway rather than a hard-coded REST path.
  if (relative !== 'assets/js/core.js' && /\/rest\/v1\/leads\b/.test(source)) {
    errors.push(`${relative}: direct leads REST endpoint found`);
  }
}

const config = await text('assets/js/config.js');
requireText(config, 'publicFormEndpoint:', 'assets/js/config.js');
requireText(config, 'paymentEndpoint:', 'assets/js/config.js');

const core = await text('assets/js/core.js');
requireText(core, 'window.SQ.submitPublicRows', 'assets/js/core.js');
requireText(core, 'captcha_token:', 'assets/js/core.js');

const payments = await text('supabase/functions/squargraph-payments/index.ts');
for (const needle of [
  "'/orders'",
  'razorpay_signature',
  "`${order.provider_order_id}|${paymentId}`",
  "`/payments/${encodeURIComponent(paymentId)}`",
  "['authorized', 'captured']",
  "'payment_orders'",
  "'payment_order'",
]) requireText(payments, needle, 'squargraph-payments');
if (!/@supabase\/supabase-js@\d+\.\d+\.\d+/.test(payments)) errors.push('squargraph-payments: supabase-js must be pinned to an exact version');

const webhook = await text('supabase/functions/squargraph-payment-webhook/index.ts');
for (const needle of ['RAZORPAY_WEBHOOK_SECRET', 'x-razorpay-signature', 'payment.captured', 'order.paid']) {
  requireText(webhook, needle, 'squargraph-payment-webhook');
}

const formGateway = await text('supabase/functions/public-form-submit/index.ts');
for (const needle of ['RECAPTCHA_SECRET_KEY', 'siteverify', 'public_submission_attempts', "body.table !== 'leads'"]) {
  requireText(formGateway, needle, 'public-form-submit');
}
if (!/@supabase\/supabase-js@\d+\.\d+\.\d+/.test(formGateway)) errors.push('public-form-submit: supabase-js must be pinned to an exact version');

const hardening = await text('supabase/production_hardening.sql');
for (const permission of [
  'companies.view','companies.edit','contacts.view','contacts.edit','opportunities.view','opportunities.edit',
  'outreach.view','outreach.edit','calendar.view','calendar.edit','proposals.view','proposals.create','proposals.edit',
]) requireText(hardening, permission, 'production_hardening.sql');
requireText(hardening, "member.status = 'active'", 'production_hardening.sql');
requireText(hardening, "role.role_key in ('partner','client','guest')", 'production_hardening.sql');

const headers = await text('_headers');
for (const header of ['Content-Security-Policy:', 'Strict-Transport-Security:', 'X-Content-Type-Options:', 'Referrer-Policy:', 'Permissions-Policy:']) {
  requireText(headers, header, '_headers');
}
requireText(headers, "frame-ancestors 'self'", '_headers');
requireText(headers, "object-src 'none'", '_headers');

const feedback = await text('feedback.html');
if (/\/rest\/v1\//.test(feedback)) {
  warnings.push('feedback.html still uses its dedicated feedback-table submission path; keep INSERT-only RLS/rate controls on that table until it is migrated to the shared gateway.');
}

console.log(`Security regression scan checked ${files.length} text files.`);
warnings.forEach((message) => console.warn(`WARN ${message}`));
errors.forEach((message) => console.error(`ERROR ${message}`));
console.log(`${errors.length} error(s), ${warnings.length} warning(s).`);
if (errors.length) process.exit(1);
