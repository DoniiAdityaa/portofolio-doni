-- RLS tests (M3 checklist). Run with `pnpm db:test` (supabase test db).
-- Everything runs in one transaction and is rolled back at the end.

begin;
create extension if not exists pgtap with schema extensions;
select plan(20);

-- ---------------------------------------------------------------------------
-- Fixtures (as postgres, bypassing RLS)
-- ---------------------------------------------------------------------------

insert into auth.users (id, email) values
  ('00000000-0000-4000-a000-000000000001', 'admin@test.local'),
  ('00000000-0000-4000-a000-000000000002', 'visitor@test.local');
insert into public.admin_users (user_id) values ('00000000-0000-4000-a000-000000000001');

insert into public.skills (id, name, icon_slug, category_id, status, deleted_at)
select '00000000-0000-4000-b000-000000000001', 'Trashed skill', 'dart', id, 'published', now()
from public.skill_categories limit 1;
insert into public.skills (id, name, icon_slug, category_id, status)
select '00000000-0000-4000-b000-000000000002', 'Draft skill', 'dart', id, 'draft'
from public.skill_categories limit 1;
insert into public.contact_messages (name, email, message)
values ('Fixture', 'fixture@test.local', 'A message that already exists.');

select is(
  (select count(*)::int from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity),
  0,
  'RLS is enabled on every public table'
);

-- ---------------------------------------------------------------------------
-- Anonymous visitor
-- ---------------------------------------------------------------------------

set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true);

select is(
  (select count(*)::int from public.skills where id in (
    '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-b000-000000000002')),
  0,
  'anon cannot see draft or trashed skills'
);
select ok((select count(*) from public.skills) > 0, 'anon sees published skills');
select is(
  (select count(*)::int from public.experiences where status <> 'published'),
  0,
  'anon sees no draft experiences'
);
select ok((select count(*) from public.site_settings) = 1, 'anon reads site settings');

select throws_ok(
  'select * from public.contact_messages',
  '42501', null, 'anon cannot read the inbox'
);
select lives_ok(
  $$insert into public.contact_messages (name, email, message)
    values ('Visitor', 'visitor@test.local', 'Hello from a visitor!')$$,
  'anon can send a message'
);
select throws_ok(
  $$insert into public.contact_messages (name, email, message, is_read)
    values ('Visitor', 'visitor@test.local', 'Trying to mark as read.', true)$$,
  '42501', null, 'anon cannot send a message already marked as read'
);
select throws_ok(
  $$insert into public.skills (name, icon_slug, category_id)
    select 'Hack', 'dart', id from public.skill_categories limit 1$$,
  '42501', null, 'anon cannot write content'
);
select throws_ok(
  $$update public.projects set is_featured = true$$,
  '42501', null, 'anon cannot update content'
);
select throws_ok(
  $$insert into public.page_views (path, locale, visitor_hash) values ('/en', 'en', 'x')$$,
  '42501', null, 'anon cannot insert page views directly'
);
select lives_ok(
  $$select public.record_page_view('/en', 'en', null, 'hash')$$,
  'anon records a page view through the function'
);
select throws_ok(
  $$insert into storage.objects (bucket_id, name) values ('media', 'hack.png')$$,
  '42501', null, 'anon cannot upload files'
);

-- ---------------------------------------------------------------------------
-- Signed in, but not an admin
-- ---------------------------------------------------------------------------

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-a000-000000000002", "role": "authenticated"}', true);

select is((select count(*)::int from public.contact_messages), 0, 'a non-admin user reads no messages');
select throws_ok(
  $$insert into public.skills (name, icon_slug, category_id)
    select 'Hack', 'dart', id from public.skill_categories limit 1$$,
  '42501', null, 'a non-admin user cannot write content'
);

-- ---------------------------------------------------------------------------
-- Admin
-- ---------------------------------------------------------------------------

select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-a000-000000000001", "role": "authenticated"}', true);

select ok(public.is_admin(), 'is_admin() is true for the owner');
select is(
  (select count(*)::int from public.skills where id in (
    '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-b000-000000000002')),
  2,
  'the admin sees drafts and trashed rows'
);
select ok((select count(*) from public.contact_messages) >= 2, 'the admin reads the inbox');
select lives_ok(
  $$update public.contact_messages set is_read = true$$,
  'the admin marks messages as read'
);
select ok((select count(*) from public.page_views) >= 1, 'the admin reads page views');

select * from finish();
rollback;
