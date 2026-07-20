# SQUARGRAPH OS Setup

SQUARGRAPH OS is the private operating workspace at `https://squargraph.com/app/dashboard`.
Growth OS is its first operating module. Public registration is not available.

## 1. Apply the database migration

1. Open the existing SQUARGRAPH Supabase project.
2. Open SQL Editor and create a new query.
3. Paste and run the complete contents of `supabase/growth_os.sql`.

The migration is additive. It preserves all existing Growth OS records and maps legacy
`growth_members` access into the new role and permission model.

## 2. Bootstrap the founder

Confirm `saurabh@squargraph.com` exists in Supabase Authentication, then run:

```sql
insert into public.os_members (user_id, email, role_id, status, joined_at)
select users.id, users.email, roles.id, 'active', now()
from auth.users users
cross join public.os_roles roles
where lower(users.email) = lower('saurabh@squargraph.com')
  and roles.role_key = 'founder'
on conflict (user_id) do update
set role_id = excluded.role_id,
    status = 'active',
    updated_at = now();

insert into public.os_profiles (user_id, full_name, timezone)
select id, 'Saurabh Sohan Singh', 'Asia/Kolkata'
from auth.users
where lower(email) = lower('saurabh@squargraph.com')
on conflict (user_id) do update
set full_name = excluded.full_name,
    timezone = excluded.timezone,
    updated_at = now();
```

This query does not delete or replace website leads, form submissions, audits, partner
applications, career applications, or Growth OS opportunity data.

## 3. Configure Supabase Auth

In Authentication, URL Configuration:

- Site URL: `https://squargraph.com`
- Add redirect URL: `https://squargraph.com/app/**`
- Add redirect URL: `https://squargraph.com/register`
- Add redirect URL: `https://squargraph.com/reset-password`
- For local testing, also allow `http://127.0.0.1:4177/app/**`,
  `http://127.0.0.1:4177/register`, and `http://127.0.0.1:4177/reset-password`.

In Authentication, Providers:

- Keep email/password enabled.
- Keep email confirmation enabled.
- Disable open user sign-up.
- Enable Google only after its OAuth client ID, secret and authorised callback URL are configured.
- Magic-link sign-in uses `shouldCreateUser: false`, so unknown addresses are not created.

Set the invitation email redirect to `https://squargraph.com/register` and the password
recovery redirect to `https://squargraph.com/reset-password`.

## 4. Deploy the invitation function

The browser never receives the Supabase service-role key. Invitations are sent only by the
trusted Edge Function at `supabase/functions/invite-os-user/index.ts`.

With the Supabase CLI connected to the production project, run:

```bash
supabase functions deploy invite-os-user
```

Supabase provides `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY` to deployed Edge Functions. Do not place the service-role key
in `assets/js/config.js`, Cloudflare public assets, Git, or browser code.

## 5. Access and roles

- Super Admin: complete workspace and security access.
- Founder: workspace ownership and complete operating access.
- Director: cross-functional access and user invitations.
- Manager: team and workflow management.
- Associate: day-to-day Growth OS contribution.
- Partner, Client, Guest: limited approved access.

The application checks effective permission keys rather than hard-coded role names. Individual
permission overrides are stored in `os_member_permissions`.

## 6. Security model

- Every `/app` route checks the Supabase session and active `os_members` membership.
- RLS remains the final enforcement boundary even if browser code is bypassed.
- Invitations require the `users.invite` permission and execute server-side.
- Authentication rate limits and refresh-token rotation are managed by Supabase Auth.
- The current static application uses bearer-token sessions managed by Supabase JS. Since it
  does not authenticate with ambient cookies, classical cookie CSRF is not the session model.
- Strict HttpOnly cookie sessions require a future server-rendered auth gateway or BFF at
  `auth.squargraph.com`; the current static build does not claim to provide HttpOnly cookies.
- MFA is intentionally deferred, matching the approved architecture.
- Audit records are append-only to workspace users. Login history is scoped to the user or
  members with `audit.view`.

## 7. Routes

- `/login`
- `/register` for invited users only
- `/forgot-password`
- `/reset-password`
- `/logout`
- `/app/dashboard`
- `/app/opportunities`
- `/app/companies`
- `/app/contacts`
- `/app/outreach`
- `/app/proposals`
- `/app/pipeline`
- `/app/calendar`
- `/app/settings`

The previous `/admin/growth` route permanently redirects to `/app/opportunities`.

## 8. Production check

1. Sign in as the founder with email/password.
2. Sign out and verify magic-link access.
3. Verify password recovery reaches `/reset-password`.
4. Invite a lower-role test user from Settings.
5. Accept the invitation and set a password at `/register`.
6. Confirm the test role cannot perform actions outside its permission set.
7. Confirm unauthenticated visits to every `/app/*` route return to `/login`.
8. Confirm opportunities, proposals, notes and audit events persist after refresh.

