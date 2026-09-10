# Hardening status

Prepared on 10 September 2026.

## Completed in code

- Hardened public lead and feedback gateway
- Server-side Razorpay order creation and signature/payment verification
- Captured-payment requirement before fulfilment
- Signed Razorpay webhook reconciliation
- Private payment order and rate-limit tables
- Granular Growth OS RLS and active-membership enforcement
- Private Brand Growth Audit result storage
- Server-side Audit analysis and paid-result retrieval
- Audit Results page migrated away from legacy Audit Workers
- Accessibility improvements for dialogs and navigation interactions
- Security regression scanner and GitHub Actions quality gate
- Production deployment/security runbook

## Completed in production Supabase

- Core hardening migration applied
- Audit results migration applied
- Required Razorpay, reCAPTCHA, and OpenRouter secrets configured
- `public-form-submit` active with JWT gateway verification disabled
- `squargraph-payments` active with JWT gateway verification disabled
- `squargraph-payment-webhook` active with JWT gateway verification disabled
- `squargraph-audit` active with JWT gateway verification disabled
- Razorpay webhook configured for the production Supabase endpoint

## Intentionally pending

- Merge/deploy hardened website branch only after CI is green
- Run production smoke tests
- Apply `supabase/lock_public_form_tables.sql` only after public form smoke tests pass
- Review Supabase security/performance advisors after final deployment
