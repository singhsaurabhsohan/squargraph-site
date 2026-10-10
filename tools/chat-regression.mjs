import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../workers/squargraph-chat.js';

const knowledge = JSON.parse(await readFile(new URL('../ai-context.json', import.meta.url), 'utf8'));
const originalFetch = globalThis.fetch;
const request = (origin = 'https://squargraph.com') => new Request('https://chat.example/', {
  method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [{ role: 'user', content: 'What services do you offer?' }] })
});
const env = {
  OPENROUTER_API_KEY: 'test-only', OPENROUTER_MODEL: 'retired-model:free',
  RATE_LIMIT_KV: { get: async () => null, put: async () => {} }
};
let mode = 'success';
const models = [];
globalThis.fetch = async (url, options) => {
  assert.ok(options.signal, 'All external requests must have a timeout signal');
  if (url.includes('ai-context.json')) return Response.json(knowledge);
  models.push(JSON.parse(options.body).model);
  if (mode === 'unavailable') return Response.json({ error: 'Model retired' }, { status: 404 });
  if (mode === 'abort') throw new DOMException('Timed out', 'AbortError');
  if (mode === 'empty-first' && models.length === 1) return Response.json({ choices: [] });
  return Response.json({ choices: [{ message: { content: 'We can help with brand strategy and creative.' } }] });
};
try {
  let response = await worker.fetch(request(), env);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).reply, 'We can help with brand strategy and creative.');
  assert.equal(models[0], 'openrouter/free');
  for (mode of ['unavailable', 'abort']) {
    response = await worker.fetch(request(), env);
    const data = await response.json();
    assert.equal(response.status, 200);
    assert.equal(data.degraded, true);
    assert.match(data.reply, /SQUARGRAPH/);
    assert.ok(!JSON.stringify(data).includes('test-only'));
  }
  mode = 'empty-first'; models.length = 0;
  response = await worker.fetch(request(), env);
  assert.equal((await response.json()).reply, 'We can help with brand strategy and creative.');
  assert.equal(models.length, 2);
  assert.equal((await worker.fetch(request('https://untrusted.example'), env)).status, 403);
  assert.equal((await worker.fetch(request(), { ...env, RATE_LIMIT_KV: { get: async () => '20' } })).status, 429);
  console.log('Chat regression passed: live reply, retired model, timeout, empty reply, origin restriction, rate limit.');
} finally {
  globalThis.fetch = originalFetch;
}
