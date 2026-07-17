-- Run once in the SQUARGRAPH Supabase SQL editor before publishing /partners.
-- The preview form temporarily falls back to the existing leads table until this is applied.

create extension if not exists pgcrypto;

create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  company_name text not null,
  email text not null,
  phone text not null,
  city_country text not null,
  website text not null,
  primary_capability text not null,
  collaboration_type text not null,
  introduction text not null,
  portfolio_url text not null,
  years_experience text not null,
  typical_project_range text not null,
  availability text not null,
  linkedin_url text,
  instagram_url text,
  showreel_url text,
  case_study_url text,
  additional_notes text,
  capability_deck_url text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'aligned', 'not_now', 'archived')),
  source_page text not null default '/partners-preview',
  constraint partner_applications_email_length check (char_length(email) <= 180),
  constraint partner_applications_intro_length check (char_length(introduction) between 40 and 1800)
);

create index if not exists partner_applications_created_at_idx
  on public.partner_applications (created_at desc);

create index if not exists partner_applications_status_idx
  on public.partner_applications (status);

create index if not exists partner_applications_capability_idx
  on public.partner_applications (primary_capability);

alter table public.partner_applications enable row level security;

grant insert on public.partner_applications to anon, authenticated;
revoke select, update, delete on public.partner_applications from anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'partner_applications'
      and policyname = 'Public partner applications can be submitted'
  ) then
    create policy "Public partner applications can be submitted"
      on public.partner_applications
      for insert
      to anon, authenticated
      with check (
        status = 'new'
        and source_page in ('/partners-preview', '/partners')
        and char_length(full_name) between 2 and 120
        and char_length(company_name) between 2 and 160
      );
  end if;
end
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'partner-capability-decks',
  'partner-capability-decks',
  false,
  10485760,
  array[
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public partner capability decks can be uploaded'
  ) then
    create policy "Public partner capability decks can be uploaded"
      on storage.objects
      for insert
      to anon, authenticated
      with check (bucket_id = 'partner-capability-decks');
  end if;
end
$$;
