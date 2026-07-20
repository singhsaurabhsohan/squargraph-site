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
