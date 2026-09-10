import { createClient } from 'npm:@supabase/supabase-js@2.116.0';

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

function response(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') return response(405, { ok: false });
  const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!secret || !supabaseUrl || !serviceRoleKey) return response(500, { ok: false });

  const rawBody = await request.text();
  const supplied = request.headers.get('x-razorpay-signature') || '';
  const expected = await hmac(secret, rawBody);
  if (!supplied || !equal(expected, supplied)) return response(401, { ok: false });

  let event: Record<string, any>;
  try { event = JSON.parse(rawBody); }
  catch { return response(400, { ok: false }); }

  const payment = event?.payload?.payment?.entity;
  const order = event?.payload?.order?.entity;
  const providerOrderId = payment?.order_id || order?.id;
  if (!providerOrderId) return response(200, { ok: true, ignored: true });

  let status: string | null = null;
  if (event.event === 'payment.captured' || event.event === 'order.paid') status = 'captured';
  if (event.event === 'payment.failed') status = 'failed';
  if (event.event === 'refund.processed' || event.event === 'payment.refunded') status = 'refunded';
  if (!status) return response(200, { ok: true, ignored: true });

  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const { error } = await admin.from('payment_orders').update({
    status,
    razorpay_payment_id: payment?.id || undefined,
    provider_payload: event,
    updated_at: new Date().toISOString(),
  }).eq('provider_order_id', providerOrderId);

  if (error) return response(500, { ok: false });
  return response(200, { ok: true });
});
