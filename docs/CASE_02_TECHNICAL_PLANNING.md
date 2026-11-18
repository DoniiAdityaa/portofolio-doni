# Case 02 — Technical Planning

**Project:** Personal Developer Portfolio
**Status:** Approved (2026-11-18)
**Last updated:** 2026-11-18
**Depends on:** `CASE_01_PROJECT_PLANNING.md` (Approved). This document describes **how** to build what Case 01 defines. It adds no product features.

> **Decision labels**
> - **Confirmed**: approved by the owner.
> - **Proposed**: AI recommendation awaiting the owner's review.
> - **TBD**: still open.
>
> Library versions are pinned during project setup (Case 03) to the latest stable release at that time.

---

## 1. Stack validation

| Layer | Choice | Role | Verdict | Status |
|---|---|---|---|---|
| Language | TypeScript (strict mode) | Type safety across UI, data, and forms | Fits | Confirmed |
| Framework | Next.js (App Router) | Public pages, admin pages, server logic, SEO | Fits: server rendering and caching suit a content site with an admin | Confirmed |
| UI library | React | Components | Comes with Next.js | Confirmed |
| Styling | Tailwind CSS | Design tokens from the Case 01 palette and fonts | Fits | Confirmed |
| Backend services | Supabase (PostgreSQL, Auth, Storage) | Database, admin login, file uploads, Row Level Security | Fits: covers every admin need without a custom backend | Confirmed |
| Hosting | **Vercel** | Deploys from GitHub, runs Next.js, scheduled jobs | Fits | **Confirmed** |

**Supporting libraries (Confirmed):**

| Need | Library | Why |
|---|---|---|
| Bilingual routing and UI text | `next-intl` | Standard i18n for the App Router, supports `/en` and `/id` prefixes |
| Accessible UI primitives (modal, dropdown, tabs, drawer) | `shadcn/ui` (built on Radix) | Code is copied into the project and styled with our tokens; keyboard and screen-reader support built in |
| Forms | `react-hook-form` + `zod` | One Zod schema validates both the admin form and the server action |
| Markdown rendering | `react-markdown` | Renders case-study Markdown safely (raw HTML is not rendered) |
| Skill/brand icons | `simple-icons` | Admin stores an icon slug such as `flutter`; the site renders the official icon |
| UI icons | `lucide-react` | Menu, arrows, close, and similar icons |
| Manual ordering in admin | `dnd-kit` | Drag-and-drop reordering |
| Theme (CR-08) | Own `data-theme` switch on `<html>` | CSS variables per theme; a tiny inline script applies the saved choice before paint (no flash); no extra library |
| Animation (CR-01) | `motion` (Framer Motion) | Page, scroll, hover, and layout animations; respects reduced motion through `MotionConfig` |

Nothing else is added without a clear need.

## 2. Confirmed technical decisions (from discussion 2026-11-18)

| Topic | Decision |
|---|---|
| Visitor statistics | **Own lightweight tracking in Supabase.** No third-party analytics. |
| Case-study editor | **Markdown with a preview** in admin. |
| Admin UI language | **English.** Content inputs still have EN and ID fields. |
| Hosting | **Vercel.** |

---

## 3. System architecture (Confirmed)

```
 Visitor ──► Vercel (Next.js)
               ├─ Public site  /en/... /id/...   (server-rendered, cached)
               ├─ Admin        /admin/...         (dynamic, login required)
               ├─ API routes   /api/track, /api/cron/*
               │
               ├──► Supabase
               │      ├─ PostgreSQL  (content, messages, page views, GitHub snapshot)
               │      ├─ Auth        (single owner account)
               │      └─ Storage     (images, CV PDFs)
               │
               └──► GitHub GraphQL API  (called only by the daily job, never by visitors)
```

**Principles:**
1. **Visitors read cached pages.** Public pages are rendered on the server and cached. Supabase is queried when the cache refreshes, not on every visit.
2. **Saving in admin refreshes the cache.** After a successful save, the server action invalidates the cache tags for that content type, so the public site updates within seconds.
3. **The admin area is always dynamic.** It always shows fresh data and is never cached.
4. **External APIs never block a page.** GitHub data is fetched by a scheduled job and stored; the Dashboard reads the stored copy.
5. **No secret ever reaches the browser.** Only the Supabase URL and publishable (anon) key are public.

## 4. Rendering and caching (Confirmed)

| Area | Rendering | Refresh |
|---|---|---|
| Home, About, Achievement, Projects, Project detail | Server-rendered, cached by content tag (e.g. `projects`, `skills`) | On admin save (tag invalidation) |
| Dashboard | Server-rendered from the stored GitHub snapshot | When the snapshot updates (daily job or manual refresh) |
| Contact | Static page plus a form that calls a server action | — |
| Admin | Dynamic, no cache | Every request |

## 5. Bilingual implementation (Confirmed)

- **Routing:** every public URL starts with a locale: `/en/...` or `/id/...`. Visiting `/` redirects to `/en` (default, Case 01).
- **UI text** (menus, buttons, labels, empty states): JSON message files `messages/en.json` and `messages/id.json`.
- **Content text** in the database: each translatable field is stored as JSON in one column:
  ```json
  { "en": "Pokémon encyclopedia app", "id": "Aplikasi ensiklopedia Pokémon" }
  ```
  - One shared TypeScript type `LocalizedText` and one Zod schema validate it everywhere.
  - One helper `localize(field, locale)` returns the active language and falls back to the other language when empty (Case 01 rule).
  - **Alternative considered:** separate columns such as `title_en` / `title_id`. Rejected because it doubles columns and form code for every field.
- **SEO:** each page outputs `hreflang` alternates for EN and ID and a per-language title and description.

## 6. Code organization and clean-code rules (Confirmed)

The owner asked for clean, tidy, readable code. These rules make that concrete.

### 6.1 Folder structure

```
src/
├── app/
│   ├── [locale]/                  # public site (en | id)
│   │   ├── layout.tsx             # sidebar shell
│   │   ├── page.tsx               # Home
│   │   ├── about/page.tsx
│   │   ├── achievements/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── projects/[slug]/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── contact/page.tsx
│   ├── admin/                     # private area (English UI)
│   │   ├── login/page.tsx
│   │   └── (protected)/...        # overview, projects, skills, ...
│   └── api/
│       ├── track/route.ts         # page-view tracking
│       └── cron/github/route.ts   # daily GitHub snapshot
├── features/                      # one folder per domain
│   ├── projects/
│   │   ├── components/            # ProjectCard, ProjectGallery, ProjectForm ...
│   │   ├── queries.ts             # read functions (server only)
│   │   ├── actions.ts             # server actions: create / update / publish / archive
│   │   ├── schema.ts              # zod schemas
│   │   └── types.ts
│   ├── skills/  achievements/  career/  education/
│   ├── contact/  analytics/  github/  settings/  cv/
├── components/
│   ├── ui/                        # shared primitives: Button, Card, Modal, Badge ...
│   └── layout/                    # Sidebar, MobileDrawer, PageHeader ...
├── lib/
│   ├── supabase/                  # server client, browser client, admin guard
│   ├── i18n/                      # next-intl config, localize()
│   └── utils/
├── messages/  en.json  id.json
└── styles/
supabase/
└── migrations/                    # every schema change as a versioned SQL file
```

### 6.2 Rules
1. **Feature-first.** Code for one domain lives in its feature folder. A feature never imports another feature's internals; shared code moves to `components/` or `lib/`.
2. **Clear layers.** Components display data. `queries.ts` reads data. `actions.ts` changes data. `schema.ts` validates. A component never writes a raw database query.
3. **Server by default.** Components are Server Components unless they need interaction (`"use client"` only where required: forms, modals, filters).
4. **Small units.** One component per file, one job per component. A file that grows past roughly 200 lines is a signal to split it.
5. **Naming.** `PascalCase` for components and types, `camelCase` for functions and variables, `kebab-case` for route folders, `snake_case` in the database. Names describe intent (`getPublishedProjects`, not `getData`).
6. **No magic values.** Colors, spacing, and fonts come from Tailwind tokens; limits such as "3 featured projects" are named constants.
7. **Strict types.** TypeScript `strict`, no `any`. Database types are generated from Supabase and reused.
8. **Consistent results.** Every server action returns `{ ok: true, data }` or `{ ok: false, error }`, so the admin UI handles success and failure the same way everywhere.
9. **Automatic formatting.** ESLint and Prettier run on save and in CI; code that fails lint is not merged.
10. **Comments explain why, not what.** Readable names replace explanatory comments.

## 7. Database design (Confirmed)

### 7.1 Shared conventions
Every content table has:
- `id uuid` primary key
- `status` — `draft` or `published` (Case 01: Draft/Published)
- `deleted_at timestamptz null` — set when archived to trash; `null` means active (Case 01: archive first)
- `sort_order int null` — manual order; when `null`, the default date order applies (Case 01: date default + manual override)
- `created_at`, `updated_at`

Translatable fields use type `jsonb` holding `{ "en": ..., "id": ... }` (see §5).

### 7.2 Tables

| Table | Key fields | Notes |
|---|---|---|
| `site_settings` | name, headline*, roles (jsonb array of localized texts, CR-08), short_intro*, full_intro*, photo_path, github_username, social_links (jsonb), seo_title*, seo_description*, cv_en_path, cv_id_path | Single row |
| `skill_categories` | name*, sort_order | e.g. Mobile, Web, Backend, Tools |
| `skills` | name, icon_slug, category_id → skill_categories, sort_order, status | Icon from `simple-icons` |
| `experiences` | company, logo_path, position*, type (`full_time`, `internship`, `freelance`, `contract`), start_date, end_date (null = Present), responsibilities*, learnings*, impact* (CR-04, one item per line), status | Career timeline |
| `experience_skills` | experience_id, skill_id | Optional "tech used" |
| `educations` | institution, logo_path, degree*, start_date, end_date, notes*, status | |
| `achievement_categories` | name*, sort_order | Defaults: Mobile, Web, Backend, Cloud, Soft Skill |
| `achievements` | title*, type (`certificate`, `award`), image_path, issuer, issued_at, expires_at, credential_url, credential_id, category_id, description*, status | |
| `achievement_skills` | achievement_id, skill_id | Related skills |
| `project_types` | name*, sort_order | Platform (CR-06). Defaults: Web, Mobile |
| `project_categories` | name*, sort_order | Context (CR-06). Defaults: Personal project, Internship, Freelance, Competition |
| `projects` | slug (unique), title*, summary*, thumbnail_path, type_id, category_id, project_status (`completed`, `in_progress`, `archived`), started_at, ended_at, is_featured, repo_url, demo_url, play_store_url, app_store_url, overview*, problem*, solution*, features*, challenges*, status | Case-study sections are Markdown |
| `project_skills` | project_id, skill_id | Tech stack |
| `project_images` | project_id, path, alt*, orientation (`portrait`, `landscape`), sort_order | Gallery |
| `contact_messages` | name, email, message, is_read, archived_at, created_at | Inbox |
| `page_views` | path, locale, referrer_host, visitor_hash, created_at | No IP or personal data stored |
| `github_snapshot` | data (jsonb), fetched_at | Single row, last good GitHub data |
| `admin_users` | user_id → auth.users | Who counts as admin |

`*` = translatable `jsonb` field.

**Note:** `project_status = archived` (the project itself is finished/abandoned, shown with a label) is different from `deleted_at` (moved to admin trash, hidden).

### 7.3 Indexes and constraints
- Unique `projects.slug`.
- Indexes on `status`, `deleted_at`, `sort_order`, and date columns used for ordering.
- Index on `page_views (created_at)` for daily/weekly/monthly counts.
- Check constraints for enum-like text fields, or Postgres enums.

### 7.4 Migrations and seed data
- Every change is a SQL file in `supabase/migrations/`, committed to Git. No manual schema edits in the dashboard.
- A seed file loads the **dummy skills** and default categories (Case 01: dummy skill data for now).

## 8. Authentication and authorization (Confirmed)

- **Login:** Supabase Auth with email and password. Public sign-up is **disabled**. The owner account is created once in the Supabase dashboard and added to `admin_users`.
- **Three layers of protection:**
  1. **Route guard:** requests to `/admin/(protected)/*` without an admin session redirect to `/admin/login`.
  2. **Server action guard:** every admin action checks the session and admin status before doing anything.
  3. **Row Level Security (final guard):** even if layers 1 or 2 had a bug, the database refuses unauthorized changes.
- **RLS policies:**

| Who | Content tables | `contact_messages` | `page_views` | `github_snapshot` |
|---|---|---|---|---|
| Public (anon) | Read rows where `status = 'published'` and `deleted_at is null` | Insert only (cannot read) | Insert only via a database function | Read |
| Admin | Full read and write | Read, update, archive | Read | Read, write |

- An SQL function `is_admin()` checks `auth.uid()` against `admin_users` and is used by every admin policy.

## 9. Storage (Confirmed)

| Bucket | Contents | Read | Write | Allowed files |
|---|---|---|---|---|
| `media` | Photo, logos, certificate images, project thumbnails and galleries | Public | Admin only | JPG, PNG, WebP, max 5 MB |
| `documents` | CV EN and CV ID | Public | Admin only | PDF, max 10 MB |

- Paths are organized by feature, e.g. `projects/{project_id}/gallery/{file}`.
- **SVG uploads are not allowed** (an SVG can contain scripts). Logos are uploaded as PNG or WebP.
- Images are displayed through Next.js image optimization (resized and served in modern formats).
- Archived content's files stay until the item is permanently deleted; permanent deletion removes its files too.
- **Accepted trade-off:** files of draft content are technically reachable by anyone who knows the exact random URL. This is acceptable for a portfolio.

## 10. Integrations

### 10.1 GitHub (Confirmed)
- **Data source:** GitHub GraphQL API (the contribution calendar is only available there), using a **read-only fine-grained token** stored as a server-side environment variable.
- **Data fetched:** contribution calendar (past year), pinned repositories (name, description, main language, stars, URL), and language totals across the owner's public repositories for Top Languages.
- **Schedule:** a Vercel Cron job calls `/api/cron/github` once a day (protected by a secret), saves the result into `github_snapshot`, and refreshes the Dashboard cache. Admin also has a **"Refresh now"** button.
- **Fallback:** if GitHub fails, the previous snapshot stays and the Dashboard shows it with a "last updated" time. If no snapshot exists yet, it shows a friendly message (Case 01 requirement).
- **Contribution graph:** drawn with our own SVG grid in Teal/Sky shades (Case 01 playful detail). No chart library needed.

### 10.2 Visitor statistics (Confirmed)
- A small client component on public pages sends `{ path, locale, referrer }` to `/api/track` once per page view.
- The server creates `visitor_hash = hash(daily_secret_salt + IP + user agent)`. The raw IP is **never stored**, and the salt rotates daily, so visitors cannot be tracked across days.
- Bots (by user agent) and logged-in admin visits are not counted.
- Admin Overview shows **unique visitors and page views** per day, week, and month (Case 01).
- Side benefit: regular database activity keeps the free Supabase project from pausing. The daily GitHub job also guarantees at least one database write per day.

### 10.3 Contact form (Confirmed)
- The form posts to a server action validated by Zod (name, email format, message length limits).
- Spam protection: a hidden **honeypot** field plus a **rate limit** (e.g. max 3 messages per visitor hash per hour).
- Messages are saved to `contact_messages` and appear in the admin Inbox.
- **Optional later:** add Cloudflare Turnstile if spam still gets through.

## 11. Error handling and logging (Confirmed)
- Each route segment has an error boundary with a friendly, translated error screen and a "try again" action; unknown URLs show a translated 404 page.
- Server actions never throw raw errors to the UI. They return a typed result, and the admin UI shows a toast.
- Server errors are logged with context (feature, action) to Vercel logs. Logs contain no personal data (no message bodies, no emails).
- Admin forms keep the user's input when saving fails.

## 12. Environment variables (Confirmed)

| Variable | Exposed to browser? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URLs, SEO |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Public (anon) key, safe because RLS enforces access |
| `SUPABASE_SECRET_KEY` | **No** | Used only by the cron job; never imported in client code |
| `GITHUB_TOKEN` | **No** | Read-only GitHub token |
| `CRON_SECRET` | **No** | Protects cron endpoints |
| `VISITOR_HASH_SALT` | **No** | Base secret for daily visitor hashing |

- A typed `env.ts` validates all variables at startup, so a missing variable fails fast with a clear message.
- `.env.local` is in `.gitignore`; a `.env.example` with empty values is committed.

## 13. Security checklist (Confirmed)
- [ ] RLS enabled on **every** table; no table is readable or writable without a policy.
- [ ] Secret keys used only in server files (enforced with the `server-only` package).
- [ ] Every admin server action re-checks admin status.
- [ ] All input validated server-side with Zod, even when the form already validated it.
- [ ] Markdown rendered without raw HTML.
- [ ] Upload type and size checked on the server and by bucket policy.
- [ ] Security headers set (Content-Security-Policy, X-Frame-Options, Referrer-Policy).
- [ ] Admin pages marked `noindex`.

## 14. Accessibility and performance targets (Confirmed)
- WCAG AA contrast with the Case 01 palette (to verify when tokens are built).
- Keyboard support and focus states on every interactive element; modals trap focus and close on Esc.
- `prefers-reduced-motion` disables hover and entry animations.
- Lighthouse target: 90+ for Performance, Accessibility, Best Practices, and SEO on public pages.
- Fonts loaded through `next/font` (no layout shift); images sized and lazy-loaded.

## 15. Resolved decisions (from review on 2026-11-18)

| # | Item | Decision |
|---|---|---|
| 1 | Contact form rate limit | Max **3 messages per visitor per hour**. |
| 2 | GitHub refresh | **Daily** Vercel Cron job, plus a manual "Refresh now" button in admin. |
| 3 | Domain | Use the free `*.vercel.app` address during development; choose and connect a custom domain during the deployment phase (Case 03). |

No open technical decisions remain.

## 16. Exit criteria for Case 02
- [x] Owner reviews all **Proposed** items.
- [x] Open items in §15 resolved or accepted.
- [x] Owner declares Case 02 **Approved** (2026-11-18).

After approval, Case 03 (Development Planning) can begin.
