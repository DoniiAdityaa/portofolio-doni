# Personal Developer Portfolio

Bilingual (EN/ID) developer portfolio with a private admin area for managing content.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Supabase · Vercel

## Planning documents

All product and technical decisions live in [`docs/`](docs/). Read them before contributing:

| Document                                                                  | Covers                                           |
| ------------------------------------------------------------------------- | ------------------------------------------------ |
| [`PORTFOLIO_MASTER_BLUEPRINT.md`](docs/PORTFOLIO_MASTER_BLUEPRINT.md)     | One-page summary of every final decision         |
| [`CASE_01_PROJECT_PLANNING.md`](docs/CASE_01_PROJECT_PLANNING.md)         | What to build                                    |
| [`CASE_02_TECHNICAL_PLANNING.md`](docs/CASE_02_TECHNICAL_PLANNING.md)     | How to build it, including clean-code rules (§6) |
| [`CASE_03_DEVELOPMENT_PLANNING.md`](docs/CASE_03_DEVELOPMENT_PLANNING.md) | Milestones and checklists                        |
| [`PORTFOLIO_PROJECT_GUIDE.md`](docs/PORTFOLIO_PROJECT_GUIDE.md)           | Orientation and rules for collaborators          |

## Requirements

- Node.js 24+
- pnpm (`corepack enable pnpm`)
- Docker and the Supabase CLI (needed from Milestone 3)

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000.

### Local database (Supabase)

```bash
pnpm db:start   # starts Postgres, Auth, Storage, and the API in Docker
```

Copy the printed API URL and publishable key into `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`. `pnpm db:reset` rebuilds the database
from `supabase/migrations/` and loads `supabase/seed.sql` (sample content).

Public sign-up is disabled. To get an admin account locally, create a user with the
Supabase CLI or Studio (`supabase start` without `-x` includes Studio), then add it as admin:

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'you@example.com';
```

Then sign in at http://localhost:3000/admin.

## Scripts

| Command                             | What it does                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------- |
| `pnpm dev`                          | Start the development server                                                          |
| `pnpm build` / `pnpm start`         | Production build / serve it                                                           |
| `pnpm lint` / `pnpm lint:fix`       | Check / fix lint issues                                                               |
| `pnpm format` / `pnpm format:check` | Format / check formatting with Prettier                                               |
| `pnpm typecheck`                    | TypeScript check                                                                      |
| `pnpm test` / `pnpm test:watch`     | Unit tests (Vitest)                                                                   |
| `pnpm test:e2e`                     | End-to-end tests (Playwright); run `pnpm exec playwright install chromium` once first |
| `pnpm check`                        | Lint, format check, type check, and unit tests in one go                              |
| `pnpm db:start` / `pnpm db:stop`    | Start / stop local Supabase (Docker)                                                  |
| `pnpm db:reset`                     | Rebuild the local database from migrations and seed                                   |
| `pnpm db:test`                      | Row Level Security tests (pgTAP, `supabase/tests/`)                                   |
| `pnpm db:types`                     | Regenerate `src/lib/supabase/database.types.ts` after a migration                     |

## Project structure

```
src/
├── app/              # routes: public site (app/[locale]), admin (app/admin), API (app/api)
├── features/         # one folder per domain: components, queries, actions, schema, types
├── components/ui/    # shared UI primitives
├── components/layout/
├── lib/              # config (validated env), supabase clients, i18n, utils
└── messages/         # UI translations (en.json, id.json)
supabase/migrations/  # versioned SQL schema changes
supabase/tests/       # database (RLS) tests
supabase/seed.sql     # sample content for local development
e2e/                  # Playwright tests
docs/                 # planning documents
```

## Workflow

- One branch per milestone or feature; merge into `main` through a Pull Request.
- CI runs lint, format check, type check, unit tests, and build on every Pull Request, plus E2E tests on Pull Requests to `main`.
- Secrets go in `.env.local` (git-ignored). Never commit real keys.

## Status

Milestone 5 — the public site reads real data from Supabase. See [`CASE_03_DEVELOPMENT_PLANNING.md`](docs/CASE_03_DEVELOPMENT_PLANNING.md) for what comes next.
