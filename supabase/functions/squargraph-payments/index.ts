import { createClient } from 'npm:@supabase/supabase-js@2.116.0';
import { ALLOWED_ORIGINS, PRODUCTS, type ProductKey } from './payment-config.ts';

const CONTROL_SUPABASE_URL = 'https://htuswsvgobgpurnbmjkk.supabase.co';
const CONTROL_PUBLISHABLE_KEY = 'sb_publishable_WBkaADa8PF8gTWEh5vYtKg_HvNWeYNI';

async function controlRpc(name: string, body: Record<string, unknown>, userToken?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    apikey: CONTROL_PUBLISHABLE_KEY,
  };
  if (userToken) headers.Authorization = `Bearer ${userToken}`;
  const response = await fetch(`${CONTROL_SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof data?.message === 'string' ? data.message : 'Control billing request failed.';
    throw new Error(message);
  }
  return data;
}

function cors(origin: string) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://squargraph.com',
    'Access-Control-Allow-Headers': 'content-type, authorization',
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

function supabaseAdminKey() {
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const single = Deno.env.get('SUPABASE_SECRET_KEY');
  if (legacy || single) return legacy || single || '';
  try {
    const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}');
    return String(keys.default || Object.values(keys)[0] || '');
  } catch {
    return '';
  }
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
  if (error || Number(count || 0) >= 12) return false;
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

async function capturedPayment(keyId: string, keySecret: string, paymentId: string, amount: number, currency: string) {
  let payment = await callRazorpay(keyId, keySecret, `/payments/${encodeURIComponent(paymentId)}`, { method: 'GET' });
  if (payment.status === 'captured') return payment;
  if (payment.status !== 'authorized') return payment;

  try {
    payment = await callRazorpay(keyId, keySecret, `/payments/${encodeURIComponent(paymentId)}/capture`, {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    });
  } catch (captureError) {
    // Auto-capture can win the race between fetch and manual capture. Re-fetch once before failing.
    const latest = await callRazorpay(keyId, keySecret, `/payments/${encodeURIComponent(paymentId)}`, { method: 'GET' });
    if (latest.status === 'captured') return latest;
    throw captureError;
  }
  return payment;
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
  const adminKey = supabaseAdminKey();
  const keyId = Deno.env.get('RAZORPAY_KEY_ID');
  const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
  if (!supabaseUrl || !adminKey || !keyId || !keySecret) {
    return reply(origin, 500, { ok: false, error: 'Payment service is not configured.' });
  }
  const admin = createClient(supabaseUrl, adminKey, { auth: { persistSession: false } });

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return reply(origin, 400, { ok: false, error: 'Invalid request body.' }); }


  if (body.action === 'create_control_order') {
    if (!await rateLimit(admin, request)) {
      return reply(origin, 429, { ok: false, error: 'Too many payment attempts. Please try again shortly.' });
    }

    const authorization = request.headers.get('authorization') || '';
    const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
    const userToken = tokenMatch?.[1]?.trim() || '';
    if (!userToken) return reply(origin, 401, { ok: false, error: 'Control authentication required.' });

    const orderToken = text(body.order_token, 80);
    if (!orderToken) return reply(origin, 400, { ok: false, error: 'Billing order token is required.' });

    let intent: Record<string, any>;
    try {
      intent = await controlRpc('control_billing_intent_for_payment', { p_order_token: orderToken }, userToken);
    } catch (error) {
      return reply(origin, 403, { ok: false, error: error instanceof Error ? error.message : 'Control billing intent could not be verified.' });
    }

    const amount = Number(intent.amount_paise || 0);
    const currency = String(intent.currency || '').toUpperCase();
    const confirmationToken = String(intent.confirmation_token || '');
    const clientKey = text(intent.client_key, 80);
    if (!Number.isInteger(amount) || amount <= 0 || currency !== 'INR' || !confirmationToken || !clientKey) {
      return reply(origin, 409, { ok: false, error: 'Control billing intent is incomplete.' });
    }

    const providerOrder = await callRazorpay(keyId, keySecret, '/orders', {
      method: 'POST',
      body: JSON.stringify({
        amount,
        currency,
        receipt: `ctrl_${Date.now().toString(36)}_${orderToken.slice(0, 8)}`,
        notes: {
          product: 'control_renewal',
          source: 'control.squargraph.com',
          client_key: clientKey,
          control_order_token: orderToken,
        },
      }),
    });

    const { error: insertError } = await admin.from('payment_orders').insert({
      order_token: orderToken,
      provider_order_id: providerOrder.id,
      product_key: 'control_renewal',
      product_name: `SQUARGRAPH Site Control renewal — ${text(intent.client_name, 100) || clientKey}`,
      amount,
      currency,
      status: 'created',
      customer_email: text(intent.billing_email, 180).toLowerCase() || null,
      customer_name: text(intent.billing_name, 120) || null,
      customer_company: text(intent.billing_company, 160) || null,
      source: 'control.squargraph.com',
      provider_payload: providerOrder,
      control_client_key: clientKey,
      control_service_id: String(intent.service_id || '') || null,
      control_confirmation_token: confirmationToken,
      control_callback_url: `${CONTROL_SUPABASE_URL}/functions/v1/control-billing-callback`,
      billing_period_months: Number(intent.billing_cycle_months || 1),
      billing_period_start: intent.period_start || null,
      billing_period_end: intent.period_end || null,
    });

    if (insertError) {
      return reply(origin, 500, { ok: false, error: 'Could not initialise the Control renewal payment.' });
    }

    try {
      await controlRpc(
        'control_attach_billing_provider_order',
        { p_order_token: orderToken, p_provider_order_id: providerOrder.id },
        userToken
      );
    } catch {
      await admin.from('payment_orders').update({ status: 'failed', updated_at: new Date().toISOString() }).eq('provider_order_id', providerOrder.id);
      return reply(origin, 500, { ok: false, error: 'Payment order was created but could not be linked to Control. Please retry.' });
    }

    return reply(origin, 200, {
      ok: true,
      order_token: orderToken,
      order_id: providerOrder.id,
      key_id: keyId,
      amount,
      currency,
      product_name: `SQUARGRAPH Site Control renewal — ${text(intent.client_name, 100) || clientKey}`,
      description: `${Number(intent.billing_cycle_months || 1)} month service renewal`,
      client_name: intent.client_name,
      period_end: intent.period_end,
    });
  }

  if (body.action === 'verify_control_payment') {
    const orderToken = text(body.order_token, 80);
    const paymentId = text(body.razorpay_payment_id, 120);
    const checkoutOrderId = text(body.razorpay_order_id, 120);
    const signature = text(body.razorpay_signature, 160);

    if (!orderToken || !paymentId || !checkoutOrderId || !signature) {
      return reply(origin, 400, { ok: false, error: 'Incomplete payment verification payload.' });
    }

    const { data: order, error } = await admin
      .from('payment_orders')
      .select('*')
      .eq('order_token', orderToken)
      .eq('product_key', 'control_renewal')
      .maybeSingle();

    if (error || !order) return reply(origin, 404, { ok: false, error: 'Control renewal payment order not found.' });
    if (order.provider_order_id !== checkoutOrderId) return reply(origin, 400, { ok: false, error: 'Payment order mismatch.' });

    const finalize = async () => {
      const response = await fetch(`${CONTROL_SUPABASE_URL}/functions/v1/control-billing-callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_token: orderToken,
          confirmation_token: order.control_confirmation_token,
          provider_order_id: order.provider_order_id,
          provider_payment_id: paymentId,
          amount_paise: Number(order.amount),
          currency: String(order.currency),
          provider_payload: order.provider_payload || {},
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.ok !== true) {
        throw new Error(data?.error || 'Control renewal finalisation is pending.');
      }
      return data;
    };

    if (order.status === 'captured' && order.razorpay_payment_id === paymentId) {
      try {
        const finalised = await finalize();
        return reply(origin, 200, {
          ok: true,
          verified: true,
          payment_status: 'captured',
          invoice_number: finalised.invoice_number,
          paid_through: finalised.paid_through,
          email_status: finalised.email_status,
          whatsapp_status: finalised.whatsapp_status,
        });
      } catch {
        return reply(origin, 200, { ok: true, verified: true, payment_status: 'captured', finalisation_pending: true });
      }
    }

    const expected = await hmac(keySecret, `${order.provider_order_id}|${paymentId}`);
    if (!equal(expected, signature)) return reply(origin, 401, { ok: false, error: 'Payment signature verification failed.' });

    let payment;
    try {
      payment = await capturedPayment(keyId, keySecret, paymentId, Number(order.amount), String(order.currency));
    } catch {
      return reply(origin, 409, { ok: false, error: 'Payment is authorised but could not be captured yet. Please contact SQUARGRAPH if the amount was debited.' });
    }

    if (payment.order_id !== order.provider_order_id || Number(payment.amount) !== Number(order.amount) || payment.currency !== order.currency) {
      return reply(origin, 400, { ok: false, error: 'Payment details do not match the renewal order.' });
    }
    if (payment.status !== 'captured' || payment.captured === false) {
      return reply(origin, 409, { ok: false, error: 'Payment has not been captured. The service renewal has not been applied.' });
    }

    const { error: updateError } = await admin.from('payment_orders').update({
      status: 'captured',
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      provider_payload: payment,
      verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', order.id);

    if (updateError) {
      return reply(origin, 500, { ok: false, error: 'Payment captured but could not be recorded. Contact SQUARGRAPH with the payment ID.' });
    }

    try {
      const updatedOrder = { ...order, provider_payload: payment };
      const response = await fetch(`${CONTROL_SUPABASE_URL}/functions/v1/control-billing-callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_token: orderToken,
          confirmation_token: updatedOrder.control_confirmation_token,
          provider_order_id: updatedOrder.provider_order_id,
          provider_payment_id: paymentId,
          amount_paise: Number(updatedOrder.amount),
          currency: String(updatedOrder.currency),
          provider_payload: payment,
        }),
      });
      const finalised = await response.json().catch(() => ({}));
      if (response.ok && finalised?.ok === true) {
        return reply(origin, 200, {
          ok: true,
          verified: true,
          payment_status: 'captured',
          invoice_number: finalised.invoice_number,
          paid_through: finalised.paid_through,
          email_status: finalised.email_status,
          whatsapp_status: finalised.whatsapp_status,
        });
      }
    } catch {}

    return reply(origin, 200, {
      ok: true,
      verified: true,
      payment_status: 'captured',
      finalisation_pending: true,
    });
  }

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
    if (order.status === 'captured' && order.razorpay_payment_id === paymentId) {
      return reply(origin, 200, { ok: true, verified: true, payment_status: 'captured' });
    }

    const expected = await hmac(keySecret, `${order.provider_order_id}|${paymentId}`);
    if (!equal(expected, signature)) return reply(origin, 401, { ok: false, error: 'Payment signature verification failed.' });

    let payment;
    try {
      payment = await capturedPayment(keyId, keySecret, paymentId, Number(order.amount), String(order.currency));
    } catch (captureError) {
      return reply(origin, 409, { ok: false, error: 'Payment is authorised but could not be captured yet. Please contact SQUARGRAPH if the amount was debited.' });
    }

    if (payment.order_id !== order.provider_order_id || Number(payment.amount) !== Number(order.amount) || payment.currency !== order.currency) {
      return reply(origin, 400, { ok: false, error: 'Payment details do not match the order.' });
    }
    if (payment.status !== 'captured' || payment.captured === false) {
      return reply(origin, 409, { ok: false, error: 'Payment has not been captured. No service has been confirmed.' });
    }

    const { error: updateError } = await admin.from('payment_orders').update({
      status: 'captured',
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      provider_payload: payment,
      verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', order.id);
    if (updateError) return reply(origin, 500, { ok: false, error: 'Payment captured but could not be recorded. Contact SQUARGRAPH with the payment ID.' });

    return reply(origin, 200, { ok: true, verified: true, payment_status: 'captured' });
  }

  return reply(origin, 400, { ok: false, error: 'Unsupported payment action.' });
});
