-- Run once in the SQUARGRAPH Supabase SQL editor before publishing CV uploads.
-- Existing tables and data are not modified or deleted.
-- The Careers form falls back to the existing leads table when no CV is attached
-- until this migration is applied.

create extension if not exists pgcrypto;

create table if not exists public.careers_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  location text not null,
  discipline text not null,
  experience_years text not null,
  linkedin_url text,
  portfolio_url text,
  opportunity_type text not null,
  working_model text not null,
  introduction text not null,
  cv_url text,
  role_id text,
  consent boolean not null default false,
  source text not null default '/careers',
  status text not null default 'New' check (status in ('New', 'Reviewing', 'Shortlisted', 'Interview', 'Hold', 'Rejected', 'Hired')),
  constraint careers_applications_name_length check (char_length(full_name) between 2 and 120),
  constraint careers_applications_email_length check (char_length(email) <= 180),
  constraint careers_applications_intro_length check (char_length(introduction) between 40 and 1800),
  constraint careers_applications_consent_required check (consent is true)
);

create index if not exists careers_applications_created_at_idx
  on public.careers_applications (created_at desc);

create index if not exists careers_applications_status_idx
  on public.careers_applications (status);

create index if not exists careers_applications_role_id_idx
  on public.careers_applications (role_id)
  where role_id is not null;

alter table public.careers_applications enable row level security;

grant insert on public.careers_applications to anon, authenticated;
revoke select, update, delete on public.careers_applications from anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'careers_applications'
      and policyname = 'Public careers applications can be submitted'
  ) then
    create policy "Public careers applications can be submitted"
      on public.careers_applications
      for insert
      to anon, authenticated
      with check (
        status = 'New'
        and source = '/careers'
        and consent is true
        and char_length(full_name) between 2 and 120
        and char_length(introduction) between 40 and 1800
      );
  end if;
end
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'careers-cvs',
  'careers-cvs',
  false,
  5242880,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Verified applicants can upload careers CVs" on storage.objects;
drop policy if exists "Verified applicants can review careers CVs" on storage.objects;

create policy "Verified applicants can upload careers CVs"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'careers-cvs'
    and owner_id = (select auth.uid()::text)
  );

create policy "Verified applicants can review careers CVs"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'careers-cvs'
    and owner_id = (select auth.uid()::text)
  );

comment on column public.careers_applications.cv_url is
  'One-year signed review URL for a private careers-cvs object.';

-- Rollback, only if the Careers system must be removed and after exporting data:
-- drop table if exists public.careers_applications;
-- delete from storage.objects where bucket_id = 'careers-cvs';
-- delete from storage.buckets where id = 'careers-cvs';
