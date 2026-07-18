# Site Architecture

Updated: 2026-07-18

## Page Map

| Route | Purpose | Primary CTA | Content owner | Data source | Related pages |
| --- | --- | --- | --- | --- | --- |
| `/` | Position SQUARGRAPH and route qualified visitors | Start a Project | Founder | `index.html`, `work.json`, `intelligence.json` | All primary destinations |
| `/work` | Prove capability with transparent attribution | Start a Project | Founder | `assets/data/work.json` | Capabilities, Founder |
| `/capabilities` | Explain what SQUARGRAPH can own | Start a Project | Founder | Rendered HTML | Work, Engagements |
| `/engagements` | Help visitors choose an entry point | Start a Project | Founder | Rendered HTML | Five engagement pages |
| `/intelligence` | Publish studies, signals and observations | Explore Intelligence | Founder/editor | `assets/data/intelligence.json` | Capabilities, Engagements |
| `/studio` | Explain philosophy, method, founder and ecosystem | Start a Project | Founder | Rendered HTML | Founder, Partners, AI Disclosure |
| `/project-direction` | Map unclear requirements into a guided capability direction | Submit My Requirement | Founder/operations | Inline maps plus Supabase | Capabilities, Engagements |
| `/discovery` | Book a focused strategic session | Book Discovery | Founder/operations | Rendered HTML plus Supabase | Engagements |
| `/audit` | Complete the Brand Growth Audit | Start Audit | Founder/operations | Rendered HTML plus Supabase/payment | Engagements |
| `/brand-foundation-sprint` | Capture a foundation sprint brief | Submit Brief | Founder/operations | Rendered HTML plus Supabase | Engagements, Capabilities |
| `/websites-digital-experiences` | Capture a digital experience brief | Submit Brief | Founder/operations | Rendered HTML plus Supabase | Engagements, Capabilities |
| `/growth-partner` | Explain the ongoing integrated partnership | Apply | Founder/operations | Rendered HTML plus Supabase | Engagements, Capabilities |
| `/partners` | Recruit capability and delivery partners | Submit Application | Founder/operations | Rendered HTML plus Supabase Storage | Studio, Growth Ecosystem |
| `/saurabh-sohan-singh` | Hold the full founder profile | Start a Project | Founder | Rendered HTML | Studio, Work |
| `/blog` and `/blog/*` | Long-form editorial content | Explore Intelligence | Founder/editor | Rendered HTML | Intelligence |
| Policy routes | Explain legal, AI and refund terms | Contextual only | Founder/legal reviewer | Rendered HTML | Footer |

## Navigation

The canonical desktop and mobile order is:

1. Work
2. Capabilities
3. Engagements
4. Intelligence
5. Studio
6. Start a Project

Reference markup lives in `components/navigation.html.reference`. Public pages keep rendered navigation in HTML. Run `node tools/sync-site-chrome.mjs` after changing the reference.

Project Direction intentionally uses a focused header and no full footer because it is a dedicated acquisition flow.

## Footer

The canonical footer has Studio, Engage, Ecosystem and Legal columns plus brand, social, contact and trust information. Its source is `components/footer.html.reference`.

## Content Boundaries

- Homepage: preview and route, never reproduce destination-page depth.
- Work: all proof and relationship disclosure.
- Capabilities: capability ownership and connected delivery model.
- Engagements: buying paths and verified public pricing/timelines.
- Studio: philosophy, operating approach and ecosystem logic.
- Founder: full biography and previous professional context.
- Intelligence: repeatable editorial publishing.

## Update Rules

- Add repeatable Work and Intelligence content through their JSON files.
- Edit structural destination copy in `tools/build-destination-pages.mjs`, then rebuild.
- Do not edit generated destination pages without also updating the generator.
- Preserve route names and form contracts unless a documented business or technical requirement demands change.
- Use only approved client names, metrics, testimonials, outcomes and logos.
