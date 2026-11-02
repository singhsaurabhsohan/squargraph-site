function validatorMatches(value, headers) {
  if (!value) return true;
  if (value.startsWith('"')) return value === headers.get('etag');
  if (value.startsWith('W/')) return false;
  const requested = Date.parse(value), modified = Date.parse(headers.get('last-modified') || '');
  return Number.isFinite(requested) && Number.isFinite(modified) && modified <= requested;
}

/** Safari probes MP4s with bytes=0-1; Workers Static Assets otherwise returns 200. */
export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (!path.startsWith('/assets/videos/') || !path.endsWith('.mp4') || !['GET', 'HEAD'].includes(request.method)) return env.ASSETS.fetch(request);
    const range = request.headers.get('range');
    const forwarded = new Headers(request.headers);
    forwarded.delete('range');
    forwarded.delete('if-range');
    const full = await env.ASSETS.fetch(new Request(request.url, { method: 'GET', headers: forwarded }));
    if (full.status !== 200) return full;
    const headers = new Headers(full.headers);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Type', 'video/mp4');
    if (request.method === 'HEAD') return new Response(null, { status: 200, headers });
    if (!range || !validatorMatches(request.headers.get('if-range'), headers)) return new Response(full.body, { status: 200, headers });
    const bytes = await full.arrayBuffer();
    const total = bytes.byteLength;
    const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    let start = NaN, end = NaN;
    if (match && (match[1] || match[2])) {
      if (!match[1]) { const suffix = Number(match[2]); if (Number.isSafeInteger(suffix) && suffix > 0) { start = Math.max(0, total - suffix); end = total - 1; } }
      else { start = Number(match[1]); end = match[2] ? Math.min(Number(match[2]), total - 1) : total - 1; }
    }
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= total || end < start) {
      headers.set('Content-Range', 'bytes */' + total);
      headers.set('Content-Length', '0');
      return new Response(null, { status: 416, headers });
    }
    headers.set('Content-Range', 'bytes ' + start + '-' + end + '/' + total);
    headers.set('Content-Length', String(end - start + 1));
    return new Response(bytes.slice(start, end + 1), { status: 206, headers });
  }
};
