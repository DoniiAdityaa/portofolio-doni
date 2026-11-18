# Personal Developer Portfolio — Master Blueprint

**Status:** Approved (2026-11-18) — ready to code
**Purpose:** a one-page summary of every final decision. The case documents hold the details and take precedence if anything here looks incomplete.

| Document | Covers | Status |
|---|---|---|
| `PORTFOLIO_PROJECT_GUIDE.md` | Orientation, rules for collaborators and AI assistants | Current |
| `CASE_BASED_PLANNING_WORKFLOW.docx` | Planning process and change control | Current |
| `CASE_01_PROJECT_PLANNING.md` / `.docx` | What to build (product) | Approved |
| `CASE_02_TECHNICAL_PLANNING.md` / `.docx` | How to build it (technical) | Approved |
| `CASE_03_DEVELOPMENT_PLANNING.md` / `.docx` | In what order (milestones) | Approved |

---

## 1. Product (Case 01)

- **Goal:** personal branding. **Headline:** Mobile Developer (Flutter). **Audience:** fellow developers. **Main action:** Download CV.
- **Languages:** English (default) and Indonesian, for UI and content, with fallback to the other language when a field is empty.
- **Look:** Playful Professional, dark only in v1. Palette Midnight Navy `#0B1120`, Charcoal `#111827`, Slate `#1F2937`, Sky Blue `#38BDF8`, Teal `#2DD4BF`, Amber `#F59E0B`. Fonts Space Grotesk / Inter / JetBrains Mono. Centered container with a sticky sidebar on desktop and tablet; top bar + drawer on phones. Rich animation (CR-01) that respects reduced motion.
- **UI/UX reference:** satriabahari.my.id, for look and feel only. Features follow Case 01.
- **Pages:**

| Page | Content |
|---|---|
| Home | Intro + Download CV → skills with icons, grouped by category → up to 3 featured projects |
| About | Full intro → Career timeline (Internship label; earlier company job kept as Draft) → Education timeline; uploaded logos |
| Achievement | Certificates and awards; filters by type and category; lightbox with Verify |
| Projects | Cards, category filter, search; detail page as a case study with gallery |
| Dashboard | GitHub contribution graph, pinned repositories, top languages |
| Contact | Form saved to the admin Inbox; Email, GitHub, LinkedIn, Instagram, X, TikTok |

- **Admin (English UI):** Overview with visitor count, Profile/Settings, Skills, Career, Education, Achievements, Projects, CV (EN/ID), Inbox, Trash. Draft/Published states; delete goes to Trash first; date order by default with manual reordering.
- **Not in v1:** light mode, comments/likes (deferred). Blog and testimonials are not planned.

## 2. Technology (Case 02)

- **Stack:** TypeScript (strict), Next.js App Router, React, Tailwind CSS, Supabase (PostgreSQL, Auth, Storage), hosted on Vercel.
- **Libraries:** next-intl, shadcn/ui, react-hook-form + zod, react-markdown, simple-icons, lucide-react, dnd-kit, motion.
- **Architecture:** public pages server-rendered and cached, refreshed when admin saves; admin always dynamic; GitHub fetched by a daily cron job into a stored snapshot; no secrets in the browser.
- **Bilingual data:** translatable fields stored as `{ "en": ..., "id": ... }` JSON.
- **Clean code:** feature-first folders (`features/<name>/components, queries, actions, schema, types`), separated layers, server components by default, small files, clear naming, no `any`, uniform action results, ESLint + Prettier.
- **Security:** single admin with sign-up disabled; route guard + action guard + Row Level Security; public bucket reads, admin-only writes; no SVG uploads.
- **Integrations:** own privacy-friendly visitor tracking (daily salted hash, no IP stored); contact form with honeypot and 3 messages/hour rate limit; Markdown editor with preview for case studies.
- **Targets:** WCAG AA, keyboard support, reduced motion, Lighthouse 90+.

## 3. Delivery (Case 03)

- **Process:** UI first, then backend. One branch per milestone, merged by Pull Request through CI (lint, type-check, unit tests, build, E2E). Local Supabase in Docker for development; one cloud project for production. `pnpm`.
- **Milestones:**

| # | Milestone |
|---|---|
| M0 | Repository and tooling |
| M1 | Design system and layout shell |
| M2 | Public pages with dummy data (typed like database rows) |
| M3 | Database, auth, storage (can run in parallel with M2) |
| M4 | Admin modules |
| M5 | Connect public site to real data |
| M6 | GitHub, visitor statistics, contact and inbox |
| M7 | Quality pass |
| M8 | Deployment, custom domain, post-launch checks |

## 4. Rules going forward

1. Build one milestone at a time; a milestone is done only when its checklist is complete and its Pull Request is merged.
2. New ideas or changes go through change control (workflow document) before being built.
3. Keep this blueprint and the case documents consistent whenever an approved decision changes.

**Next step:** complete the prerequisites in Case 03 §2, then start **M0 — Repository and tooling**.
