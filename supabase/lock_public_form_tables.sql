-- Run only AFTER public-form-submit is deployed and the production forms have passed an end-to-end submission test.
-- The Edge Function writes with the service role, so browser roles no longer need direct INSERT privileges.

do $$
begin
  if to_regclass('public.leads') is not null then
    execute 'revoke insert on public.leads from anon, authenticated';
  end if;
end
$$;

-- Do not revoke feedback table access here until feedback.html is migrated to the gateway.
-- Careers and partner application tables use their own authenticated/ownership-aware flows and are not changed here.
