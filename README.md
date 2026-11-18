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
e2e/                  # Playwright tests
docs/                 # planning documents
```

## Workflow

- One branch per milestone or feature; merge into `main` through a Pull Request.
- CI runs lint, format check, type check, unit tests, and build on every Pull Request, plus E2E tests on Pull Requests to `main`.
- Secrets go in `.env.local` (git-ignored). Never commit real keys.

## Status

Milestone 1 — design system and layout shell. See [`CASE_03_DEVELOPMENT_PLANNING.md`](docs/CASE_03_DEVELOPMENT_PLANNING.md) for what comes next.
