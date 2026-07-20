-- SQUARGRAPH Growth OS, private MVP
-- Run once in the Supabase SQL editor. This migration is additive and does not
-- alter or delete any existing public website tables or data.

create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table if not exists public.growth_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function private.growth_has_access()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.growth_members member
    where member.user_id = (select auth.uid())
      and member.active is true
  );
$$;

create or replace function private.growth_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.growth_members member
    where member.user_id = (select auth.uid())
      and member.active is true
      and member.role in ('owner', 'admin')
  );
$$;

create or replace function private.growth_can_write()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.growth_members member
    where member.user_id = (select auth.uid())
      and member.active is true
      and member.role in ('owner', 'admin', 'member')
  );
$$;

revoke all on function private.growth_has_access() from public;
revoke all on function private.growth_is_admin() from public;
revoke all on function private.growth_can_write() from public;
grant execute on function private.growth_has_access() to authenticated;
grant execute on function private.growth_is_admin() to authenticated;
grant execute on function private.growth_can_write() to authenticated;

create table if not exists public.growth_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  linkedin_url text,
  location text,
  summary text,
  current_positioning text,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint growth_companies_name_length check (char_length(name) between 2 and 180)
);

create table if not exists public.growth_contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.growth_companies(id) on delete set null,
  full_name text not null,
  title text,
  email text,
  phone text,
  linkedin_url text,
  is_decision_maker boolean not null default false,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint growth_contacts_name_length check (char_length(full_name) between 2 and 180)
);

create table if not exists public.growth_opportunities (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  source_url text,
  company_id uuid references public.growth_companies(id) on delete set null,
  contact_id uuid references public.growth_contacts(id) on delete set null,
  requirement text not null,
  opportunity_type text,
  location text,
  date_posted date,
  status text not null default 'New' check (status in (
    'New', 'Qualified', 'Researching', 'Outreach Ready', 'Contacted', 'Replied',
    'Discovery Scheduled', 'Proposal Requested', 'Proposal Sent', 'Negotiation',
    'Won', 'Lost', 'Dormant'
  )),
  priority text not null default 'Skip' check (priority in ('Priority A', 'Priority B', 'Priority C', 'Skip')),
  fit_score smallint not null default 0 check (fit_score between 0 and 100),
  strategic_fit smallint not null default 0 check (strategic_fit between 0 and 5),
  capability_fit smallint not null default 0 check (capability_fit between 0 and 5),
  proof_available smallint not null default 0 check (proof_available between 0 and 5),
  budget_potential smallint not null default 0 check (budget_potential between 0 and 5),
  decision_maker_access smallint not null default 0 check (decision_maker_access between 0 and 5),
  urgency smallint not null default 0 check (urgency between 0 and 5),
  recurring_potential smallint not null default 0 check (recurring_potential between 0 and 5),
  reputational_value smallint not null default 0 check (reputational_value between 0 and 5),
  delivery_risk smallint not null default 0 check (delivery_risk between 0 and 5),
  company_summary text,
  founder_profile text,
  website_observations text,
  current_positioning text,
  visible_gaps text,
  probable_requirement text,
  relevant_capability text,
  relevant_proof text,
  potential_objection text,
  internal_notes text,
  estimated_value numeric(14,2),
  probability smallint check (probability between 0 and 100),
  expected_close_date date,
  last_interaction timestamptz,
  next_action text,
  follow_up_date timestamptz,
  outcome_notes text,
  loss_reason text,
  assigned_to uuid references auth.users(id),
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint growth_opportunities_requirement_length check (char_length(requirement) between 3 and 2000)
);

create table if not exists public.growth_activities (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.growth_opportunities(id) on delete cascade,
  activity_type text not null check (activity_type in (
    'created', 'note', 'status_change', 'qualification', 'research', 'draft',
    'outreach', 'reply', 'call', 'follow_up', 'proposal', 'outcome', 'system'
  )),
  channel text,
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.growth_messages (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.growth_opportunities(id) on delete cascade,
  message_type text not null check (message_type in (
    'linkedin_comment', 'connection_note', 'dm', 'whatsapp', 'email',
    'follow_up_1', 'follow_up_2', 'call_opener'
  )),
  subject text,
  body text not null default '',
  status text not null default 'draft' check (status in ('draft', 'approved', 'sent', 'archived')),
  sent_at timestamptz,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (opportunity_id, message_type)
);

create table if not exists public.growth_follow_ups (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.growth_opportunities(id) on delete cascade,
  due_at timestamptz not null,
  action text not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled')),
  completed_at timestamptz,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.growth_proposals (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.growth_opportunities(id) on delete cascade,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'requested', 'sent', 'reviewing', 'accepted', 'declined')),
  estimated_value numeric(14,2),
  advance_status text,
  expected_close_date date,
  probability smallint check (probability between 0 and 100),
  document_url text,
  notes text,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.growth_pipeline_history (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.growth_opportunities(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by uuid not null default auth.uid() references auth.users(id),
  changed_at timestamptz not null default now()
);

create table if not exists public.growth_attachments (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.growth_opportunities(id) on delete cascade,
  file_name text not null,
  object_path text not null,
  mime_type text,
  file_size bigint,
  uploaded_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists growth_opportunities_status_idx on public.growth_opportunities (status);
create index if not exists growth_opportunities_priority_idx on public.growth_opportunities (priority);
create index if not exists growth_opportunities_follow_up_idx on public.growth_opportunities (follow_up_date) where follow_up_date is not null;
create index if not exists growth_opportunities_updated_idx on public.growth_opportunities (updated_at desc);
create unique index if not exists growth_opportunities_source_url_unique_idx
  on public.growth_opportunities (lower(regexp_replace(source_url, '/+$', '')))
  where source_url is not null and btrim(source_url) <> '';
create index if not exists growth_activities_opportunity_idx on public.growth_activities (opportunity_id, created_at desc);
create index if not exists growth_follow_ups_due_idx on public.growth_follow_ups (due_at) where status = 'pending';

create or replace function public.growth_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.growth_score_opportunity()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  score_total integer;
begin
  score_total := new.strategic_fit + new.capability_fit + new.proof_available
    + new.budget_potential + new.decision_maker_access + new.urgency
    + new.recurring_potential + new.reputational_value + (5 - new.delivery_risk);
  new.fit_score := round((score_total::numeric / 45) * 100);
  new.priority := case
    when new.fit_score >= 75 then 'Priority A'
    when new.fit_score >= 55 then 'Priority B'
    when new.fit_score >= 35 then 'Priority C'
    else 'Skip'
  end;
  return new;
end;
$$;

create or replace function public.growth_log_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.status is distinct from new.status then
    insert into public.growth_pipeline_history (opportunity_id, from_status, to_status, changed_by)
    values (new.id, old.status, new.status, coalesce((select auth.uid()), new.created_by));
  end if;
  return new;
end;
$$;

revoke all on function public.growth_set_updated_at() from public, anon, authenticated;
revoke all on function public.growth_score_opportunity() from public, anon, authenticated;
revoke all on function public.growth_log_status_change() from public, anon, authenticated;

drop trigger if exists growth_members_updated_at on public.growth_members;
create trigger growth_members_updated_at before update on public.growth_members
for each row execute function public.growth_set_updated_at();
drop trigger if exists growth_companies_updated_at on public.growth_companies;
create trigger growth_companies_updated_at before update on public.growth_companies
for each row execute function public.growth_set_updated_at();
drop trigger if exists growth_contacts_updated_at on public.growth_contacts;
create trigger growth_contacts_updated_at before update on public.growth_contacts
for each row execute function public.growth_set_updated_at();
drop trigger if exists growth_opportunities_updated_at on public.growth_opportunities;
create trigger growth_opportunities_updated_at before update on public.growth_opportunities
for each row execute function public.growth_set_updated_at();
drop trigger if exists growth_opportunities_score on public.growth_opportunities;
create trigger growth_opportunities_score before insert or update of
  strategic_fit, capability_fit, proof_available, budget_potential,
  decision_maker_access, urgency, recurring_potential, reputational_value, delivery_risk
on public.growth_opportunities for each row execute function public.growth_score_opportunity();
drop trigger if exists growth_opportunities_status_history on public.growth_opportunities;
create trigger growth_opportunities_status_history after update of status on public.growth_opportunities
for each row execute function public.growth_log_status_change();
drop trigger if exists growth_messages_updated_at on public.growth_messages;
create trigger growth_messages_updated_at before update on public.growth_messages
for each row execute function public.growth_set_updated_at();
drop trigger if exists growth_follow_ups_updated_at on public.growth_follow_ups;
create trigger growth_follow_ups_updated_at before update on public.growth_follow_ups
for each row execute function public.growth_set_updated_at();
drop trigger if exists growth_proposals_updated_at on public.growth_proposals;
create trigger growth_proposals_updated_at before update on public.growth_proposals
for each row execute function public.growth_set_updated_at();

alter table public.growth_members enable row level security;
alter table public.growth_companies enable row level security;
alter table public.growth_contacts enable row level security;
alter table public.growth_opportunities enable row level security;
alter table public.growth_activities enable row level security;
alter table public.growth_messages enable row level security;
alter table public.growth_follow_ups enable row level security;
alter table public.growth_proposals enable row level security;
alter table public.growth_pipeline_history enable row level security;
alter table public.growth_attachments enable row level security;

revoke all on public.growth_members, public.growth_companies, public.growth_contacts,
  public.growth_opportunities, public.growth_activities, public.growth_messages,
  public.growth_follow_ups, public.growth_proposals, public.growth_pipeline_history,
  public.growth_attachments from anon, authenticated;
revoke delete on public.growth_members, public.growth_companies, public.growth_contacts,
  public.growth_opportunities, public.growth_activities, public.growth_messages,
  public.growth_follow_ups, public.growth_proposals, public.growth_pipeline_history,
  public.growth_attachments from authenticated;
revoke update on public.growth_activities, public.growth_pipeline_history,
  public.growth_attachments from authenticated;
grant select on public.growth_members to authenticated;
grant select, insert, update on public.growth_companies, public.growth_contacts,
  public.growth_opportunities, public.growth_messages, public.growth_follow_ups,
  public.growth_proposals to authenticated;
grant select, insert on public.growth_activities, public.growth_attachments to authenticated;
grant select on public.growth_pipeline_history to authenticated;

drop policy if exists "Growth members can view their membership" on public.growth_members;
create policy "Growth members can view their membership"
  on public.growth_members for select to authenticated
  using (user_id = (select auth.uid()) and active is true);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'growth_companies', 'growth_contacts', 'growth_opportunities', 'growth_activities',
    'growth_messages', 'growth_follow_ups', 'growth_proposals',
    'growth_pipeline_history', 'growth_attachments'
  ] loop
    execute format('drop policy if exists "Growth members can select" on public.%I', table_name);
    execute format('drop policy if exists "Growth members can insert" on public.%I', table_name);
    execute format('drop policy if exists "Growth members can update" on public.%I', table_name);
    execute format(
      'create policy "Growth members can select" on public.%I for select to authenticated using ((select private.growth_has_access()))',
      table_name
    );
    if table_name <> 'growth_pipeline_history' then
      execute format(
        'create policy "Growth members can insert" on public.%I for insert to authenticated with check ((select private.growth_can_write()))',
        table_name
      );
    end if;
  end loop;
end
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'growth_companies', 'growth_contacts', 'growth_opportunities',
    'growth_messages', 'growth_follow_ups', 'growth_proposals'
  ] loop
    execute format(
      'create policy "Growth members can update" on public.%I for update to authenticated using ((select private.growth_can_write())) with check ((select private.growth_can_write()))',
      table_name
    );
  end loop;
end
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'growth-os',
  'growth-os',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Growth members can upload attachments" on storage.objects;
drop policy if exists "Growth members can view attachments" on storage.objects;
create policy "Growth members can upload attachments"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'growth-os' and (select private.growth_can_write()));
create policy "Growth members can view attachments"
  on storage.objects for select to authenticated
  using (bucket_id = 'growth-os' and (select private.growth_has_access()));

-- First-owner bootstrap, run after the email account exists in Supabase Auth:
-- insert into public.growth_members (user_id, email, display_name, role)
-- select id, email, 'Saurabh Sohan Singh', 'owner'
-- from auth.users
-- where lower(email) = lower('saurabh@squargraph.com')
-- on conflict (user_id) do update
-- set active = true, role = 'owner', updated_at = now();

-- SQUARGRAPH OS workspace layer
-- This section is additive. Existing Growth OS data and legacy memberships remain intact.

create table if not exists public.os_roles (
  id uuid primary key default gen_random_uuid(),
  role_key text not null unique,
  name text not null,
  rank smallint not null default 0,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.os_permissions (
  id uuid primary key default gen_random_uuid(),
  permission_key text not null unique,
  name text not null,
  category text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.os_role_permissions (
  role_id uuid not null references public.os_roles(id) on delete cascade,
  permission_id uuid not null references public.os_permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table if not exists public.os_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role_id uuid not null references public.os_roles(id),
  status text not null default 'active' check (status in ('pending', 'active', 'suspended')),
  invited_by uuid references auth.users(id),
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.os_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  timezone text not null default 'Asia/Kolkata',
  notifications jsonb not null default '{"email": true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.os_member_permissions (
  user_id uuid not null references public.os_members(user_id) on delete cascade,
  permission_id uuid not null references public.os_permissions(id) on delete cascade,
  allowed boolean not null,
  granted_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, permission_id)
);

create table if not exists public.os_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  role_id uuid not null references public.os_roles(id),
  status text not null default 'pending' check (status in ('pending', 'sent', 'accepted', 'revoked', 'expired')),
  invited_by uuid not null references auth.users(id),
  accepted_at timestamptz,
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists os_invitations_open_email_idx
  on public.os_invitations (lower(email))
  where status in ('pending', 'sent');

create table if not exists public.os_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists os_audit_log_created_idx on public.os_audit_log (created_at desc);
create index if not exists os_audit_log_actor_idx on public.os_audit_log (actor_id, created_at desc);

create table if not exists public.os_login_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null check (event_type in ('sign_in', 'sign_out', 'failed', 'password_reset')),
  user_agent text,
  timezone text,
  path text,
  created_at timestamptz not null default now()
);

create index if not exists os_login_history_user_idx on public.os_login_history (user_id, created_at desc);

insert into public.os_roles (role_key, name, rank, description) values
  ('super_admin', 'Super Admin', 100, 'Full platform and security administration.'),
  ('founder', 'Founder', 90, 'Workspace ownership and strategic administration.'),
  ('director', 'Director', 80, 'Cross-functional direction and operating control.'),
  ('manager', 'Manager', 60, 'Team and workflow management.'),
  ('associate', 'Associate', 40, 'Day-to-day workspace contribution.'),
  ('partner', 'Partner', 30, 'Approved partner access.'),
  ('client', 'Client', 20, 'Approved client access.'),
  ('guest', 'Guest', 10, 'Limited read-only access.')
on conflict (role_key) do update set
  name = excluded.name,
  rank = excluded.rank,
  description = excluded.description;

insert into public.os_permissions (permission_key, name, category, description) values
  ('opportunities.view', 'View opportunities', 'Growth OS', 'View opportunity and pipeline records.'),
  ('opportunities.edit', 'Edit opportunities', 'Growth OS', 'Create and update opportunity records.'),
  ('companies.view', 'View companies', 'Growth OS', 'View company records.'),
  ('companies.edit', 'Edit companies', 'Growth OS', 'Create and update company records.'),
  ('contacts.view', 'View contacts', 'Growth OS', 'View contact records.'),
  ('contacts.edit', 'Edit contacts', 'Growth OS', 'Create and update contact records.'),
  ('outreach.view', 'View outreach', 'Growth OS', 'View outreach drafts and history.'),
  ('outreach.edit', 'Edit outreach', 'Growth OS', 'Create and update outreach drafts.'),
  ('outreach.send', 'Send outreach', 'Growth OS', 'Approve and send outreach through connected services.'),
  ('proposals.view', 'View proposals', 'Growth OS', 'View proposals and commercial context.'),
  ('proposals.create', 'Create proposals', 'Growth OS', 'Create proposal records.'),
  ('proposals.edit', 'Edit proposals', 'Growth OS', 'Update proposal records.'),
  ('calendar.view', 'View calendar', 'Workspace', 'View follow-ups and scheduled work.'),
  ('calendar.edit', 'Edit calendar', 'Workspace', 'Create and update follow-ups.'),
  ('data.export', 'Export workspace data', 'Security', 'Export permitted workspace records.'),
  ('users.invite', 'Invite users', 'Security', 'Invite approved users into the workspace.'),
  ('users.manage', 'Manage users', 'Security', 'Manage roles, status and permission overrides.'),
  ('settings.manage', 'Manage settings', 'Security', 'Manage workspace-level settings.'),
  ('audit.view', 'View audit log', 'Security', 'View workspace activity and login history.')
on conflict (permission_key) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description;

insert into public.os_role_permissions (role_id, permission_id)
select role.id, permission.id
from public.os_roles role
cross join public.os_permissions permission
where role.role_key in ('super_admin', 'founder')
on conflict do nothing;

insert into public.os_role_permissions (role_id, permission_id)
select role.id, permission.id
from public.os_roles role
cross join public.os_permissions permission
where role.role_key = 'director'
  and permission.permission_key <> 'users.manage'
on conflict do nothing;

insert into public.os_role_permissions (role_id, permission_id)
select role.id, permission.id
from public.os_roles role
cross join public.os_permissions permission
where role.role_key = 'manager'
  and permission.permission_key in (
    'opportunities.view', 'opportunities.edit', 'companies.view', 'companies.edit',
    'contacts.view', 'contacts.edit', 'outreach.view', 'outreach.edit',
    'proposals.view', 'proposals.create', 'proposals.edit',
    'calendar.view', 'calendar.edit', 'audit.view'
  )
on conflict do nothing;

insert into public.os_role_permissions (role_id, permission_id)
select role.id, permission.id
from public.os_roles role
cross join public.os_permissions permission
where role.role_key = 'associate'
  and permission.permission_key in (
    'opportunities.view', 'opportunities.edit', 'companies.view', 'contacts.view',
    'outreach.view', 'outreach.edit', 'proposals.view', 'calendar.view', 'calendar.edit'
  )
on conflict do nothing;

insert into public.os_role_permissions (role_id, permission_id)
select role.id, permission.id
from public.os_roles role
cross join public.os_permissions permission
where role.role_key in ('partner', 'client', 'guest')
  and permission.permission_key in ('opportunities.view', 'companies.view', 'contacts.view', 'proposals.view', 'calendar.view')
on conflict do nothing;

insert into public.os_members (user_id, email, role_id, status, joined_at)
select legacy.user_id, legacy.email, role.id,
  case when legacy.active then 'active' else 'suspended' end,
  legacy.created_at
from public.growth_members legacy
join public.os_roles role on role.role_key = case legacy.role
  when 'owner' then 'founder'
  when 'admin' then 'director'
  when 'member' then 'associate'
  else 'guest'
end
on conflict (user_id) do update set
  email = excluded.email,
  updated_at = now();

insert into public.os_profiles (user_id, full_name)
select legacy.user_id, legacy.display_name
from public.growth_members legacy
on conflict (user_id) do nothing;

create or replace function private.os_member_is_active()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.os_members member
    where member.user_id = (select auth.uid()) and member.status = 'active'
  );
$$;

create or replace function private.os_has_permission(requested_permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
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
  );
$$;

create or replace function public.os_can(requested_permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$ select private.os_has_permission(requested_permission); $$;

create or replace function public.os_my_permissions()
returns table (permission_key text, permission_name text, category text)
language sql
stable
security definer
set search_path = ''
as $$
  select permission.permission_key, permission.name, permission.category
  from public.os_permissions permission
  where private.os_has_permission(permission.permission_key)
  order by permission.category, permission.permission_key;
$$;

revoke all on function private.os_member_is_active() from public;
revoke all on function private.os_has_permission(text) from public;
revoke all on function public.os_can(text) from public, anon;
revoke all on function public.os_my_permissions() from public, anon;
grant execute on function private.os_member_is_active() to authenticated;
grant execute on function private.os_has_permission(text) to authenticated;
grant execute on function public.os_can(text) to authenticated;
grant execute on function public.os_my_permissions() to authenticated;

create or replace function private.growth_has_access()
returns boolean language sql stable security definer set search_path = ''
as $$ select private.os_has_permission('opportunities.view'); $$;

create or replace function private.growth_is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select private.os_has_permission('users.manage'); $$;

create or replace function private.growth_can_write()
returns boolean language sql stable security definer set search_path = ''
as $$ select private.os_has_permission('opportunities.edit'); $$;

create or replace function private.os_capture_audit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_data jsonb;
  record_id text;
begin
  row_data := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  record_id := coalesce(row_data ->> 'id', row_data ->> 'user_id');
  insert into public.os_audit_log (actor_id, action, entity_type, entity_id, metadata)
  values ((select auth.uid()), lower(tg_op) || '_' || tg_table_name, tg_table_name, record_id, '{}'::jsonb);
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function private.os_capture_audit() from public, anon, authenticated;

drop trigger if exists os_audit_opportunities on public.growth_opportunities;
create trigger os_audit_opportunities after insert or update on public.growth_opportunities
for each row execute function private.os_capture_audit();
drop trigger if exists os_audit_proposals on public.growth_proposals;
create trigger os_audit_proposals after insert or update on public.growth_proposals
for each row execute function private.os_capture_audit();
drop trigger if exists os_audit_profiles on public.os_profiles;
create trigger os_audit_profiles after insert or update on public.os_profiles
for each row execute function private.os_capture_audit();
drop trigger if exists os_audit_members on public.os_members;
create trigger os_audit_members after insert or update on public.os_members
for each row execute function private.os_capture_audit();

drop trigger if exists os_members_updated_at on public.os_members;
create trigger os_members_updated_at before update on public.os_members
for each row execute function public.growth_set_updated_at();
drop trigger if exists os_profiles_updated_at on public.os_profiles;
create trigger os_profiles_updated_at before update on public.os_profiles
for each row execute function public.growth_set_updated_at();
drop trigger if exists os_member_permissions_updated_at on public.os_member_permissions;
create trigger os_member_permissions_updated_at before update on public.os_member_permissions
for each row execute function public.growth_set_updated_at();
drop trigger if exists os_invitations_updated_at on public.os_invitations;
create trigger os_invitations_updated_at before update on public.os_invitations
for each row execute function public.growth_set_updated_at();

alter table public.os_roles enable row level security;
alter table public.os_permissions enable row level security;
alter table public.os_role_permissions enable row level security;
alter table public.os_members enable row level security;
alter table public.os_profiles enable row level security;
alter table public.os_member_permissions enable row level security;
alter table public.os_invitations enable row level security;
alter table public.os_audit_log enable row level security;
alter table public.os_login_history enable row level security;

revoke all on public.os_roles, public.os_permissions, public.os_role_permissions,
  public.os_members, public.os_profiles, public.os_member_permissions,
  public.os_invitations, public.os_audit_log, public.os_login_history
from anon, authenticated;

grant select on public.os_roles, public.os_permissions, public.os_role_permissions to authenticated;
grant select on public.os_members, public.os_profiles, public.os_member_permissions,
  public.os_invitations, public.os_audit_log, public.os_login_history to authenticated;
grant insert, update on public.os_profiles to authenticated;
grant insert on public.os_login_history to authenticated;
grant insert, update on public.os_members, public.os_member_permissions, public.os_invitations to authenticated;

drop policy if exists "Active members can view roles" on public.os_roles;
create policy "Active members can view roles" on public.os_roles for select to authenticated
using ((select private.os_member_is_active()));
drop policy if exists "Active members can view permissions" on public.os_permissions;
create policy "Active members can view permissions" on public.os_permissions for select to authenticated
using ((select private.os_member_is_active()));
drop policy if exists "Active members can view role permissions" on public.os_role_permissions;
create policy "Active members can view role permissions" on public.os_role_permissions for select to authenticated
using ((select private.os_member_is_active()));

drop policy if exists "Members can view permitted memberships" on public.os_members;
create policy "Members can view permitted memberships" on public.os_members for select to authenticated
using (user_id = (select auth.uid()) or (select private.os_has_permission('users.manage')));
drop policy if exists "Managers can insert memberships" on public.os_members;
create policy "Managers can insert memberships" on public.os_members for insert to authenticated
with check ((select private.os_has_permission('users.manage')));
drop policy if exists "Managers can update memberships" on public.os_members;
create policy "Managers can update memberships" on public.os_members for update to authenticated
using ((select private.os_has_permission('users.manage')))
with check ((select private.os_has_permission('users.manage')));

drop policy if exists "Active members can view profiles" on public.os_profiles;
create policy "Active members can view profiles" on public.os_profiles for select to authenticated
using ((select private.os_member_is_active()));
drop policy if exists "Members can create own profile" on public.os_profiles;
create policy "Members can create own profile" on public.os_profiles for insert to authenticated
with check (user_id = (select auth.uid()) or (select private.os_has_permission('users.manage')));
drop policy if exists "Members can update own profile" on public.os_profiles;
create policy "Members can update own profile" on public.os_profiles for update to authenticated
using (user_id = (select auth.uid()) or (select private.os_has_permission('users.manage')))
with check (user_id = (select auth.uid()) or (select private.os_has_permission('users.manage')));

drop policy if exists "Members can view own overrides" on public.os_member_permissions;
create policy "Members can view own overrides" on public.os_member_permissions for select to authenticated
using (user_id = (select auth.uid()) or (select private.os_has_permission('users.manage')));
drop policy if exists "Managers can insert overrides" on public.os_member_permissions;
create policy "Managers can insert overrides" on public.os_member_permissions for insert to authenticated
with check ((select private.os_has_permission('users.manage')));
drop policy if exists "Managers can update overrides" on public.os_member_permissions;
create policy "Managers can update overrides" on public.os_member_permissions for update to authenticated
using ((select private.os_has_permission('users.manage')))
with check ((select private.os_has_permission('users.manage')));

drop policy if exists "Inviters can view invitations" on public.os_invitations;
create policy "Inviters can view invitations" on public.os_invitations for select to authenticated
using ((select private.os_has_permission('users.invite')));
drop policy if exists "Inviters can create invitations" on public.os_invitations;
create policy "Inviters can create invitations" on public.os_invitations for insert to authenticated
with check (invited_by = (select auth.uid()) and (select private.os_has_permission('users.invite')));
drop policy if exists "Inviters can update invitations" on public.os_invitations;
create policy "Inviters can update invitations" on public.os_invitations for update to authenticated
using ((select private.os_has_permission('users.invite')))
with check ((select private.os_has_permission('users.invite')));

drop policy if exists "Auditors can view workspace audit" on public.os_audit_log;
create policy "Auditors can view workspace audit" on public.os_audit_log for select to authenticated
using ((select private.os_has_permission('audit.view')));

drop policy if exists "Members can view login history" on public.os_login_history;
create policy "Members can view login history" on public.os_login_history for select to authenticated
using (user_id = (select auth.uid()) or (select private.os_has_permission('audit.view')));
drop policy if exists "Members can record login history" on public.os_login_history;
create policy "Members can record login history" on public.os_login_history for insert to authenticated
with check (user_id = (select auth.uid()) and (select private.os_member_is_active()));

-- Founder bootstrap after the email exists in Supabase Auth:
-- insert into public.os_members (user_id, email, role_id, status, joined_at)
-- select users.id, users.email, roles.id, 'active', now()
-- from auth.users users cross join public.os_roles roles
-- where lower(users.email) = lower('saurabh@squargraph.com') and roles.role_key = 'founder'
-- on conflict (user_id) do update set role_id = excluded.role_id, status = 'active', updated_at = now();
-- insert into public.os_profiles (user_id, full_name)
-- select id, 'Saurabh Sohan Singh' from auth.users
-- where lower(email) = lower('saurabh@squargraph.com')
-- on conflict (user_id) do update set full_name = excluded.full_name, updated_at = now();
