import { createClient } from 'npm:@supabase/supabase-js@2.116.0';

const ALLOWED_ORIGINS = new Set([
  'https://squargraph.com',
  'https://www.squargraph.com',
  'http://127.0.0.1:4177',
  'http://localhost:4177',
]);
const ALLOWED_CAPTCHA_HOSTS = new Set(['squargraph.com', 'www.squargraph.com', 'localhost', '127.0.0.1']);

const LEAD_FIELDS = new Set([
  'name','phone','email','company','service','budget','timeline','message','reference','created_at','source_url',
  'country','city','industry','designation','brand_description','revenue','website','instagram','linkedin','facebook',
  'youtube','twitter','competitor1','competitor1_instagram','competitor2','competitor2_instagram','competitor3',
  'competitor3_instagram','challenge','goal','how_heard','source','status'
]);
const FEEDBACK_FIELDS = new Set([
  'name','email','profession','rating','first_impression','positioning_clarity','standout','explored_audit',
  'audit_experience','improvements','recommend','additional','submitted_at','source'
]);

function cors(origin: string) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://squargraph.com',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

function respond(origin: string, status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(origin), 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function clean(value: unknown, max = 2000) {
  if (value == null) return null;
  if (typeof value === 'boolean' || typeof value === 'number') return value;
  return String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}

function objectRow(input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid submission.');
  return input as Record<string, unknown>;
}

function normaliseLead(input: unknown) {
  const row = objectRow(input);
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (!LEAD_FIELDS.has(key)) continue;
    output[key] = clean(value, key === 'message' || key === 'challenge' || key === 'brand_description' ? 5000 : 1000);
  }
  output.email = String(output.email || '').toLowerCase();
  output.source_url = String(output.source_url || '').slice(0, 1000);
  output.created_at = new Date().toISOString();
  if (!output.name || !output.email || !/^\S+@\S+\.\S+$/.test(String(output.email))) throw new Error('A valid name and email are required.');
  return output;
}

function normaliseFeedback(input: unknown) {
  const row = objectRow(input);
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (!FEEDBACK_FIELDS.has(key)) continue;
    output[key] = clean(value, ['first_impression','standout','audit_experience','improvements','additional'].includes(key) ? 2500 : 500);
  }
  const rating = Number(output.rating || 0);
  const profession = String(output.profession || '');
  const email = String(output.email || '').toLowerCase();
  if (!profession || !Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error('Profession and a 1-5 rating are required.');
  if (email && !/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid email address.');
  output.rating = rating;
  output.email = email || null;
  output.name = String(output.name || '') || null;
  output.submitted_at = new Date().toISOString();
  output.source = 'squargraph-feedback-v2';
  return output;
}

function getAdminKey() {
  const direct = Deno.env.get('SUPABASE_SECRET_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (direct) return direct;
  const raw = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (!raw) return '';
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'string') return parsed;
    if (Array.isArray(parsed)) {
      const value = parsed.find((item) => typeof item === 'string' && item);
      return typeof value === 'string' ? value : '';
    }
    if (parsed && typeof parsed === 'object') {
      for (const value of Object.values(parsed)) {
        if (typeof value === 'string' && value) return value;
      }
    }
  } catch {
    return '';
  }
  return '';
}

async function fingerprint(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  const ua = request.headers.get('user-agent') || '';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${ip}|${ua.slice(0, 180)}`));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function checkRateLimit(admin: ReturnType<typeof createClient>, request: Request, kind: string) {
  const fp = await fingerprint(request);
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count, error } = await admin
    .from('public_submission_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('kind', kind)
    .eq('fingerprint', fp)
    .gte('created_at', since);
  if (error || Number(count || 0) >= 8) return false;
  const { error: insertError } = await admin.from('public_submission_attempts').insert({ kind, fingerprint: fp });
  return !insertError;
}

async function verifyRecaptcha(token: string, secret: string) {
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  const result = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await result.json().catch(() => ({}));
  if (data.success !== true) return false;
  if (data.hostname && !ALLOWED_CAPTCHA_HOSTS.has(String(data.hostname).toLowerCase())) return false;
  if (data.challenge_ts) {
    const age = Date.now() - new Date(data.challenge_ts).getTime();
    if (!Number.isFinite(age) || age < -60000 || age > 10 * 60 * 1000) return false;
  }
  return true;
}

async function verifyLeadEmail(admin: ReturnType<typeof createClient>, accessToken: string, email: string) {
  if (!accessToken) return false;
  const { data, error } = await admin.auth.getUser(accessToken);
  if (error || !data.user || !data.user.email) return false;
  return data.user.email.trim().toLowerCase() === email.trim().toLowerCase();
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin') || '';
  if (request.method === 'OPTIONS') {
    if (!ALLOWED_ORIGINS.has(origin)) return new Response(null, { status: 403, headers: cors(origin) });
    return new Response(null, { status: 204, headers: cors(origin) });
  }
  if (request.method !== 'POST') return respond(origin, 405, { ok: false, error: 'Method not allowed.' });
  if (!ALLOWED_ORIGINS.has(origin)) return respond(origin, 403, { ok: false, error: 'Forbidden.' });

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const adminKey = getAdminKey();
  if (!supabaseUrl || !adminKey) return respond(origin, 500, { ok: false, error: 'Submission service is not configured.' });
  const admin = createClient(supabaseUrl, adminKey, { auth: { persistSession: false } });

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return respond(origin, 400, { ok: false, error: 'Invalid request body.' }); }

  const table = String(body.table || '');
  if (!['leads', 'feedback'].includes(table)) return respond(origin, 400, { ok: false, error: 'Unsupported form destination.' });
  if (!await checkRateLimit(admin, request, table === 'feedback' ? 'feedback' : 'lead')) {
    return respond(origin, 429, { ok: false, error: 'Too many submissions. Please try again later.' });
  }

  const rows = Array.isArray(body.rows) ? body.rows : [];
  if (rows.length !== 1) return respond(origin, 400, { ok: false, error: 'Submit one form at a time.' });

  const captchaSecret = Deno.env.get('RECAPTCHA_SECRET_KEY');
  if (!captchaSecret) return respond(origin, 500, { ok: false, error: 'Captcha verification is not configured.' });
  const validCaptcha = await verifyRecaptcha(String(body.captcha_token || ''), captchaSecret);
  if (!validCaptcha) return respond(origin, 400, { ok: false, error: 'Captcha verification failed.' });

  let record: Record<string, unknown>;
  try { record = table === 'feedback' ? normaliseFeedback(rows[0]) : normaliseLead(rows[0]); }
  catch (error) { return respond(origin, 400, { ok: false, error: error instanceof Error ? error.message : 'Invalid submission.' }); }

  if (table === 'leads') {
    const isBrandGrowthAudit = String(record.source || '') === 'Brand Growth Audit™';
    if (!isBrandGrowthAudit) {
      const verified = await verifyLeadEmail(admin, String(body.email_access_token || ''), String(record.email || ''));
      if (!verified) return respond(origin, 401, { ok: false, error: 'Verify your email code before submitting.' });
    }
  }

  const { data, error } = await admin.from(table).insert(record).select('id').single();
  if (error) return respond(origin, 500, { ok: false, error: 'Could not save your submission.' });
  return respond(origin, 200, { ok: true, data: { id: data.id } });
});
