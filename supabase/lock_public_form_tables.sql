-- Run only AFTER public-form-submit is deployed and the production lead + feedback forms
-- have passed end-to-end submission tests.
-- The Edge Function writes with the service role, so browser roles no longer need direct INSERT privileges.

do $$
begin
  if to_regclass('public.leads') is not null then
    execute 'revoke insert on public.leads from anon, authenticated';
  end if;
  if to_regclass('public.feedback') is not null then
    execute 'revoke insert on public.feedback from anon, authenticated';
  end if;
end
$$;

-- Careers and partner application tables use their own authenticated/ownership-aware flows and are not changed here.
