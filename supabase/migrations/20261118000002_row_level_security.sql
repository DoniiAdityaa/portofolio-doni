-- Row Level Security (Case 02 §8): the final guard, even if the route or action
-- guards had a bug. RLS is on for every table; nothing is reachable without a policy.

-- ---------------------------------------------------------------------------
-- is_admin()
-- ---------------------------------------------------------------------------

/** True when the signed-in user is listed in admin_users. Used by every admin policy. */
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Enable RLS everywhere
-- ---------------------------------------------------------------------------

alter table public.site_settings enable row level security;
alter table public.skill_categories enable row level security;
alter table public.achievement_categories enable row level security;
alter table public.project_types enable row level security;
alter table public.project_categories enable row level security;
alter table public.skills enable row level security;
alter table public.experiences enable row level security;
alter table public.educations enable row level security;
alter table public.achievements enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.experience_skills enable row level security;
alter table public.achievement_skills enable row level security;
alter table public.project_skills enable row level security;
alter table public.contact_messages enable row level security;
alter table public.page_views enable row level security;
alter table public.github_snapshot enable row level security;
alter table public.admin_users enable row level security;

-- ---------------------------------------------------------------------------
-- Admin: full access to everything except page_views (read only) and
-- contact_messages (no insert; visitors create those).
-- ---------------------------------------------------------------------------

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'site_settings', 'skill_categories', 'achievement_categories', 'project_types',
    'project_categories', 'skills', 'experiences', 'educations', 'achievements',
    'projects', 'project_images', 'experience_skills', 'achievement_skills',
    'project_skills', 'github_snapshot'
  ]
  loop
    execute format(
      'create policy "Admins manage %1$s" on public.%1$I
       for all to authenticated
       using ((select public.is_admin()))
       with check ((select public.is_admin()))',
      table_name
    );
  end loop;
end;
$$;

create policy "Admins read messages" on public.contact_messages
  for select to authenticated using ((select public.is_admin()));
create policy "Admins update messages" on public.contact_messages
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "Admins delete messages" on public.contact_messages
  for delete to authenticated using ((select public.is_admin()));

create policy "Admins read page views" on public.page_views
  for select to authenticated using ((select public.is_admin()));

create policy "Admins read the admin list" on public.admin_users
  for select to authenticated using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Public: published, non-archived content only
-- ---------------------------------------------------------------------------

create policy "Anyone reads site settings" on public.site_settings
  for select to anon, authenticated using (true);
create policy "Anyone reads the GitHub snapshot" on public.github_snapshot
  for select to anon, authenticated using (true);

create policy "Anyone reads skill categories" on public.skill_categories
  for select to anon, authenticated using (true);
create policy "Anyone reads achievement categories" on public.achievement_categories
  for select to anon, authenticated using (true);
create policy "Anyone reads project types" on public.project_types
  for select to anon, authenticated using (true);
create policy "Anyone reads project categories" on public.project_categories
  for select to anon, authenticated using (true);

do $$
declare
  table_name text;
begin
  foreach table_name in array array['skills', 'experiences', 'educations', 'achievements', 'projects']
  loop
    execute format(
      'create policy "Anyone reads published %1$s" on public.%1$I
       for select to anon, authenticated
       using (status = ''published'' and deleted_at is null)',
      table_name
    );
  end loop;
end;
$$;

-- Child rows follow their parent's visibility.
create policy "Anyone reads images of published projects" on public.project_images
  for select to anon, authenticated
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.status = 'published' and p.deleted_at is null
  ));

create policy "Anyone reads skills of published projects" on public.project_skills
  for select to anon, authenticated
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.status = 'published' and p.deleted_at is null
  ));

create policy "Anyone reads skills of published experiences" on public.experience_skills
  for select to anon, authenticated
  using (exists (
    select 1 from public.experiences e
    where e.id = experience_id and e.status = 'published' and e.deleted_at is null
  ));

create policy "Anyone reads skills of published achievements" on public.achievement_skills
  for select to anon, authenticated
  using (exists (
    select 1 from public.achievements a
    where a.id = achievement_id and a.status = 'published' and a.deleted_at is null
  ));

-- Visitors can send a message but never read the inbox.
create policy "Anyone sends a message" on public.contact_messages
  for insert to anon, authenticated
  with check (is_read = false and archived_at is null);

-- ---------------------------------------------------------------------------
-- Page views: inserted only through this function (no direct table access)
-- ---------------------------------------------------------------------------

/** Records one page view. The visitor hash is computed server-side (M6). */
create function public.record_page_view(
  view_path text,
  view_locale text,
  view_referrer_host text,
  view_visitor_hash text
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.page_views (path, locale, referrer_host, visitor_hash)
  values (left(view_path, 300), view_locale, left(view_referrer_host, 255), view_visitor_hash);
$$;

revoke execute on function public.record_page_view(text, text, text, text) from public;
grant execute on function public.record_page_view(text, text, text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Table privileges (RLS decides which rows)
-- ---------------------------------------------------------------------------

revoke all on all tables in schema public from anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
revoke select on public.contact_messages, public.page_views, public.admin_users from anon;
revoke insert, update, delete on public.page_views from authenticated;
revoke insert, update, delete on public.admin_users from authenticated;
grant insert on public.contact_messages to anon;
