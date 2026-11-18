-- Storage buckets (Case 02 §9). Files are public to read through their URL;
-- only admins can upload, replace, or delete. SVG is not allowed (it can hold scripts).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 5 * 1024 * 1024, array['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', true, 10 * 1024 * 1024, array['application/pdf']);

create policy "Admins read portfolio files" on storage.objects
  for select to authenticated
  using (bucket_id in ('media', 'documents') and (select public.is_admin()));

create policy "Admins upload portfolio files" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('media', 'documents') and (select public.is_admin()));

create policy "Admins replace portfolio files" on storage.objects
  for update to authenticated
  using (bucket_id in ('media', 'documents') and (select public.is_admin()))
  with check (bucket_id in ('media', 'documents') and (select public.is_admin()));

create policy "Admins delete portfolio files" on storage.objects
  for delete to authenticated
  using (bucket_id in ('media', 'documents') and (select public.is_admin()));
