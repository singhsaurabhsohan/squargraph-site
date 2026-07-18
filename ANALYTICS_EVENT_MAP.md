# Analytics Event Map

Updated: 2026-07-18

The site uses the existing `dataLayer` and `window.SQ.trackEvent`. No analytics library was added.

| Event | Trigger | Useful parameters |
| --- | --- | --- |
| `cta_start_conversation_click` | Contact/conversation CTA | `link_text`, `link_url`, `page_path` |
| `cta_explore_capabilities_click` | Explore Capabilities CTA | `link_text`, `link_url`, `page_path` |
| `project_direction_start` | Start a Project route click or first Project Direction interaction | `form_id`, `page_path` |
| `project_direction_recommendation_view` | Recommendation step becomes visible | Counts and selected taxonomy only |
| `project_direction_complete` | Successful Project Direction submission | Counts and decision mode only |
| `work_card_click` | Work preview/card or Work destination link | `link_text`, `link_url`, `page_path` |
| `capability_click` | Capability route or section link | `link_text`, `link_url`, `page_path` |
| `engagement_click` | Engagement route or card link | `link_text`, `link_url`, `page_path` |
| `intelligence_article_click` | Intelligence or article link | `link_text`, `link_url`, `page_path` |
| `founder_profile_click` | Founder profile link | `link_text`, `link_url`, `page_path` |
| `discovery_session_click` | Discovery route/book action | `form_id` or link context |
| `audit_start_click` | Audit route/start action | Link context |
| `form_contact_submit` | Successful contact or Project Direction submission | Form id and non-PII taxonomy/context |
| `form_audit_submit` | Audit form submission | Existing audit context only |
| `form_partner_application_submit` | Successful partner application | Capability, collaboration type, store |
| `form_error` | Validation, verification, CAPTCHA or submission failure | `form_id`, `error_type`, optional step |
| `project_direction_otp_request` | Project Direction email OTP request | `method`, resend state/count |
| `project_direction_otp_verify` | Successful Project Direction OTP verification | `method` |
| `whatsapp_click` | WhatsApp route | `source`, `link_url`, `page_path` |
| `email_click` | Mailto route | `link_url`, `page_path` |
| `phone_click` | Telephone route | `link_url`, `page_path` |

Existing engagement-specific success events such as `sprint_brief_submitted`, `web_brief_submitted` and `growth_partner_applied` remain available for backward compatibility.

## Privacy Rules

- Never send names, email addresses, phone numbers, free-text messages, OTPs or uploaded filenames to analytics.
- Use form ids, route paths, approved taxonomy values, counts and non-identifying funnel states.
- GA4/GTM should map event parameters only after confirming they contain no submitted personal data.

## Validation

Use browser developer tools or GTM Preview to confirm events in production. Local QA verifies event wiring but does not submit live forms.
