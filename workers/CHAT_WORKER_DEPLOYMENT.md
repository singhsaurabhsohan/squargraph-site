# SQUARGRAPH Chat Worker

The production website calls:

`https://squargraph-chat.singhsaurabhsohan.workers.dev`

## Update The Existing Worker

1. Open the existing `squargraph-chat` Worker in Cloudflare.
2. Replace its code with `workers/squargraph-chat.js`.
3. Keep the existing `OPENROUTER_API_KEY` secret.
4. Keep the existing `RATE_LIMIT_KV` binding.
5. Deploy the Worker.

Optional Worker variables:

- `OPENROUTER_MODEL`: defaults to `nvidia/nemotron-3-nano-30b-a3b:free`.
- `KNOWLEDGE_URL`: defaults to `https://squargraph.com/ai-context.json`.

## How Context Updates Work

The Worker fetches `https://squargraph.com/ai-context.json` and caches it for five minutes. Update that file whenever public website facts, services, pricing, routes, policies, or founder context change. A Worker redeploy is not required for ordinary knowledge updates.

The Worker returns `context_version` in successful responses so the active knowledge version can be checked during testing.

## Smoke Tests

After deployment, test these questions in the website chat:

- What is SQUARGRAPH™?
- Which engagement is right if I do not know what service I need?
- What does the Brand Growth Audit™ include?
- Tell me about Saurabh Sohan Singh.
- Does SQUARGRAPH have a digital persona called Ananya?
- Did Saurabh direct campaigns for TVF or Mashable India?
- How can a specialist partner with SQUARGRAPH™?

The last two answers must avoid unsupported campaign claims, and the Ananya answer must say it is not part of the current official website context.
