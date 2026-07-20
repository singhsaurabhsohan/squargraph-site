# SQUARGRAPH Growth OS Setup

Growth OS is a private, login-gated business development workspace at:

`https://squargraph.com/admin/growth/`

It is intentionally absent from public navigation, the HTML sitemap and `sitemap.xml`. The route also has browser metadata, crawler rules and response headers that prevent indexing and caching.

## One-time database setup

1. Open the existing SQUARGRAPH Supabase project.
2. Open SQL Editor and create a new query.
3. Paste and run the complete contents of `supabase/growth_os.sql`.
4. In Supabase Authentication, confirm the authorised owner email already exists. Create or invite it there if it does not.
5. Run the following owner bootstrap query:

```sql
insert into public.growth_members (user_id, email, display_name, role)
select id, email, 'Saurabh Sohan Singh', 'owner'
from auth.users
where lower(email) = lower('saurabh@squargraph.com')
on conflict (user_id) do update
set active = true, role = 'owner', updated_at = now();
```

This migration is additive. It does not rename, alter, truncate or delete any existing lead, form, careers, partner or audit data.

## Access model

- `owner`: read and write access; can provision members through SQL.
- `admin`: read and write access.
- `member`: read and write access.
- `viewer`: read-only access.
- unauthenticated users: no database access.
- authenticated users without an active `growth_members` row: no database access.

To add a team member after their Supabase Auth account exists:

```sql
insert into public.growth_members (user_id, email, display_name, role)
select id, email, 'Team Member Name', 'member'
from auth.users
where lower(email) = lower('member@squargraph.com')
on conflict (user_id) do update
set active = true, role = 'member', updated_at = now();
```

To revoke access without deleting history:

```sql
update public.growth_members
set active = false, updated_at = now()
where lower(email) = lower('member@squargraph.com');
```

## Included V1 workflow

- Opportunity capture with source, company, contact and requirement.
- Duplicate checks using source URL and active contact/company combinations.
- Nine-factor qualification with an automatic fit score and priority.
- Full pipeline stages from New to Won, Lost or Dormant.
- Research workspace and working notes.
- LinkedIn comment, direct message and email drafts.
- Manual copy only. No outreach is sent by Growth OS.
- Follow-up date, next action and due-action dashboard.
- Won value, outcome notes and loss reason capture.
- Full activity and pipeline status history.

## Backup and operations

Use Supabase database backups before major policy or schema changes. Do not expose the service-role key in this repository or the browser. Keep role changes and membership provisioning in the Supabase SQL Editor until a later approved admin module is built.

The `growth-os` Storage bucket is private and policy-protected for a later attachment workflow. V1 does not expose upload controls.
