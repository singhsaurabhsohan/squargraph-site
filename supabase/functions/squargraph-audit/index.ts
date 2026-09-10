import { createClient } from 'npm:@supabase/supabase-js@2.116.0';

const ALLOWED_ORIGINS = new Set([
  'https://squargraph.com',
  'https://www.squargraph.com',
  'http://127.0.0.1:4177',
  'http://localhost:4177',
]);

type AuditInput = {
  company: string;
  industry: string;
  brand_description: string;
  website: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  twitter: string;
  competitor1: string;
  competitor2: string;
  competitor3: string;
  challenge: string;
  goal: string;
};

type AuditScores = {
  web: number;
  comm: number;
  comp: number;
  overall: number;
  confidence: number;
  headline: string;
  summary: string;
  web_insight: string;
  comm_insight: string;
  comp_insight: string;
  model: string;
};

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

function adminKey() {
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

function clean(value: unknown, max = 1500) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function sanitiseInput(value: unknown): AuditInput {
  const input = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
  return {
    company: clean(input.company, 160),
    industry: clean(input.industry, 160),
    brand_description: clean(input.brand_description, 1800),
    website: clean(input.website, 500),
    instagram: clean(input.instagram, 500),
    facebook: clean(input.facebook, 500),
    linkedin: clean(input.linkedin, 500),
    youtube: clean(input.youtube, 500),
    twitter: clean(input.twitter, 500),
    competitor1: clean(input.competitor1, 180),
    competitor2: clean(input.competitor2, 180),
    competitor3: clean(input.competitor3, 180),
    challenge: clean(input.challenge, 1800),
    goal: clean(input.goal, 500),
  };
}

function clamp(value: unknown, fallback = 50) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function fallbackScores(input: AuditInput): AuditScores {
  const socialCount = [input.instagram, input.facebook, input.linkedin, input.youtube, input.twitter].filter(Boolean).length;
  const competitorCount = [input.competitor1, input.competitor2, input.competitor3].filter(Boolean).length;
  const web = input.website ? 58 : 44;
  const comm = Math.min(78, 34 + socialCount * 9);
  const comp = competitorCount >= 2 ? 58 : competitorCount === 1 ? 52 : 46;
  const overall = Math.round(web * 0.4 + comm * 0.3 + comp * 0.3);
  const confidence = Math.min(78, 48 + socialCount * 4 + competitorCount * 5 + (input.website ? 5 : 0));
  return {
    web,
    comm,
    comp,
    overall,
    confidence,
    headline: 'Preliminary brand signals identified',
    summary: `${input.company || 'Your brand'} has enough visible information for a preliminary directional assessment. The complete audit should prioritise the gaps with the greatest effect on perception, conversion and growth. Scores are intentionally conservative until deeper evidence is reviewed.`,
    web_insight: input.website ? 'A website signal is available for deeper review.' : 'No website was supplied, which limits digital assessment confidence.',
    comm_insight: `${socialCount} public communication channel${socialCount === 1 ? '' : 's'} were supplied for review.`,
    comp_insight: competitorCount >= 2 ? 'The supplied competitive set supports a directional comparison.' : 'Competitive confidence is limited because fewer than two competitors were supplied.',
    model: 'deterministic-fallback-v1',
  };
}

function parseModelJson(raw: string, fallback: AuditScores, model: string): AuditScores {
  const cleanRaw = raw.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').replace(/```(?:json)?|```/gi, '').trim();
  const match = cleanRaw.match(/\{[\s\S]*\}/);
  if (!match) return fallback;
  try {
    const parsed = JSON.parse(match[0]);
    const web = clamp(parsed.web, fallback.web);
    const comm = clamp(parsed.comm, fallback.comm);
    const comp = clamp(parsed.comp, fallback.comp);
    return {
      web,
      comm,
      comp,
      overall: clamp(parsed.overall, Math.round(web * 0.4 + comm * 0.3 + comp * 0.3)),
      confidence: clamp(parsed.confidence, fallback.confidence),
      headline: clean(parsed.headline, 100) || fallback.headline,
      summary: clean(parsed.summary, 900) || fallback.summary,
      web_insight: clean(parsed.web_insight, 350) || fallback.web_insight,
      comm_insight: clean(parsed.comm_insight, 350) || fallback.comm_insight,
      comp_insight: clean(parsed.comp_insight, 350) || fallback.comp_insight,
      model,
    };
  } catch {
    return fallback;
  }
}

async function analyse(input: AuditInput): Promise<AuditScores> {
  const fallback = fallbackScores(input);
  const apiKey = Deno.env.get('OPENROUTER_API_KEY');
  const model = Deno.env.get('OPENROUTER_AUDIT_MODEL');
  if (!apiKey || !model) return fallback;

  const prompt = `You are a senior brand strategist producing a conservative preliminary assessment for SQUARGRAPH™.\n\nBRAND\nCompany: ${input.company || 'Unknown'}\nIndustry: ${input.industry || 'Not provided'}\nDescription: ${input.brand_description || 'Not provided'}\nWebsite: ${input.website || 'Not provided'}\n\nPUBLIC COMMUNICATION\nInstagram: ${input.instagram || 'Not provided'}\nFacebook: ${input.facebook || 'Not provided'}\nLinkedIn: ${input.linkedin || 'Not provided'}\nYouTube: ${input.youtube || 'Not provided'}\nX/Twitter: ${input.twitter || 'Not provided'}\n\nCOMPETITORS\n1: ${input.competitor1 || 'Not provided'}\n2: ${input.competitor2 || 'Not provided'}\n3: ${input.competitor3 || 'Not provided'}\n\nCONTEXT\nChallenge: ${input.challenge || 'Not provided'}\nGoal: ${input.goal || 'Not provided'}\n\nReturn raw JSON only with: web, comm, comp, overall, confidence as integers 0-100; headline under 9 words; summary in 2-4 concise sentences; web_insight; comm_insight; comp_insight. Overall should broadly weight web 40%, communication 30%, competitive position 30%. Do not invent facts or claim to have browsed URLs you did not actually inspect. Lower confidence when evidence is missing.`;

  const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://squargraph.com',
      'X-Title': 'SQUARGRAPH Brand Growth Audit',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'Return only the requested JSON. Never invent evidence.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 700,
    }),
  });
  if (!upstream.ok) return fallback;
  const data = await upstream.json().catch(() => ({}));
  return parseModelJson(String(data?.choices?.[0]?.message?.content || ''), fallback, model);
}

async function fingerprint(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  const ua = request.headers.get('user-agent') || '';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${ip}|${ua.slice(0, 180)}`));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function rateLimit(admin: ReturnType<typeof createClient>, request: Request, kind: string, limit: number) {
  const fp = await fingerprint(request);
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count, error } = await admin.from('public_submission_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('kind', kind)
    .eq('fingerprint', fp)
    .gte('created_at', since);
  if (error || Number(count || 0) >= limit) return false;
  const { error: insertError } = await admin.from('public_submission_attempts').insert({ kind, fingerprint: fp });
  return !insertError;
}

function publicResult(row: Record<string, unknown>) {
  return {
    token: row.public_token,
    company: row.company,
    web: row.score_web,
    comm: row.score_comm,
    comp: row.score_comp,
    overall: row.score_overall,
    confidence: row.score_confidence,
    headline: row.headline,
    summary: row.summary,
    web_insight: row.web_insight,
    comm_insight: row.comm_insight,
    comp_insight: row.comp_insight,
    created_at: row.created_at,
  };
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin') || '';
  if (request.method === 'OPTIONS') {
    return ALLOWED_ORIGINS.has(origin)
      ? new Response(null, { status: 204, headers: cors(origin) })
      : new Response(null, { status: 403, headers: cors(origin) });
  }
  if (request.method !== 'POST') return respond(origin, 405, { ok: false, error: 'Method not allowed.' });
  if (!ALLOWED_ORIGINS.has(origin)) return respond(origin, 403, { ok: false, error: 'Forbidden.' });

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const key = adminKey();
  if (!supabaseUrl || !key) return respond(origin, 500, { ok: false, error: 'Audit service is not configured.' });
  const admin = createClient(supabaseUrl, key, { auth: { persistSession: false } });

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return respond(origin, 400, { ok: false, error: 'Invalid request body.' }); }

  const action = clean(body.action, 40);

  if (action === 'analyse') {
    if (!await rateLimit(admin, request, 'audit_analysis', 4)) {
      return respond(origin, 429, { ok: false, error: 'Analysis limit reached. Please try again later.' });
    }
    const result = await analyse(sanitiseInput(body.payload));
    return respond(origin, 200, { ok: true, result });
  }

  if (action === 'save_result') {
    if (!await rateLimit(admin, request, 'audit_save', 6)) {
      return respond(origin, 429, { ok: false, error: 'Too many save attempts.' });
    }
    const paymentId = clean(body.payment_id, 120);
    if (!paymentId) return respond(origin, 400, { ok: false, error: 'Verified payment ID required.' });

    const { data: paymentOrder, error: paymentError } = await admin.from('payment_orders')
      .select('id,status,product_key,razorpay_payment_id')
      .eq('razorpay_payment_id', paymentId)
      .eq('product_key', 'audit')
      .maybeSingle();
    if (paymentError || !paymentOrder || paymentOrder.status !== 'captured') {
      return respond(origin, 403, { ok: false, error: 'A captured Brand Growth Audit payment is required.' });
    }

    const existing = await admin.from('audit_results').select('*').eq('payment_order_id', paymentOrder.id).maybeSingle();
    if (existing.data) return respond(origin, 200, { ok: true, result: publicResult(existing.data) });

    const input = sanitiseInput(body.payload);
    const scores = await analyse(input);
    const { data: saved, error: saveError } = await admin.from('audit_results').insert({
      payment_order_id: paymentOrder.id,
      company: input.company || null,
      score_web: scores.web,
      score_comm: scores.comm,
      score_comp: scores.comp,
      score_overall: scores.overall,
      score_confidence: scores.confidence,
      headline: scores.headline,
      summary: scores.summary,
      web_insight: scores.web_insight,
      comm_insight: scores.comm_insight,
      comp_insight: scores.comp_insight,
      analysis_model: scores.model,
    }).select('*').single();
    if (saveError || !saved) return respond(origin, 500, { ok: false, error: 'Could not save the paid audit result.' });
    return respond(origin, 200, { ok: true, result: publicResult(saved) });
  }

  if (action === 'get_result') {
    const token = clean(body.token, 80);
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) {
      return respond(origin, 400, { ok: false, error: 'Invalid result token.' });
    }
    const { data, error } = await admin.from('audit_results').select('*').eq('public_token', token).maybeSingle();
    if (error || !data) return respond(origin, 404, { ok: false, error: 'Audit result not found.' });
    return respond(origin, 200, { ok: true, result: publicResult(data) });
  }

  return respond(origin, 400, { ok: false, error: 'Unsupported audit action.' });
});
