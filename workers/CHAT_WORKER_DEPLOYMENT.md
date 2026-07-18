# SQUARGRAPH Chat Worker

The production website calls:

`https://squargraph-chat.singhsaurabhsohan.workers.dev`

## Update The Existing Worker

The repository includes a dedicated Worker configuration that preserves the existing `RATE_LIMIT_KV` binding. The `OPENROUTER_API_KEY` remains an encrypted Cloudflare secret.

```powershell
npx --yes wrangler@latest deploy --config workers/wrangler.chat.jsonc --keep-vars
```

Do not deploy the chat script through the root `wrangler.jsonc`; that file configures static site assets.

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
