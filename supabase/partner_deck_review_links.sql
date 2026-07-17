-- Run once after partner_applications.sql if the partner table already exists.
-- New verified uploads remain private while receiving a signed review URL.

drop policy if exists "Public partner capability decks can be uploaded" on storage.objects;
drop policy if exists "Verified partner capability decks can be uploaded" on storage.objects;
drop policy if exists "Verified partners can review their capability decks" on storage.objects;

create policy "Verified partner capability decks can be uploaded"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'partner-capability-decks'
    and owner_id = (select auth.uid()::text)
  );

create policy "Verified partners can review their capability decks"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'partner-capability-decks'
    and owner_id = (select auth.uid()::text)
  );

comment on column public.partner_applications.capability_deck_url is
  'One-year signed review URL for the private capability deck object.';
