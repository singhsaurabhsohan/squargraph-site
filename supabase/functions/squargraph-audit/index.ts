import { createClient } from 'npm:@supabase/supabase-js@2.116.0';

const ALLOWED_ORIGINS = new Set([
  'https://squargraph.com',
  'https://www.squargraph.com',
  'http://127.0.0.1:4177',
  'http://localhost:4177',
]);

const DEFAULT_NVIDIA_MODEL = 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free';
const LEGACY_NVIDIA_MODEL = 'nvidia/nemotron-3-nano-30b-a3b:free';

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
    headers: {
      ...cors(origin),
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
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
  const input = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};

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
  const socialCount = [
    input.instagram,
    input.facebook,
    input.linkedin,
    input.youtube,
    input.twitter,
  ].filter(Boolean).length;

  const competitorCount = [
    input.competitor1,
    input.competitor2,
    input.competitor3,
  ].filter(Boolean).length;

  const web = input.website ? 58 : 44;
  const comm = Math.min(78, 34 + socialCount * 9);
  const comp = competitorCount >= 2 ? 58 : competitorCount === 1 ? 52 : 46;
  const overall = Math.round(web * 0.4 + comm * 0.3 + comp * 0.3);
  const confidence = Math.min(
    78,
    48 + socialCount * 4 + competitorCount * 5 + (input.website ? 5 : 0),
  );

  return {
    web,
    comm,
    comp,
    overall,
    confidence,
    headline: 'Preliminary brand signals identified',
    summary: `${input.company || 'Your brand'} has enough submitted information for a preliminary directional assessment. The strongest next step is to validate the digital, communication and competitive signals with deeper evidence before making high-stakes decisions.`,
    web_insight: input.website
      ? 'A website was supplied, giving the complete audit a clear digital property to review.'
      : 'No website was supplied, which limits the confidence of the digital assessment.',
    comm_insight: `${socialCount} public communication channel${socialCount === 1 ? '' : 's'} were supplied for the complete audit.`,
    comp_insight: competitorCount >= 2
      ? 'The submitted competitive set is sufficient for a directional benchmark.'
      : 'Competitive confidence is limited because fewer than two competitors were supplied.',
    model: 'deterministic-fallback-v2',
  };
}

function scoreFromObject(
  parsed: Record<string, unknown>,
  fallback: AuditScores,
  model: string,
): AuditScores | null {
  const requiredText = [
    'headline',
    'summary',
    'web_insight',
    'comm_insight',
    'comp_insight',
  ];

  if (!requiredText.some((key) => clean(parsed[key], 100))) return null;

  const web = clamp(parsed.web, fallback.web);
  const comm = clamp(parsed.comm, fallback.comm);
  const comp = clamp(parsed.comp, fallback.comp);

  return {
    web,
    comm,
    comp,
    overall: clamp(
      parsed.overall,
      Math.round(web * 0.4 + comm * 0.3 + comp * 0.3),
    ),
    confidence: clamp(parsed.confidence, fallback.confidence),
    headline: clean(parsed.headline, 100) || fallback.headline,
    summary: clean(parsed.summary, 900) || fallback.summary,
    web_insight: clean(parsed.web_insight, 350) || fallback.web_insight,
    comm_insight: clean(parsed.comm_insight, 350) || fallback.comm_insight,
    comp_insight: clean(parsed.comp_insight, 350) || fallback.comp_insight,
    model,
  };
}

function parseJsonText(raw: string): Record<string, unknown> | null {
  const cleanRaw = raw
    .replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '')
    .replace(/```(?:json)?|```/gi, '')
    .trim();

  const candidates = [cleanRaw, cleanRaw.match(/\{[\s\S]*\}/)?.[0] || ''].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      // Try the next representation.
    }
  }

  return null;
}

function auditTool() {
  return {
    type: 'function',
    function: {
      name: 'submit_brand_audit',
      description: 'Return the preliminary SQUARGRAPH brand audit assessment.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        properties: {
          web: { type: 'integer', minimum: 0, maximum: 100 },
          comm: { type: 'integer', minimum: 0, maximum: 100 },
          comp: { type: 'integer', minimum: 0, maximum: 100 },
          overall: { type: 'integer', minimum: 0, maximum: 100 },
          confidence: { type: 'integer', minimum: 0, maximum: 100 },
          headline: { type: 'string' },
          summary: { type: 'string' },
          web_insight: { type: 'string' },
          comm_insight: { type: 'string' },
          comp_insight: { type: 'string' },
        },
        required: [
          'web',
          'comm',
          'comp',
          'overall',
          'confidence',
          'headline',
          'summary',
          'web_insight',
          'comm_insight',
          'comp_insight',
        ],
      },
    },
  };
}

function configuredModels() {
  const configured = clean(Deno.env.get('OPENROUTER_AUDIT_MODEL'), 180);
  const candidates: string[] = [];

  // The older Nano free route was scheduled for retirement. If it is still
  // configured in Supabase, prefer the current NVIDIA free route first.
  if (configured === LEGACY_NVIDIA_MODEL) {
    candidates.push(DEFAULT_NVIDIA_MODEL, configured);
  } else {
    if (configured) candidates.push(configured);
    candidates.push(DEFAULT_NVIDIA_MODEL);
  }

  return [...new Set(candidates.filter(Boolean))];
}

async function callModel(
  apiKey: string,
  model: string,
  prompt: string,
  fallback: AuditScores,
): Promise<AuditScores | null> {
  let upstream: Response;

  try {
    upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
          {
            role: 'system',
            content: 'You are a conservative brand strategist. Never invent evidence. Use the submit_brand_audit tool for the final answer.',
          },
          { role: 'user', content: prompt },
        ],
        tools: [auditTool()],
        tool_choice: {
          type: 'function',
          function: { name: 'submit_brand_audit' },
        },
        temperature: 0.15,
        max_tokens: 1100,
      }),
    });
  } catch (error) {
    console.warn('audit_ai_network_error', {
      model,
      message: error instanceof Error ? error.message.slice(0, 160) : 'unknown',
    });
    return null;
  }

  if (!upstream.ok) {
    const errorBody = await upstream.text().catch(() => '');
    console.warn('audit_ai_upstream_error', {
      model,
      status: upstream.status,
      detail: clean(errorBody, 240),
    });
    return null;
  }

  const data = await upstream.json().catch(() => null);
  const message = data?.choices?.[0]?.message;

  if (!message) {
    console.warn('audit_ai_empty_response', { model });
    return null;
  }

  const toolCalls = Array.isArray(message.tool_calls) ? message.tool_calls : [];
  for (const call of toolCalls) {
    const args = call?.function?.arguments;
    const parsed = typeof args === 'string'
      ? parseJsonText(args)
      : args && typeof args === 'object' && !Array.isArray(args)
        ? args as Record<string, unknown>
        : null;

    if (parsed) {
      const result = scoreFromObject(parsed, fallback, model);
      if (result) return result;
    }
  }

  const content = typeof message.content === 'string' ? message.content : '';
  const parsedContent = parseJsonText(content);
  if (parsedContent) {
    const result = scoreFromObject(parsedContent, fallback, model);
    if (result) return result;
  }

  console.warn('audit_ai_parse_error', { model });
  return null;
}

async function analyse(input: AuditInput): Promise<AuditScores> {
  const fallback = fallbackScores(input);
  const apiKey = clean(Deno.env.get('OPENROUTER_API_KEY'), 500);
  if (!apiKey) return fallback;

  const prompt = `Produce a conservative preliminary Brand Growth Audit for SQUARGRAPH™ using only the submitted information below.

BRAND
Company: ${input.company || 'Unknown'}
Industry: ${input.industry || 'Not provided'}
Description: ${input.brand_description || 'Not provided'}
Website URL supplied: ${input.website || 'Not provided'}

PUBLIC COMMUNICATION URLS SUPPLIED
Instagram: ${input.instagram || 'Not provided'}
Facebook: ${input.facebook || 'Not provided'}
LinkedIn: ${input.linkedin || 'Not provided'}
YouTube: ${input.youtube || 'Not provided'}
X/Twitter: ${input.twitter || 'Not provided'}

COMPETITORS SUPPLIED
1: ${input.competitor1 || 'Not provided'}
2: ${input.competitor2 || 'Not provided'}
3: ${input.competitor3 || 'Not provided'}

BUSINESS CONTEXT
Challenge: ${input.challenge || 'Not provided'}
Goal: ${input.goal || 'Not provided'}

SCORING RULES
- web: digital readiness signal, weighted 40% in overall
- comm: communication readiness signal, weighted 30%
- comp: competitive-readiness signal, weighted 30%
- confidence must fall when evidence is sparse
- do not claim to have opened, crawled or inspected any supplied URL
- do not infer website quality, social performance, engagement, market share or competitor facts from a URL alone
- distinguish between a URL being supplied and its actual quality being verified
- summary should be 2 to 4 concise, useful sentences
- each insight should state one evidence-based implication and one practical next focus

Use the submit_brand_audit tool to return the final assessment.`;

  for (const model of configuredModels()) {
    const result = await callModel(apiKey, model, prompt, fallback);
    if (result) return result;
  }

  return fallback;
}

async function fingerprint(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  const ua = request.headers.get('user-agent') || '';
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${ip}|${ua.slice(0, 180)}`),
  );

  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function rateLimit(
  admin: ReturnType<typeof createClient>,
  request: Request,
  kind: string,
  limit: number,
) {
  const fp = await fingerprint(request);
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();

  const { count, error } = await admin
    .from('public_submission_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('kind', kind)
    .eq('fingerprint', fp)
    .gte('created_at', since);

  if (error || Number(count || 0) >= limit) return false;

  const { error: insertError } = await admin
    .from('public_submission_attempts')
    .insert({ kind, fingerprint: fp });

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

  if (request.method !== 'POST') {
    return respond(origin, 405, { ok: false, error: 'Method not allowed.' });
  }

  if (!ALLOWED_ORIGINS.has(origin)) {
    return respond(origin, 403, { ok: false, error: 'Forbidden.' });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const key = adminKey();
  if (!supabaseUrl || !key) {
    return respond(origin, 500, { ok: false, error: 'Audit service is not configured.' });
  }

  const admin = createClient(supabaseUrl, key, {
    auth: { persistSession: false },
  });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return respond(origin, 400, { ok: false, error: 'Invalid request body.' });
  }

  const action = clean(body.action, 40);

  if (action === 'analyse') {
    if (!await rateLimit(admin, request, 'audit_analysis', 4)) {
      return respond(origin, 429, {
        ok: false,
        error: 'Analysis limit reached. Please try again later.',
      });
    }

    const result = await analyse(sanitiseInput(body.payload));
    return respond(origin, 200, { ok: true, result });
  }

  if (action === 'save_result') {
    if (!await rateLimit(admin, request, 'audit_save', 6)) {
      return respond(origin, 429, { ok: false, error: 'Too many save attempts.' });
    }

    const paymentId = clean(body.payment_id, 120);
    if (!paymentId) {
      return respond(origin, 400, { ok: false, error: 'Verified payment ID required.' });
    }

    const { data: paymentOrder, error: paymentError } = await admin
      .from('payment_orders')
      .select('id,status,product_key,razorpay_payment_id')
      .eq('razorpay_payment_id', paymentId)
      .eq('product_key', 'audit')
      .maybeSingle();

    if (paymentError || !paymentOrder || paymentOrder.status !== 'captured') {
      return respond(origin, 403, {
        ok: false,
        error: 'A captured Brand Growth Audit payment is required.',
      });
    }

    const existing = await admin
      .from('audit_results')
      .select('*')
      .eq('payment_order_id', paymentOrder.id)
      .maybeSingle();

    if (existing.data) {
      return respond(origin, 200, { ok: true, result: publicResult(existing.data) });
    }

    const input = sanitiseInput(body.payload);
    const scores = await analyse(input);

    const { data: saved, error: saveError } = await admin
      .from('audit_results')
      .insert({
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
      })
      .select('*')
      .single();

    if (saveError || !saved) {
      return respond(origin, 500, {
        ok: false,
        error: 'Could not save the paid audit result.',
      });
    }

    return respond(origin, 200, { ok: true, result: publicResult(saved) });
  }

  if (action === 'get_result') {
    const token = clean(body.token, 80);
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) {
      return respond(origin, 400, { ok: false, error: 'Invalid result token.' });
    }

    const { data, error } = await admin
      .from('audit_results')
      .select('*')
      .eq('public_token', token)
      .maybeSingle();

    if (error || !data) {
      return respond(origin, 404, { ok: false, error: 'Audit result not found.' });
    }

    return respond(origin, 200, { ok: true, result: publicResult(data) });
  }

  return respond(origin, 400, { ok: false, error: 'Unsupported audit action.' });
});
