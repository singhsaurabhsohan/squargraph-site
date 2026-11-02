// Only verified, non-empty scores from the official API may reach the page.
export function trustpilotRating(data) {
  const count = data?.numberOfReviews?.total;
  const score = data?.score?.trustScore;
  if (data?.name?.identifying !== 'squargraph.com' || !Number.isSafeInteger(count) || count < 1 || typeof score !== 'number' || !Number.isFinite(score) || score <= 0 || score > 5) return null;
  return { provider: 'trustpilot', score, count };
}

export async function ratingsResponse(request, env, fetcher = fetch) {
  if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
  const ratings = [];
  if (env.TRUSTPILOT_API_KEY) {
    try {
      const response = await fetcher('https://api.trustpilot.com/v1/business-units/find?name=squargraph.com', {
        headers: { apikey: env.TRUSTPILOT_API_KEY, Accept: 'application/json' },
        signal: AbortSignal.timeout(5000),
        cf: { cacheTtl: 3600, cacheEverything: true }
      });
      if (response.ok) {
        const rating = trustpilotRating(await response.json());
        if (rating) ratings.push(rating);
      }
    } catch { /* Unavailable data stays invisible; never invent a fallback score. */ }
  }
  return new Response(request.method === 'HEAD' ? null : JSON.stringify({ ratings }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=300, s-maxage=3600', 'X-Content-Type-Options': 'nosniff' }
  });
}
