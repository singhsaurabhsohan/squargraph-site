-- SQUARGRAPH production hardening
-- Apply after deploying public-form-submit and squargraph-payments Edge Functions.
-- This migration is intentionally additive/restrictive and does not delete business data.

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  order_token uuid not null unique default gen_random_uuid(),
  provider_order_id text not null unique,
  razorpay_payment_id text unique,
  razorpay_signature text,
  product_key text not null check (product_key in ('discovery','audit','sprint')),
  product_name text not null,
  amount integer not null check (amount > 0),
  currency text not null default 'INR' check (currency = 'INR'),
  status text not null default 'created' check (status in ('created','verified','captured','failed','refunded')),
  customer_email text,
  customer_name text,
  customer_company text,
  source text,
  provider_payload jsonb not null default '{}'::jsonb,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_orders_created_idx on public.payment_orders (created_at desc);
create index if not exists payment_orders_status_idx on public.payment_orders (status, created_at desc);
alter table public.payment_orders enable row level security;
revoke all on public.payment_orders from anon, authenticated;

create table if not exists public.public_submission_attempts (
  id bigint generated always as identity primary key,
  kind text not null,
  fingerprint text not null,
  created_at timestamptz not null default now()
);
create index if not exists public_submission_attempts_lookup_idx
  on public.public_submission_attempts (kind, fingerprint, created_at desc);
alter table public.public_submission_attempts enable row level security;
revoke all on public.public_submission_attempts from anon, authenticated;

-- Active membership is now a mandatory precondition for every OS permission,
-- including explicit member overrides. This prevents suspended users retaining access.
create or replace function private.os_has_permission(requested_permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when not exists (
      select 1 from public.os_members member
      where member.user_id = (select auth.uid()) and member.status = 'active'
    ) then false
    else coalesce(
      (
        select override.allowed
        from public.os_member_permissions override
        join public.os_permissions permission on permission.id = override.permission_id
        where override.user_id = (select auth.uid())
          and permission.permission_key = requested_permission
        limit 1
      ),
      exists (
        select 1
        from public.os_members member
        join public.os_role_permissions role_permission on role_permission.role_id = member.role_id
        join public.os_permissions permission on permission.id = role_permission.permission_id
        where member.user_id = (select auth.uid())
          and member.status = 'active'
          and permission.permission_key = requested_permission
      ),
      false
    )
  end;
$$;

-- External-facing roles currently have no row-scoped sharing model. Remove broad Growth OS
-- permissions until explicit project/client sharing tables exist. This is safer than exposing
-- the internal pipeline to every client, partner or guest account.
delete from public.os_role_permissions role_permission
using public.os_roles role, public.os_permissions permission
where role_permission.role_id = role.id
  and role_permission.permission_id = permission.id
  and role.role_key in ('partner','client','guest')
  and permission.permission_key in (
    'opportunities.view','opportunities.edit','companies.view','companies.edit',
    'contacts.view','contacts.edit','outreach.view','outreach.edit','outreach.send',
    'proposals.view','proposals.create','proposals.edit','calendar.view','calendar.edit','data.export'
  );

-- Replace legacy broad Growth OS policies with domain-specific permission checks.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'growth_companies','growth_contacts','growth_opportunities','growth_activities',
    'growth_messages','growth_follow_ups','growth_proposals','growth_pipeline_history','growth_attachments'
  ] loop
    execute format('drop policy if exists "Growth members can select" on public.%I', table_name);
    execute format('drop policy if exists "Growth members can insert" on public.%I', table_name);
    execute format('drop policy if exists "Growth members can update" on public.%I', table_name);
  end loop;
end
$$;

create policy "Companies permission can select"
  on public.growth_companies for select to authenticated
  using ((select private.os_has_permission('companies.view')));
create policy "Companies permission can insert"
  on public.growth_companies for insert to authenticated
  with check ((select private.os_has_permission('companies.edit')));
create policy "Companies permission can update"
  on public.growth_companies for update to authenticated
  using ((select private.os_has_permission('companies.edit')))
  with check ((select private.os_has_permission('companies.edit')));

create policy "Contacts permission can select"
  on public.growth_contacts for select to authenticated
  using ((select private.os_has_permission('contacts.view')));
create policy "Contacts permission can insert"
  on public.growth_contacts for insert to authenticated
  with check ((select private.os_has_permission('contacts.edit')));
create policy "Contacts permission can update"
  on public.growth_contacts for update to authenticated
  using ((select private.os_has_permission('contacts.edit')))
  with check ((select private.os_has_permission('contacts.edit')));

create policy "Opportunities permission can select"
  on public.growth_opportunities for select to authenticated
  using ((select private.os_has_permission('opportunities.view')));
create policy "Opportunities permission can insert"
  on public.growth_opportunities for insert to authenticated
  with check ((select private.os_has_permission('opportunities.edit')));
create policy "Opportunities permission can update"
  on public.growth_opportunities for update to authenticated
  using ((select private.os_has_permission('opportunities.edit')))
  with check ((select private.os_has_permission('opportunities.edit')));

create policy "Opportunity viewers can select activities"
  on public.growth_activities for select to authenticated
  using ((select private.os_has_permission('opportunities.view')));
create policy "Opportunity editors can insert activities"
  on public.growth_activities for insert to authenticated
  with check ((select private.os_has_permission('opportunities.edit')));

create policy "Outreach permission can select"
  on public.growth_messages for select to authenticated
  using ((select private.os_has_permission('outreach.view')));
create policy "Outreach permission can insert"
  on public.growth_messages for insert to authenticated
  with check ((select private.os_has_permission('outreach.edit')));
create policy "Outreach permission can update"
  on public.growth_messages for update to authenticated
  using ((select private.os_has_permission('outreach.edit')))
  with check ((select private.os_has_permission('outreach.edit')));

create policy "Calendar permission can select"
  on public.growth_follow_ups for select to authenticated
  using ((select private.os_has_permission('calendar.view')));
create policy "Calendar permission can insert"
  on public.growth_follow_ups for insert to authenticated
  with check ((select private.os_has_permission('calendar.edit')));
create policy "Calendar permission can update"
  on public.growth_follow_ups for update to authenticated
  using ((select private.os_has_permission('calendar.edit')))
  with check ((select private.os_has_permission('calendar.edit')));

create policy "Proposals permission can select"
  on public.growth_proposals for select to authenticated
  using ((select private.os_has_permission('proposals.view')));
create policy "Proposal creators can insert"
  on public.growth_proposals for insert to authenticated
  with check ((select private.os_has_permission('proposals.create')));
create policy "Proposal editors can update"
  on public.growth_proposals for update to authenticated
  using ((select private.os_has_permission('proposals.edit')))
  with check ((select private.os_has_permission('proposals.edit')));

create policy "Opportunity viewers can select pipeline history"
  on public.growth_pipeline_history for select to authenticated
  using ((select private.os_has_permission('opportunities.view')));

create policy "Opportunity viewers can select attachments"
  on public.growth_attachments for select to authenticated
  using ((select private.os_has_permission('opportunities.view')));
create policy "Opportunity editors can insert attachments"
  on public.growth_attachments for insert to authenticated
  with check ((select private.os_has_permission('opportunities.edit')));

-- Storage follows the same domain permission rules.
drop policy if exists "Growth members can upload attachments" on storage.objects;
drop policy if exists "Growth members can view attachments" on storage.objects;
create policy "Opportunity editors can upload Growth OS attachments"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'growth-os' and (select private.os_has_permission('opportunities.edit')));
create policy "Opportunity viewers can view Growth OS attachments"
  on storage.objects for select to authenticated
  using (bucket_id = 'growth-os' and (select private.os_has_permission('opportunities.view')));

-- Once the public-form-submit Edge Function is deployed, direct browser inserts into
-- the general leads table are no longer necessary. Preserve RLS while removing Data API grants.
do $$
begin
  if to_regclass('public.leads') is not null then
    execute 'revoke insert on public.leads from anon, authenticated';
  end if;
end
$$;
