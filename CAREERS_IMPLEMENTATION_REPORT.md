# SQUARGRAPH Careers Implementation Report

Date: 20 July 2026

## 1. Executive summary

A production-ready Careers system now exists at `/careers`. It is truthful about the studio's current scale, supports future role publishing from structured data, captures general applications through the existing SQUARGRAPH form and OTP patterns, and introduces no new analytics or application libraries.

## 2. Exact page structure

1. Hero
2. What We Are Building
3. Who Thrives Here
4. How We Work
5. Opportunities
6. Hiring Process
7. Introduce Yourself
8. Frequently Asked Questions
9. Final CTA
10. Shared footer

## 3. Created files

- `careers/index.html`
- `assets/css/pages/careers.css`
- `assets/data/careers.json`
- `assets/js/careers.js`
- `tools/render-careers.mjs`
- `supabase/careers_applications.sql`
- `CAREERS_OPERATIONS.md`
- `CAREERS_IMPLEMENTATION_REPORT.md`

## 4. Modified files

Core references and documentation:

- `components/footer.html.reference`
- `tools/sync-site-chrome.mjs`
- `SITE_ARCHITECTURE.md`
- `CONTENT_UPDATE_GUIDE.md`
- `DESIGN_GUARDRAILS.md`
- `ANALYTICS_EVENT_MAP.md`
- `ai-context.json`
- `_redirects`
- `sitemap.xml`

Page-level changes:

- `404.html`
- `ai-disclosure.html`
- `audit-results.html`
- `audit.html`
- `blog.html`
- `blog/why-execution-matters.html`
- `brand-foundation-sprint.html`
- `capabilities/index.html`
- `creative-agency-delhi.html`
- `discovery.html`
- `engagements/index.html`
- `feedback.html`
- `growth-partner.html`
- `index.html`
- `intelligence.html`
- `partners/index.html`
- `privacy-policy.html`
- `project-direction/index.html`
- `refund-policy.html`
- `saurabh-sohan-singh.html`
- `sitemap/index.html`
- `studio/index.html`
- `terms-of-use.html`
- `websites-digital-experiences.html`
- `work/index.html`

The page-level changes outside `careers/index.html`, `studio/index.html`, and `sitemap/index.html` are shared-footer synchronisation only.

## 5. Careers JSON schema

`assets/data/careers.json` contains a top-level `roles` array. Supported role fields are `id`, `slug`, `title`, `category`, `location`, `workingModel`, `engagementType`, `status`, `summary`, `description`, `published`, `featured`, `publishedAt`, `closingDate`, `applyUrl`, and optional `detailsUrl`. The renderer validates required fields and accepted status, model, and engagement values before writing markup.

## 6. Current role inventory

There are zero approved published roles. The page shows an explicit no-current-openings state, an associate and internship availability note, and the general introduction form. No position, compensation, benefit, team size, or hiring urgency has been invented.

## 7. Form details

The application captures full name, verified email, WhatsApp or phone, country, city, primary discipline, experience level, LinkedIn URL, portfolio URL, opportunity type, working model, introduction, optional CV, consent, and reCAPTCHA. Email OTP is automatic and inline through the existing Supabase OTP system. The optional CV accepts PDF, DOC, and DOCX files up to 5 MB. Errors are inline, focus moves to the first invalid field, and a visible WhatsApp fallback is shown on submission failure.

## 8. Migration

`supabase/careers_applications.sql` creates the isolated `careers_applications` table, restrictive row-level security policies, and the private `careers-cvs` storage bucket. It does not alter, drop, truncate, or rewrite existing lead data. The migration has not been executed automatically and requires an authorised production database review before use.

## 9. Analytics

The existing data layer now uses: `careers_page_view`, `careers_view_opportunities`, `careers_role_click`, `careers_apply_click`, `careers_introduce_yourself_start`, `careers_application_submit`, `careers_application_error`, `careers_partner_redirect`, `careers_linkedin_click`, and `careers_portfolio_click`. Events contain interaction context only and exclude personal data.

## 10. Accessibility

The page has one H1, semantic sections, labels for every form control, keyboard-operable native FAQ disclosures, visible focus states, logical heading order, live status messaging, descriptive links, responsive reflow, and no horizontal overflow at the tested widths.

## 11. SEO

The canonical URL is `https://squargraph.com/careers`. Metadata includes a unique title, description, Open Graph and Twitter tags using a current versioned 1200 by 630 image, and CollectionPage plus BreadcrumbList structured data. No JobPosting schema is emitted because no approved role exists. Careers is included in the XML and human-readable sitemaps.

## 12. Privacy and consent

The form states how application information is used and links to the site's Privacy Policy and Terms of Use. Application data is separate from marketing consent. CV storage is private and exposed only through a time-limited signed URL. A recommended 12-month retention period is documented for founder and legal approval.

## 13. Workplace policy

The page describes SQUARGRAPH as founder-led and selective without presenting an invented office, employee count, benefits programme, or permanent hiring cadence. Remote, hybrid, and on-site preferences are captured as applicant preferences rather than guaranteed arrangements.

## 14. Partner cross-link

People seeking project, commission, referral, or specialist collaboration can move from Careers to `/partners`. The redirect is contextual, tracked with `careers_partner_redirect`, and does not blur employment and partnership applications.

## 15. QA

Automated validation passed for HTML structure, final architecture, shared footers, blog covers, Gumlet poster assets, form integration contracts, social metadata, JavaScript syntax, JSON parsing, and whitespace errors. Responsive browser QA passed at 320, 360, 390, 768, 1024, 1280, 1440, and 1920 pixels. Form validation, country-to-city behaviour, FAQ interaction, CTA analytics hooks, OTP container state, reCAPTCHA order, and compact submit sizing were checked.

## 16. Performance

The page introduces no hero media or third-party image request. Careers CSS and JavaScript are page-scoped, reCAPTCHA remains lazy-loaded, the role inventory is rendered to static HTML for crawlability, and no new runtime framework or analytics library was added.

## 17. Known limitations

- A production CV upload requires the reviewed Supabase migration.
- Without the new table, applications without a CV can use the existing lead fallback; applications with a CV fail safely rather than exposing a private storage path.
- No live submission was made during QA to avoid creating production test data.
- Individual role detail pages are intentionally absent until approved roles exist.

## 18. Content requiring founder approval

- The first role inventory and every future published role
- Compensation or commercial terms
- Any internship terms, particularly if unpaid
- The final application retention period
- Any workplace-location promise or employee benefit claim
- Production execution of the Supabase migration

## 19. Deployment steps

1. Review and run `supabase/careers_applications.sql` in the authorised Supabase project.
2. Publish the repository commit through the existing production deployment pipeline.
3. Open `/careers`, submit one controlled test application, and confirm the database row, OTP, CAPTCHA, analytics events, and optional CV signed link.
4. Remove the controlled test record and file after verification.
5. Submit the refreshed sitemap in Google Search Console if the deployment platform does not notify search engines automatically.

## 20. Rollback steps

Revert the Careers implementation commit to remove the route, footer link, sitemap entries, renderer, scripts, styles, and documentation. If the Supabase migration has been run, export application data before using the separately documented rollback statements in the SQL file. Never remove the database table or storage bucket while retained applicant data still exists.
