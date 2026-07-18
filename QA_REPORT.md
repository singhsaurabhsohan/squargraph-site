# QA Report

Date: 2026-07-18

| Test | Page | Viewport | Result | Issue | Severity | Resolution | Remaining action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Static validation | 24 HTML files | N/A | Pass | None | None | Titles, metadata, canonicals, JSON-LD, alt text, links, assets, chrome and sitemap validated | None |
| Form contract comparison | 9 integration pages | N/A | Pass | None | None | Form ids and field names match backup branch | None |
| Homepage responsive sweep | `/` | 320, 360, 390, 768, 1024, 1280, 1440, 1920 | Pass | Mobile hero had forced empty height | Medium | Mobile min-height changed to content height | None |
| Heading and CTA fit | `/` | All required widths | Pass | None | None | One H1; headline and CTAs fit containers | None |
| Destination routes | Four new pages | 390 and 1440 | Pass | None | None | No horizontal overflow; active nav and five-column footer verified | None |
| High-risk legacy routes | Project Direction, Audit, Discovery, Partners, policy, 404 | 390 and 1440 | Pass | Legacy nav comments prevented sync | Medium | Chrome synchronizer now accepts intervening comments | None |
| Mobile menu | `/work` | 390 x 844 | Pass | Initial screen-reader hidden state missing | Low | Added `aria-hidden`, focus trap, Escape close and focus return | None |
| Work attribution | `/work` | 390 x 844 | Pass | JSON enhancement mixed relationship types | High | Separate current and previous-experience grids | None |
| Work filters | `/work` | 390 x 844 | Pass | None after fix | None | Digital filter shows 3 current entries, hides empty previous section, updates `aria-pressed` and live count | None |
| Capabilities anchors | `/capabilities` | 1440 x 900 | Pass | None | None | All seven anchors and active state verified | None |
| Project Direction steps | `/project-direction` | 390 x 844 | Pass | None | None | Steps 1 to 3, recommendation map and Back navigation exercised | Continue manual live test before major campaign launch |
| Project Direction safeguards | `/project-direction` | Source and DOM | Pass | None | None | Honeypot present; OTP and CAPTCHA-before-submit ordering verified | Live OTP/reCAPTCHA/Supabase write not executed locally |
| Console errors | Tested routes | Mixed | Pass | None | None | No browser console errors recorded | Recheck after production deploy |
| Redirect review | `_redirects` | N/A | Pass | None | None | Four new `.html` aliases and existing acquisition aliases route once to canonicals | Verify with hosting deployment |
| Sitemap/robots | Site-wide | N/A | Pass | None | None | 22 public routes, real date, private audit results blocked | Resubmit sitemap after deploy if needed |
| Security headers | `_headers` | N/A | Pass | None | None | CSP, HSTS, frame, MIME, referrer and permissions policies preserved | Validate production response headers |
| Homepage weight | `/` | N/A | Pass | None | None | HTML reduced by 13,527 bytes; two fewer sections | Run Lighthouse after production cache warms |

## Browser Coverage

Responsive and interaction QA was completed in Chromium through the in-app browser. Firefox and WebKit were not available in the current environment. Layout relies on standard grid, flexbox and static HTML primitives; production cross-browser smoke testing remains recommended.

## External Flow Limits

No OTP was requested, no CAPTCHA was solved, no payment was initiated and no Supabase record was created during QA. Source contracts, field names, payload-facing structures, controls and fallback states were verified. This avoids polluting production data while preserving a clear manual production test requirement.

## Severity Status

No unresolved high-severity issue remains. The truthful Work attribution defect found during QA was fixed and retested.
