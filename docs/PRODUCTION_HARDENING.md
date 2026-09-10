# SQUARGRAPH™ production hardening runbook

This runbook records the safe deployment order for the hardened public forms, payments, Brand Growth Audit, and Growth OS access controls.

## Production project

Supabase project ref: `jzlupkvgizfdwwbofzmu`

## Database migrations

Apply in this order:

1. `supabase/production_hardening.sql`
2. `supabase/audit_results.sql`
3. Deploy and test the website and all Edge Functions
4. Only after public form smoke tests pass, apply `supabase/lock_public_form_tables.sql`

The final lockdown migration removes direct anonymous/authenticated inserts into `leads` and `feedback`, forcing those writes through the hardened Edge Function gateway.

## Required Edge Function secrets

The production project needs these custom secrets:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `RECAPTCHA_SECRET_KEY`
- `OPENROUTER_API_KEY`
- `OPENROUTER_AUDIT_MODEL`

Never commit secret values to GitHub or expose them in browser JavaScript.

## Edge Functions

These functions are intentionally public at the Supabase gateway (`verify_jwt = false`) because they implement their own origin/rate-limit/provider verification logic:

- `public-form-submit`
- `squargraph-payments`
- `squargraph-payment-webhook`
- `squargraph-audit`

`invite-os-user` remains JWT-protected.

## Razorpay webhook

Production webhook target:

`https://jzlupkvgizfdwwbofzmu.supabase.co/functions/v1/squargraph-payment-webhook`

Recommended events for the current handler:

- `payment.captured`
- `payment.failed`
- `order.paid`
- `refund.processed` / `payment.refunded` where available

The webhook secret configured in Razorpay must match `RAZORPAY_WEBHOOK_SECRET` in Supabase.

## Pre-merge checks

Run:

```bash
npm test
```

The GitHub Actions quality gate runs the same static validation/security checks on pull requests.

## Production smoke test order

After the website deployment but before the final public-table lockdown:

1. Submit the homepage/project contact form with a valid reCAPTCHA and verified email flow.
2. Submit the feedback form and confirm the row is stored through `public-form-submit`.
3. Run a Brand Growth Audit preliminary analysis and confirm it uses `squargraph-audit`.
4. In Razorpay test mode or a controlled low-risk production test, confirm order creation, checkout, signature verification, captured status, and `payment_orders` recording.
5. Confirm a paid Audit result is stored in `audit_results` and can be reopened using its public result token.
6. Confirm Growth OS users can only read/edit the resources allowed by their granular permission set.
7. Apply `supabase/lock_public_form_tables.sql` and repeat the public form tests.
8. Review Supabase security and performance advisors.

If any smoke test fails, leave the final lockdown migration unapplied until the gateway path is working.