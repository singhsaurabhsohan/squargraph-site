import { createClient } from 'npm:@supabase/supabase-js@2.116.0';
import { ALLOWED_ORIGINS, PRODUCTS, type ProductKey } from './payment-config.ts';

function cors(origin: string) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://squargraph.com',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

function reply(origin: string, status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(origin), 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function text(value: unknown, max = 200) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
}

async function hmac(secret: string, message: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signed = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return Array.from(new Uint8Array(signed)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function equal(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function fingerprint(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  const ua = request.headers.get('user-agent') || '';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${ip}|${ua.slice(0, 180)}`));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function rateLimit(admin: ReturnType<typeof createClient>, request: Request) {
  const fp = await fingerprint(request);
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count, error } = await admin
    .from('public_submission_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('kind', 'payment_order')
    .eq('fingerprint', fp)
    .gte('created_at', since);
  if (error) return false;
  if (Number(count || 0) >= 12) return false;
  const { error: insertError } = await admin.from('public_submission_attempts').insert({ kind: 'payment_order', fingerprint: fp });
  return !insertError;
}

async function callRazorpay(keyId: string, keySecret: string, path: string, init: RequestInit) {
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Basic ${btoa(`${keyId}:${keySecret}`)}`);
  headers.set('Content-Type', 'application/json');
  const response = await fetch(`https://api.razorpay.com/v1${path}`, { ...init, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error?.description || 'Payment provider request failed.');
  return data;
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin') || '';
  if (request.method === 'OPTIONS') {
    return ALLOWED_ORIGINS.has(origin)
      ? new Response(null, { status: 204, headers: cors(origin) })
      : new Response(null, { status: 403, headers: cors(origin) });
  }
  if (request.method !== 'POST') return reply(origin, 405, { ok: false, error: 'Method not allowed.' });
  if (!ALLOWED_ORIGINS.has(origin)) return reply(origin, 403, { ok: false, error: 'Forbidden.' });

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const keyId = Deno.env.get('RAZORPAY_KEY_ID');
  const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
  if (!supabaseUrl || !serviceRoleKey || !keyId || !keySecret) {
    return reply(origin, 500, { ok: false, error: 'Payment service is not configured.' });
  }
  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return reply(origin, 400, { ok: false, error: 'Invalid request body.' }); }

  if (body.action === 'create_order') {
    if (!await rateLimit(admin, request)) {
      return reply(origin, 429, { ok: false, error: 'Too many payment attempts. Please try again shortly.' });
    }
    const productKey = text(body.product, 40) as ProductKey;
    const product = PRODUCTS[productKey];
    if (!product) return reply(origin, 400, { ok: false, error: 'Unknown product.' });

    const token = crypto.randomUUID();
    const providerOrder = await callRazorpay(keyId, keySecret, '/orders', {
      method: 'POST',
      body: JSON.stringify({
        amount: product.amount,
        currency: product.currency,
        receipt: `sq_${Date.now().toString(36)}_${token.slice(0, 8)}`,
        notes: { product: productKey, source: 'squargraph.com' },
      }),
    });

    const context = body.context && typeof body.context === 'object' ? body.context as Record<string, unknown> : {};
    const { error } = await admin.from('payment_orders').insert({
      order_token: token,
      provider_order_id: providerOrder.id,
      product_key: productKey,
      product_name: product.name,
      amount: product.amount,
      currency: product.currency,
      status: 'created',
      customer_email: text(context.email, 180).toLowerCase() || null,
      customer_name: text(context.name, 120) || null,
      customer_company: text(context.company, 160) || null,
      source: text(context.source, 160) || null,
      provider_payload: providerOrder,
    });
    if (error) return reply(origin, 500, { ok: false, error: 'Could not initialise payment.' });

    return reply(origin, 200, {
      ok: true,
      order_token: token,
      order_id: providerOrder.id,
      key_id: keyId,
      amount: product.amount,
      currency: product.currency,
      product_name: product.name,
      description: product.description,
    });
  }

  if (body.action === 'verify_payment') {
    const orderToken = text(body.order_token, 80);
    const paymentId = text(body.razorpay_payment_id, 120);
    const checkoutOrderId = text(body.razorpay_order_id, 120);
    const signature = text(body.razorpay_signature, 160);
    if (!orderToken || !paymentId || !checkoutOrderId || !signature) {
      return reply(origin, 400, { ok: false, error: 'Incomplete payment verification payload.' });
    }

    const { data: order, error } = await admin.from('payment_orders').select('*').eq('order_token', orderToken).maybeSingle();
    if (error || !order) return reply(origin, 404, { ok: false, error: 'Payment order not found.' });
    if (order.provider_order_id !== checkoutOrderId) return reply(origin, 400, { ok: false, error: 'Payment order mismatch.' });
    if (['verified', 'captured'].includes(order.status) && order.razorpay_payment_id === paymentId) {
      return reply(origin, 200, { ok: true, verified: true, payment_status: order.status });
    }

    const expected = await hmac(keySecret, `${order.provider_order_id}|${paymentId}`);
    if (!equal(expected, signature)) return reply(origin, 401, { ok: false, error: 'Payment signature verification failed.' });

    const payment = await callRazorpay(keyId, keySecret, `/payments/${encodeURIComponent(paymentId)}`, { method: 'GET' });
    if (payment.order_id !== order.provider_order_id || Number(payment.amount) !== Number(order.amount) || payment.currency !== order.currency) {
      return reply(origin, 400, { ok: false, error: 'Payment details do not match the order.' });
    }
    if (!['authorized', 'captured'].includes(payment.status)) {
      return reply(origin, 409, { ok: false, error: 'Payment is not authorised.' });
    }

    const status = payment.status === 'captured' ? 'captured' : 'verified';
    const { error: updateError } = await admin.from('payment_orders').update({
      status,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      provider_payload: payment,
      verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', order.id);
    if (updateError) return reply(origin, 500, { ok: false, error: 'Payment verified but could not be recorded.' });

    return reply(origin, 200, { ok: true, verified: true, payment_status: status });
  }

  return reply(origin, 400, { ok: false, error: 'Unsupported payment action.' });
});
