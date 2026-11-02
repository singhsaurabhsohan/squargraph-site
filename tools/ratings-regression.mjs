import assert from 'node:assert/strict';
import { trustpilotRating, ratingsResponse } from '../workers/site-ratings.js';
const profile = (count, score, domain = 'squargraph.com') => ({ name: { identifying: domain }, numberOfReviews: { total: count }, score: { trustScore: score } });
for (const data of [null, {}, profile(0, 5), profile(1, null), profile(1, 6), profile(1, NaN), profile(1, '5'), profile(1.5, 4), profile(1, 4, 'other.com')]) assert.equal(trustpilotRating(data), null);
assert.deepEqual(trustpilotRating(profile(1, 3.2)), { provider: 'trustpilot', score: 3.2, count: 1 });
const request = new Request('https://squargraph.com/api/ratings');
let called = false;
assert.deepEqual(await (await ratingsResponse(request, {}, () => { called = true; })).json(), { ratings: [] });
assert.equal(called, false);
const env = { TRUSTPILOT_API_KEY: 'test-only-key' };
const result = await ratingsResponse(request, env, async (url, options) => {
  assert.equal(url, 'https://api.trustpilot.com/v1/business-units/find?name=squargraph.com');
  assert.equal(options.headers.apikey, env.TRUSTPILOT_API_KEY);
  return Response.json(profile(12, 4.7));
});
assert.deepEqual(await result.json(), { ratings: [{ provider: 'trustpilot', count: 12, score: 4.7 }] });
for (const fetcher of [async () => { throw Error('offline'); }, async () => new Response('', { status: 401 }), async () => Response.json(profile(0, 5))]) assert.deepEqual(await (await ratingsResponse(request, env, fetcher)).json(), { ratings: [] });
assert.equal((await ratingsResponse(new Request(request.url, { method: 'POST' }), env)).status, 405);
console.log('Ratings passed: zero/missing/invalid scores hidden, correct business identity, live scores, missing credentials and upstream failure.');
