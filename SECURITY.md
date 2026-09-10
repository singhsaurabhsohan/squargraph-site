# Security

## Reporting a vulnerability

Please report security issues privately to `hello@squargraph.com`. Do not include live secrets, payment credentials, customer data, or exploit payloads in public GitHub issues.

## Production security boundaries

- Browser code may contain public Supabase publishable keys and Razorpay Key IDs. Server secrets must never be committed or exposed client-side.
- Public lead and feedback submissions must go through `public-form-submit`, which applies origin checks, rate limiting, reCAPTCHA validation, payload allowlisting, and email verification for leads.
- Razorpay orders are created server-side by `squargraph-payments`. Browser-supplied amounts are not authoritative.
- A payment is treated as successful only after server-side signature/provider verification and captured status confirmation.
- Razorpay asynchronous events are reconciled by the HMAC-authenticated `squargraph-payment-webhook` function.
- Paid Brand Growth Audit results are generated/stored server-side and require a captured Audit payment before persistence.
- Growth OS database and storage access is enforced through RLS and granular permission checks. Active membership is required before explicit permission overrides are considered.

## Deployment

See `docs/PRODUCTION_HARDENING.md` for migration, secret, Edge Function, smoke-test, and final-lockdown order.