# Content Update Guide

Updated: 2026-07-20

Run `node tools/validate-site.mjs` after every content change.

## 1. Featured Work

Edit `assets/data/work.json`. Set `featured` and `published` to `true`, and use `relationship: "squargraph"` for homepage eligibility.

```json
{
  "id": "unique-slug",
  "title": "Approved project title",
  "client": "Approved public client or SQUARGRAPH™",
  "relationship": "squargraph",
  "category": ["Brand", "Digital"],
  "summary": "One factual sentence.",
  "role": "Exact SQUARGRAPH role.",
  "outputs": ["Output one", "Output two"],
  "outcome": null,
  "image": "/assets/images/work/example.webp",
  "imageAlt": "Descriptive alternative text",
  "featured": true,
  "published": true,
  "url": "/work"
}
```

Homepage previews show up to four featured SQUARGRAPH entries. Never label previous founder work as current SQUARGRAPH work.

## 2. All Work Entries

Use `relationship: "founder-previous-experience"` for work completed before SQUARGRAPH. Leave `outcome` as `null` when no approved result exists. Do not create empty case-study routes.

The static fallback is generated from `tools/build-destination-pages.mjs`. Update both the JSON and fallback source when changing launch-visible Work content, then run:

```powershell
node tools/build-destination-pages.mjs
```

## 3. Intelligence

Edit `assets/data/intelligence.json`. Keep `published: true`, a valid ISO date, a supported `type`, a concise description field and a live destination. The homepage selects featured/new entries and prefers one Study, Signal and Observation.

## 4. Engagement Prices And Details

Public engagement summaries are generated from `tools/build-destination-pages.mjs`. Full details remain in:

- `discovery.html`
- `audit.html`
- `brand-foundation-sprint.html`
- `websites-digital-experiences.html`
- `growth-partner.html`

Update pricing only when commercially approved. Keep the homepage and `/engagements` summary consistent with the full page.

## 5. Founder Biography

Update the full profile in `saurabh-sohan-singh.html`. Update shorter previews in `index.html` and `tools/build-destination-pages.mjs`. Keep previous employer/client relationships accurately qualified.

## 6. Founder Image

The canonical optimised asset is `saurabh-sohan-singh-founder-squargraph.webp`. Preserve its square crop and circular presentation. Replace the file at the same dimensions, or update every reference and Open Graph context if the filename changes.

## 7. Contact Information

Search for the existing value before editing:

```powershell
rg -n "hello@squargraph.com|saurabh@squargraph.com|85888 97488|918588897488" .
```

Update `components/footer.html.reference`, `assets/js/config.js`, `ai-context.json`, relevant form success/fallback links and policy pages. Run the chrome synchronizer afterward.

## 8. Partners Page

Edit visible copy in `partners/index.html` and behaviour in `assets/js/partners.js`. Do not rename fields or Supabase columns without a backward-compatible migration. Capability deck files are stored through the existing Storage flow.

## 9. Navigation

Edit `components/navigation.html.reference`, then run:

```powershell
node tools/sync-site-chrome.mjs
```

Keep the six-link order documented in `SITE_ARCHITECTURE.md`.

## 10. Footer

Edit `components/footer.html.reference`, run the synchronizer, and inspect desktop and mobile policy-page footers.

## 11. Metadata

Every public page needs a unique title, description, canonical, Open Graph and Twitter metadata. For generated pages, edit `tools/build-destination-pages.mjs` and rebuild. Do not add meta keywords.

## 12. Sitemap Dates

Edit `sitemap.xml` only after a meaningful page update. Use `YYYY-MM-DD` and the real implementation date. Do not use future dates.

## 13. Open Graph Images

Use a truthful 1200 x 630 WebP or PNG. The shared fallback is `/squargraph-brand-image.webp`. A page-specific image must represent the actual page and remain readable at social-preview sizes.

## 14. Careers

Edit `assets/data/careers.json`, then run:

```powershell
node tools/render-careers.mjs
```

Each published role needs a unique `id`, title, discipline, location, working model, engagement type, experience range, summary and valid status. Use `open`, `reviewing`, `paused` or `closed`. Open and reviewing roles render first; closed roles do not render. Set `featured: true` only for an approved priority role.

To pause a role, set `status` to `paused`. To close it, set `status` to `closed`. To change order within the same status, update `featured` or `postedDate`. Do not publish a fake role, leave expired dates live or describe commission-based, project-based, internship or contract work as salaried employment.

Workplace policy currently reads `Hybrid` with `Flexible` time on-site. Update the Careers page and role records together when that policy changes. Edit FAQs and page copy in `careers/index.html`, form behaviour in `assets/js/careers.js`, metadata in the page head, and database/storage definitions in `supabase/careers_applications.sql` only through backward-compatible changes.

Application statuses are internal: `New`, `Reviewing`, `Shortlisted`, `Interview`, `Hold`, `Rejected` and `Hired`. See `CAREERS_OPERATIONS.md` for review and privacy procedures.

## Release Checklist

```powershell
node tools/build-destination-pages.mjs
node tools/sync-site-chrome.mjs
node tools/render-careers.mjs
node tools/validate-site.mjs
git diff --check
```

Then review changed routes locally at `http://127.0.0.1:4188/`.
