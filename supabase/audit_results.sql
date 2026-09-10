-- Private storage for server-generated paid Brand Growth Audit results.
-- Apply after supabase/production_hardening.sql because this table references payment_orders.

create table if not exists public.audit_results (
  id uuid primary key default gen_random_uuid(),
  public_token uuid not null unique default gen_random_uuid(),
  payment_order_id uuid not null unique references public.payment_orders(id) on delete restrict,
  company text,
  score_web smallint not null check (score_web between 0 and 100),
  score_comm smallint not null check (score_comm between 0 and 100),
  score_comp smallint not null check (score_comp between 0 and 100),
  score_overall smallint not null check (score_overall between 0 and 100),
  score_confidence smallint not null default 70 check (score_confidence between 0 and 100),
  headline text,
  summary text not null,
  web_insight text,
  comm_insight text,
  comp_insight text,
  analysis_model text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists audit_results_created_idx on public.audit_results (created_at desc);
alter table public.audit_results enable row level security;
revoke all on public.audit_results from anon, authenticated;

comment on table public.audit_results is
  'Paid audit results. Read and write only through the SQUARGRAPH audit Edge Function after payment verification.';
