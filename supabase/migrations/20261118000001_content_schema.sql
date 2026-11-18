-- Content schema (Case 02 §7). Every content table shares the §7.1 conventions:
-- uuid id, status, deleted_at (trash), sort_order (manual order), timestamps.
-- Translatable fields are jsonb shaped { "en": text, "id": text }.

-- ---------------------------------------------------------------------------
-- Enum-like types
-- ---------------------------------------------------------------------------

create type public.publication_status as enum ('draft', 'published');
create type public.experience_type as enum ('full_time', 'internship', 'freelance', 'contract');
create type public.achievement_type as enum ('certificate', 'award');
create type public.project_status as enum ('completed', 'in_progress', 'archived');
create type public.image_orientation as enum ('portrait', 'landscape');

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

/** True when the value is { "en": text, "id": text }; used by check constraints. */
create function public.is_localized_text(value jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select jsonb_typeof(value) = 'object'
    and jsonb_typeof(value -> 'en') = 'string'
    and jsonb_typeof(value -> 'id') = 'string';
$$;

/** Keeps updated_at current on every update. */
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Site settings (single row)
-- ---------------------------------------------------------------------------

create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  name text not null,
  headline jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(headline)),
  -- Roles that rotate under the name in the sidebar (CR-08): an array of localized texts.
  roles jsonb not null default '[]' check (jsonb_typeof(roles) = 'array'),
  short_intro jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(short_intro)),
  full_intro jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(full_intro)),
  photo_path text,
  github_username text,
  social_links jsonb not null default '[]' check (jsonb_typeof(social_links) = 'array'),
  seo_title jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(seo_title)),
  seo_description jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(seo_description)),
  cv_en_path text,
  cv_id_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Categories (managed in admin, always public)
-- ---------------------------------------------------------------------------

create table public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null check (public.is_localized_text(name)),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.achievement_categories (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null check (public.is_localized_text(name)),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Platform, e.g. Web, Mobile (CR-06).
create table public.project_types (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null check (public.is_localized_text(name)),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Context, e.g. Personal project, Internship (CR-06).
create table public.project_categories (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null check (public.is_localized_text(name)),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  -- A Simple Icons slug picked in admin.
  icon_slug text not null,
  category_id uuid not null references public.skill_categories (id) on delete restrict,
  status public.publication_status not null default 'draft',
  sort_order int,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  logo_path text,
  position jsonb not null check (public.is_localized_text(position)),
  type public.experience_type not null,
  start_date date not null,
  -- null means "Present".
  end_date date check (end_date is null or end_date >= start_date),
  -- CR-04: one item per line.
  responsibilities jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(responsibilities)),
  learnings jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(learnings)),
  impact jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(impact)),
  status public.publication_status not null default 'draft',
  sort_order int,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.educations (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  logo_path text,
  degree jsonb not null check (public.is_localized_text(degree)),
  start_date date not null,
  end_date date check (end_date is null or end_date >= start_date),
  notes jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(notes)),
  status public.publication_status not null default 'draft',
  sort_order int,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null check (public.is_localized_text(title)),
  type public.achievement_type not null,
  image_path text,
  issuer text not null,
  issued_at date not null,
  expires_at date check (expires_at is null or expires_at >= issued_at),
  credential_url text,
  credential_id text,
  category_id uuid references public.achievement_categories (id) on delete set null,
  description jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(description)),
  status public.publication_status not null default 'draft',
  sort_order int,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title jsonb not null check (public.is_localized_text(title)),
  summary jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(summary)),
  thumbnail_path text,
  type_id uuid not null references public.project_types (id) on delete restrict,
  category_id uuid not null references public.project_categories (id) on delete restrict,
  project_status public.project_status not null default 'in_progress',
  started_at date not null,
  ended_at date check (ended_at is null or ended_at >= started_at),
  is_featured boolean not null default false,
  repo_url text,
  demo_url text,
  play_store_url text,
  app_store_url text,
  -- Case-study sections in Markdown; empty sections are hidden.
  overview jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(overview)),
  problem jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(problem)),
  solution jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(solution)),
  features jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(features)),
  challenges jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(challenges)),
  status public.publication_status not null default 'draft',
  sort_order int,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  path text not null,
  alt jsonb not null default '{"en": "", "id": ""}' check (public.is_localized_text(alt)),
  orientation public.image_orientation not null default 'landscape',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Skill links
-- ---------------------------------------------------------------------------

create table public.experience_skills (
  experience_id uuid not null references public.experiences (id) on delete cascade,
  skill_id uuid not null references public.skills (id) on delete cascade,
  primary key (experience_id, skill_id)
);

create table public.achievement_skills (
  achievement_id uuid not null references public.achievements (id) on delete cascade,
  skill_id uuid not null references public.skills (id) on delete cascade,
  primary key (achievement_id, skill_id)
);

create table public.project_skills (
  project_id uuid not null references public.projects (id) on delete cascade,
  skill_id uuid not null references public.skills (id) on delete cascade,
  primary key (project_id, skill_id)
);

-- ---------------------------------------------------------------------------
-- Inbox, analytics, GitHub, admins
-- ---------------------------------------------------------------------------

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) <= 254),
  message text not null check (char_length(message) between 10 and 2000),
  is_read boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

-- No IP or personal data: visitor_hash is a daily salted hash (Case 02 §10.2).
create table public.page_views (
  id bigint generated always as identity primary key,
  path text not null,
  locale text not null check (locale in ('en', 'id')),
  referrer_host text,
  visitor_hash text not null,
  created_at timestamptz not null default now()
);

-- Last good GitHub data (single row), refreshed by the daily job in M6.
create table public.github_snapshot (
  id smallint primary key default 1 check (id = 1),
  data jsonb not null,
  fetched_at timestamptz not null default now()
);

-- Who counts as admin (Case 02 §8).
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes (Case 02 §7.3)
-- ---------------------------------------------------------------------------

create index skills_visibility_idx on public.skills (status, deleted_at);
create index skills_category_idx on public.skills (category_id);
create index experiences_visibility_idx on public.experiences (status, deleted_at);
create index experiences_order_idx on public.experiences (sort_order, start_date desc);
create index educations_visibility_idx on public.educations (status, deleted_at);
create index educations_order_idx on public.educations (sort_order, start_date desc);
create index achievements_visibility_idx on public.achievements (status, deleted_at);
create index achievements_order_idx on public.achievements (sort_order, issued_at desc);
create index projects_visibility_idx on public.projects (status, deleted_at);
create index projects_order_idx on public.projects (sort_order, started_at desc);
create index projects_featured_idx on public.projects (is_featured) where is_featured;
create index project_images_project_idx on public.project_images (project_id, sort_order);
create index experience_skills_skill_idx on public.experience_skills (skill_id);
create index achievement_skills_skill_idx on public.achievement_skills (skill_id);
create index project_skills_skill_idx on public.project_skills (skill_id);
create index contact_messages_inbox_idx on public.contact_messages (archived_at, created_at desc);
create index page_views_created_idx on public.page_views (created_at);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'site_settings', 'skill_categories', 'achievement_categories', 'project_types',
    'project_categories', 'skills', 'experiences', 'educations', 'achievements',
    'projects', 'project_images'
  ]
  loop
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()',
      table_name
    );
  end loop;
end;
$$;
