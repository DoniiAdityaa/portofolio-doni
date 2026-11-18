# Case 03 — Development Planning

**Project:** Personal Developer Portfolio
**Status:** Approved (2026-11-18)
**Last updated:** 2026-11-18
**Depends on:** `CASE_01_PROJECT_PLANNING.md` (Approved), `CASE_02_TECHNICAL_PLANNING.md` (Approved).
This document turns the approved product and technical plans into an ordered list of work. It adds no features and changes no technical decisions.

> **Decision labels:** **Confirmed** = approved by the owner · **Proposed** = AI recommendation awaiting review · **TBD** = open.

---

## 1. Process decisions

| Topic | Decision | Status |
|---|---|---|
| Build order | **UI first, then backend:** design system → public pages with dummy data → database and admin → connect real data → integrations | Confirmed |
| Git workflow | GitHub repository; **one branch per milestone or feature**, merged into `main` through a **Pull Request** that must pass CI. `main` is always deployable. | Confirmed |
| Testing level | **Balanced:** unit tests (Vitest) for helpers, schemas, and key logic; end-to-end tests (Playwright) for key flows | Confirmed |
| Supabase environments | **Local Supabase (Docker, via Supabase CLI) for development**; one free cloud project for production | Confirmed |
| Package manager | `pnpm` | Confirmed |
| CI | GitHub Actions; E2E tests run on every Pull Request to `main` | Confirmed |

## 2. Prerequisites (owner setup before Milestone 0)

- [ ] Node.js LTS installed
- [ ] `pnpm` installed
- [ ] Docker Desktop installed and running (needed by local Supabase)
- [ ] Supabase CLI installed
- [ ] Git configured; GitHub account ready
- [ ] Vercel account (free) linked to GitHub
- [ ] Supabase account (free); the production project is created in Milestone 8, not earlier
- [ ] GitHub fine-grained token (read-only, public data) — needed from Milestone 6

## 3. Milestone overview

| # | Milestone | Branch | Depends on | Result |
|---|---|---|---|---|
| M0 | Repository and tooling | `setup/project` | — | Empty app that builds, lints, and runs CI |
| M1 | Design system and layout shell | `feat/design-system` | M0 | Tokens, fonts, UI primitives, sidebar, drawer, EN/ID routing |
| M2 | Public pages with dummy data | `feat/public-pages` | M1 | All public pages look finished, using typed dummy data |
| M3 | Database, auth, and storage | `feat/database` | M0 | Migrations, RLS, seed, buckets, admin login and guards |
| M4 | Admin modules | `feat/admin` | M1, M3 | Full content management |
| M5 | Connect public site to real data | `feat/real-data` | M2, M4 | Public pages read Supabase with caching and revalidation |
| M6 | Integrations | `feat/integrations` | M3, M5 | GitHub dashboard, visitor statistics, contact form and inbox |
| M7 | Quality pass | `chore/quality` | M5, M6 | Tests, accessibility, responsive, security, performance checks |
| M8 | Deployment | `release/v1` | M7 | Live on Vercel with production Supabase |

M3 can be started in parallel with M2 because it does not touch UI files.

---

## 4. Milestones in detail

Each milestone lists tasks and a **completion checklist**. A milestone is done only when every item is checked and its Pull Request is merged.

### M0 — Repository and tooling
**Tasks**
1. Create the Next.js app (App Router, TypeScript, Tailwind) and the GitHub repository.
2. Turn on TypeScript `strict`; configure ESLint and Prettier (format on save, import ordering).
3. Create the folder skeleton from Case 02 §6.1 (`app/`, `features/`, `components/`, `lib/`, `messages/`, `supabase/`).
4. Add `env.ts` with validated environment variables and commit `.env.example`.
5. Add Vitest and Playwright with one sample test each.
6. Add GitHub Actions CI: install → lint → type-check → unit tests → build → E2E (with local Supabase) on Pull Requests to `main`.
7. Write `README.md`: how to install, run, test, and where the planning docs live.

**Completion checklist**
- [ ] `pnpm dev` runs; `pnpm build` succeeds.
- [ ] CI passes on a Pull Request.
- [ ] Lint and type-check report zero errors.
- [ ] No secrets in the repository.

### M1 — Design system and layout shell
**Tasks**
1. Tailwind tokens: Case 01 palette, spacing, radius, shadows.
2. Fonts via `next/font`: Space Grotesk (headings), Inter (body), JetBrains Mono (code/tags).
3. Install and theme `shadcn/ui` primitives: Button, Card, Badge, Dialog (modal), Sheet (drawer), Tabs, Input, Textarea, Select, Toast, Skeleton.
4. Project primitives: `CodeTag` (`<flutter />` style), `SkillIcon` (from `simple-icons`), `Timeline`, `SectionHeader`, `EmptyState`, `Lightbox`.
5. Layout: desktop/tablet **sidebar** (photo, name, role, menu, social links, language toggle, Download CV); phone **top bar + drawer**.
6. `next-intl` setup: `/en` and `/id` routes, `/` → `/en` redirect, `messages/en.json` and `messages/id.json`, `localize()` helper with fallback.
7. Motion: subtle hover effects; all motion disabled under `prefers-reduced-motion`.
8. Translated 404 and error pages.

**Completion checklist**
- [ ] Sidebar and drawer work at 360px, tablet, and desktop widths.
- [ ] Language toggle switches EN ↔ ID and keeps the current page.
- [ ] Every primitive is keyboard-usable with a visible focus state.
- [ ] Text contrast checked against WCAG AA.
- [ ] Unit tests for `localize()` (both languages, fallback, empty).
- [ ] Visual feel reviewed by the owner against the UI/UX reference.

### M2 — Public pages with dummy data
**Key rule:** dummy data uses the **same TypeScript types as the future database rows** and is returned from each feature's `queries.ts`. In M5, only `queries.ts` changes; pages and components stay untouched.

**Tasks**
1. Dummy data files per feature (skills with many dummy entries, career with internship entries, education, achievements, projects with galleries, settings).
2. **Home:** hero with intro and Download CV, skills grouped by category with icons, up to 3 featured projects.
3. **About:** full introduction → Career timeline (Internship label) → Education timeline, logos with placeholder fallback.
4. **Achievement:** grid, filters by type and category, lightbox with Verify button.
5. **Projects:** cards, category filter, search, empty states; **project detail** as a case study with gallery lightbox (portrait and landscape).
6. **Dashboard:** contribution graph (own SVG, Teal/Sky), pinned repositories, top languages, using dummy GitHub data shaped like the future snapshot.
7. **Contact:** form UI with validation (not yet saving), social links.
8. SEO metadata per page and language, `hreflang` alternates.
9. Skeleton loading states and empty states for every section.

**Completion checklist**
- [ ] Every page matches the Case 01 section order and acceptance criteria (UI side).
- [ ] Every page works in EN and ID.
- [ ] Empty states verified by temporarily emptying dummy data.
- [ ] E2E: change language; filter and search projects; open a project detail; open an achievement lightbox.
- [ ] Owner reviews all pages.

### M3 — Database, auth, and storage
**Tasks**
1. Start local Supabase; write migrations for all tables in Case 02 §7 with constraints and indexes.
2. `is_admin()` function and RLS policies from Case 02 §8 on every table.
3. Storage buckets `media` and `documents` with type and size limits and admin-only write.
4. Seed file: dummy skills, default skill/project/achievement categories, sample content.
5. Generate TypeScript types from the database.
6. Supabase clients in `lib/supabase/` (server, browser) and the `server-only` guard for secrets.
7. Admin login page, session handling, route guard for `/admin/(protected)`, and the `requireAdmin()` helper for server actions.

**Completion checklist**
- [ ] `supabase db reset` rebuilds the database from migrations and seed with no errors.
- [ ] RLS tests: anonymous users can read only published, non-archived rows; they cannot write content or read messages; the admin can do everything.
- [ ] Unauthenticated visits to admin pages redirect to login.
- [ ] Public sign-up is disabled.

### M4 — Admin modules
**Build the shared patterns first, then reuse them in every module.**

**Tasks — shared**
1. Admin layout (same visual language, English UI, `noindex`).
2. Reusable pieces: data table/list, form shell, bilingual field (EN/ID tabs), status badge, publish/unpublish, archive/restore, confirm dialog, image uploader (type/size checks, preview), drag-and-drop reorder (`dnd-kit`), Markdown editor with preview, skill picker, toast feedback.
3. Server action pattern: Zod validation → `requireAdmin()` → database write → cache tag invalidation → typed result.

**Tasks — modules** (each uses the shared pieces)
4. Site Settings and Profile (name, headline, intros, photo, social links, GitHub username, SEO meta).
5. Skills and skill categories (icon slug picker, manual order).
6. Career (type options, logo, Draft for the earlier company job) and Education.
7. Achievements and achievement categories.
8. Projects and project categories (case-study Markdown sections, gallery with orientation, featured flag max 3, slug).
9. CV (EN and ID PDF upload).
10. Inbox (read, mark as read, archive).
11. Trash (restore, permanent delete including files).
12. Overview (counts; visitor statistics card connected in M6).

**Completion checklist**
- [ ] Every content type supports create, view, edit, publish/unpublish, archive, restore, and permanent delete.
- [ ] Bilingual fields save and load both languages.
- [ ] Uploads reject wrong types (including SVG) and oversized files.
- [ ] Failed saves keep the form input and show an error.
- [ ] Featured projects are capped at 3.
- [ ] Unit tests for all Zod schemas; E2E: log in, create a project as draft, publish it, archive it, restore it.

### M5 — Connect public site to real data
**Tasks**
1. Replace dummy returns in each feature's `queries.ts` with Supabase queries (published, non-archived, correct order: manual first, then date).
2. Tag-based caching for each content type; invalidation already wired from M4 actions.
3. Project detail by slug; unpublished or archived slugs return 404.
4. Download CV serves the CV for the active language.
5. Remove dummy data files that are no longer used (keep the database seed).

**Completion checklist**
- [ ] A change saved in admin appears on the public site within seconds.
- [ ] Draft content never appears publicly.
- [ ] No page component changed apart from imports (confirms the M2 rule worked).
- [ ] All E2E tests from M2 still pass on real data.

### M6 — Integrations
**Tasks**
> **Note (2026-11-18, owner request):** the GitHub GraphQL fetcher and response mapper were built early, in M2. Until M6 the Dashboard fetches live and caches the result for one day (`use cache` + `cacheLife("days")`); M6 adds the stored snapshot, the daily cron job, and the admin "Refresh now" button on top of the same fetcher.

1. **GitHub:** GraphQL fetcher (contributions, pinned repositories, languages), `/api/cron/github` protected by `CRON_SECRET`, save to `github_snapshot`, Vercel Cron daily, admin "Refresh now", Dashboard reads the snapshot with "last updated" and fallback states.
2. **Visitor statistics:** tracking client component, `/api/track` with daily salted hash (no raw IP), bot and admin exclusion, database insert function, admin Overview chart for unique visitors and page views by day/week/month.
3. **Contact:** server action with Zod, honeypot, rate limit 3 per visitor per hour, save to `contact_messages`; Inbox shows new messages.

**Completion checklist**
- [ ] GitHub failure keeps the previous snapshot; an empty snapshot shows the friendly message.
- [ ] Cron endpoint rejects calls without the secret.
- [ ] Page views stored without IP addresses; admin visits not counted.
- [ ] The 4th message within an hour is rejected with a clear message; honeypot submissions are dropped silently.
- [ ] Unit tests for GitHub data mapping, visitor hashing, and rate limiting; E2E: send a contact message and see it in the Inbox.

### M7 — Quality pass
**Tasks and checklist**
- [ ] **Responsive:** every page checked at 360px, 768px, 1024px, and 1440px.
- [ ] **Accessibility:** keyboard-only walkthrough; screen-reader labels; alt text present; reduced motion respected; automated check (e.g. axe) with no serious issues.
- [ ] **Security:** Case 02 §13 checklist fully checked; dependency audit clean of high-severity issues.
- [ ] **Performance:** Lighthouse 90+ in all four categories on Home, Projects, and a project detail page.
- [ ] **Content:** both languages proofread; no leftover dummy text on public pages.
- [ ] **Code quality:** no `any`, no unused code, files follow Case 02 §6 rules; CI green.

### M8 — Deployment
**Tasks**
1. Create the production Supabase project; apply migrations (`supabase db push`); create buckets and policies; create the owner account and add it to `admin_users`; disable sign-up.
2. Create the Vercel project from the GitHub repository; set production environment variables; configure the daily cron job.
3. Choose and connect the custom domain (Case 02: decided at this stage); set `NEXT_PUBLIC_SITE_URL`.
4. Enter real content through admin (profile, skills, career, education, achievements, projects, CVs).
5. Add sitemap and robots rules (public pages indexed, admin excluded).

**Post-deployment checks**
- [ ] Every public page loads in EN and ID on the production domain.
- [ ] Admin login works; a test edit appears publicly, then is reverted.
- [ ] Contact form message reaches the Inbox.
- [ ] Cron job ran at least once and the Dashboard shows real GitHub data.
- [ ] Visitor count increases after a visit from another device.
- [ ] Link previews (LinkedIn/X) show the correct title and image.

**Rollback plan**
- **App:** Vercel keeps previous deployments; promote the last good deployment instantly.
- **Database:** migrations are tested locally first; before each production migration, export a backup (`supabase db dump`). Fixes are applied as a new forward migration.

---

## 5. Definition of Done (every task)
- Code follows Case 02 §6 clean-code rules.
- Lint, type-check, unit tests, and build pass in CI.
- Relevant tests added or updated.
- Works in EN and ID, on phone and desktop.
- Pull Request description explains what changed and why; owner approves the merge.

## 6. Working with AI assistants during development
- Work one milestone at a time on its own branch.
- Before starting a milestone, the assistant re-reads Case 01, Case 02, and this document.
- Any idea that adds or changes a feature or technical decision becomes a change request (see the workflow document) instead of being built silently.

## 7. Resolved decisions (from review on 2026-11-18)

| # | Item | Decision |
|---|---|---|
| 1 | Where E2E tests run | In CI on every Pull Request to `main`, with local Supabase started inside GitHub Actions. |
| 2 | Milestone order and checklists | M0–M8 as written. |

No open decisions remain.

## 8. Exit criteria for Case 03
- [x] Owner reviews all **Proposed** items.
- [x] Open items in §7 resolved or accepted.
- [x] Owner declares Case 03 **Approved** (2026-11-18).

After approval: create `PORTFOLIO_MASTER_BLUEPRINT.md` / `.docx`, then start Milestone 0.
