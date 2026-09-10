import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
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
  'supabase/config.toml',
  'supabase/production_hardening.sql',
  'supabase/lock_public_form_tables.sql',
  'supabase/functions/public-form-submit/index.ts',
  'supabase/functions/squargraph-payments/index.ts',
  'supabase/functions/squargraph-payment-webhook/index.ts',
]) {
  if (!await exists(path.join(root, required))) errors.push(`Missing hardened production resource: ${required}`);
}

const files = await collect(root, ['.html', '.js', '.mjs', '.ts', '.sql', '.md', '.json', '.yml', '.yaml', '.toml']);
for (const file of files) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const source = await readFile(file, 'utf8');

  if (/\b(?:sk|sb)_service_role_[A-Za-z0-9._-]{12,}\b/.test(source)) {
    errors.push(`${relative}: possible committed service-role secret`);
  }
  if (/rzp_(?:test|live)_[A-Za-z0-9]+\s*[:=]\s*["'][A-Za-z0-9]{20,}["']/.test(source) && /key_secret/i.test(source)) {
    errors.push(`${relative}: possible committed Razorpay secret`);
  }

  if (relative.endsWith('.html') && /new\s+(?:window\.)?Razorpay\s*\(/.test(source)) {
    errors.push(`${relative}: direct Razorpay Checkout implementation bypasses shared verified payment flow`);
  }

  if (relative !== 'assets/js/core.js' && /\/rest\/v1\/(?:leads|feedback)\b/.test(source)) {
    errors.push(`${relative}: direct public-form REST endpoint found`);
  }
}

const config = await text('assets/js/config.js');
requireText(config, 'publicFormEndpoint:', 'assets/js/config.js');
requireText(config, 'paymentEndpoint:', 'assets/js/config.js');

const core = await text('assets/js/core.js');
for (const needle of [
  'window.SQ.submitPublicRows',
  'captcha_token:',
  'email_access_token:',
  'window.SQ.getVerifiedEmailToken',
]) requireText(core, needle, 'assets/js/core.js');

const payments = await text('supabase/functions/squargraph-payments/index.ts');
for (const needle of [
  "'/orders'",
  'razorpay_signature',
  "`${order.provider_order_id}|${paymentId}`",
  "`/payments/${encodeURIComponent(paymentId)}`",
  "`/payments/${encodeURIComponent(paymentId)}/capture`",
  "payment.status !== 'captured'",
  "status: 'captured'",
  "'payment_orders'",
  "'payment_order'",
]) requireText(payments, needle, 'squargraph-payments');
if (!/@supabase\/supabase-js@\d+\.\d+\.\d+/.test(payments)) errors.push('squargraph-payments: supabase-js must be pinned to an exact version');

const webhook = await text('supabase/functions/squargraph-payment-webhook/index.ts');
for (const needle of ['RAZORPAY_WEBHOOK_SECRET', 'x-razorpay-signature', 'payment.captured', 'order.paid']) {
  requireText(webhook, needle, 'squargraph-payment-webhook');
}

const formGateway = await text('supabase/functions/public-form-submit/index.ts');
for (const needle of [
  'RECAPTCHA_SECRET_KEY',
  'siteverify',
  'ALLOWED_CAPTCHA_HOSTS',
  'public_submission_attempts',
  "['leads', 'feedback']",
  'email_access_token',
  'verifyLeadEmail',
  'admin.auth.getUser(accessToken)',
]) requireText(formGateway, needle, 'public-form-submit');
if (!/@supabase\/supabase-js@\d+\.\d+\.\d+/.test(formGateway)) errors.push('public-form-submit: supabase-js must be pinned to an exact version');

const feedback = await text('feedback.html');
requireText(feedback, "window.SQ.submitPublicRows('feedback'", 'feedback.html');
if (/\/rest\/v1\//.test(feedback)) errors.push('feedback.html: direct Supabase REST write remains');

const hardening = await text('supabase/production_hardening.sql');
for (const permission of [
  'companies.view','companies.edit','contacts.view','contacts.edit','opportunities.view','opportunities.edit',
  'outreach.view','outreach.edit','calendar.view','calendar.edit','proposals.view','proposals.create','proposals.edit',
]) requireText(hardening, permission, 'production_hardening.sql');
requireText(hardening, "member.status = 'active'", 'production_hardening.sql');
requireText(hardening, "role.role_key in ('client','guest')", 'production_hardening.sql');
requireText(hardening, 'Partner is an active internal collaborator role', 'production_hardening.sql');

const lockdown = await text('supabase/lock_public_form_tables.sql');
requireText(lockdown, 'revoke insert on public.leads from anon, authenticated', 'lock_public_form_tables.sql');
requireText(lockdown, 'revoke insert on public.feedback from anon, authenticated', 'lock_public_form_tables.sql');

const functionConfig = await text('supabase/config.toml');
for (const functionName of ['public-form-submit', 'squargraph-payments', 'squargraph-payment-webhook']) {
  requireText(functionConfig, `[functions.${functionName}]`, 'supabase/config.toml');
}
const verifyJwtOffCount = (functionConfig.match(/verify_jwt\s*=\s*false/g) || []).length;
if (verifyJwtOffCount < 3) errors.push('supabase/config.toml: all three public/provider endpoints must explicitly set verify_jwt = false');

const headers = await text('_headers');
for (const header of ['Content-Security-Policy:', 'Strict-Transport-Security:', 'X-Content-Type-Options:', 'Referrer-Policy:', 'Permissions-Policy:']) {
  requireText(headers, header, '_headers');
}
requireText(headers, "frame-ancestors 'self'", '_headers');
requireText(headers, "object-src 'none'", '_headers');

console.log(`Security regression scan checked ${files.length} text files.`);
errors.forEach((message) => console.error(`ERROR ${message}`));
console.log(`${errors.length} error(s).`);
if (errors.length) process.exit(1);
