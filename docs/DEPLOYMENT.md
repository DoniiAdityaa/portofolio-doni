# Deployment guide (M8)

Production runs on **Vercel** (the Next.js app) and **Supabase Cloud** (database, auth, storage).
Local Docker Supabase is only for development. Steps marked **Owner** need your accounts, passwords,
or approvals; nobody else should do them.

```
Visitors → Vercel (Next.js) → Supabase Cloud (Postgres + Auth + Storage)
                  ↑ daily cron: /api/cron/github
```

## 1. Supabase production project (Owner)

1. On supabase.com → **New project**.
   - Name: `portofolio-doni` · Region: **Southeast Asia (Singapore)** · Plan: Free.
   - Database password: generate a strong one and keep it in your password manager.
2. **Authentication → Sign In / Providers → Email:** keep Email enabled, turn **off** "Allow new users
   to sign up" (Case 02 §8). The local `config.toml` setting does not apply to production.
3. **Authentication → URL Configuration:** Site URL = your Vercel URL (step 2), e.g.
   `https://portofolio-doni.vercel.app`.

## 2. Apply the database schema (Owner, in the project folder)

```bash
supabase login
supabase link --project-ref <project-ref>
supabase db push
```

- `<project-ref>` is in the project URL: `https://<project-ref>.supabase.co`.
- `link` asks for the database password from step 1.
- `db push` applies `supabase/migrations/` only. The seed (sample content) is **not** loaded, and
  `supabase/seed-media` is local-only.
- Before any later production migration, back up first: `supabase db dump -f backup.sql`.

## 3. Owner account

1. **Authentication → Users → Add user → Create new user:** your real email and a strong password,
   with "Auto Confirm User" checked.
2. **SQL Editor:**

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

## 4. Vercel project (Owner)

1. vercel.com → **Add New → Project** → import the GitHub repository `portofolio-doni`.
   Framework: Next.js (detected). Leave build settings as they are.
2. **Environment Variables** (Production), values from Supabase **Project Settings → API Keys / Data API**:

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://<your-project>.vercel.app` |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | the publishable key (`sb_publishable_…`) |
   | `SUPABASE_SECRET_KEY` | the secret key (`sb_secret_…`), **never** shared or committed |
   | `GITHUB_TOKEN` | fine-grained, read-only, public repositories |
   | `CRON_SECRET` | any long random string |
   | `VISITOR_HASH_SALT` | any long random string (different from `CRON_SECRET`) |

   Generate random strings with `openssl rand -hex 32`.
3. **Deploy.** The daily cron from `vercel.json` (`/api/cron/github`, 02:00 UTC) is picked up
   automatically; Vercel sends `CRON_SECRET` as the Bearer token.
4. If the final URL differs from `NEXT_PUBLIC_SITE_URL`, fix the variable and **Redeploy**.

## 5. Real content (Owner)

Sign in at `/admin` and fill in, in this order: Site settings (name, headline, roles, intros, photo,
links, GitHub username) → Skills → Career → Education → Achievements → Projects → CV. Then press
**Refresh now** on the Overview to fetch GitHub data.

## 6. Post-deployment checks (Case 03 M8)

- [ ] Every public page loads in EN and ID on the production URL.
- [ ] Admin login works; a test edit appears publicly, then is reverted.
- [ ] A contact form message reaches the Inbox.
- [ ] The cron job ran at least once and the Dashboard shows real GitHub data.
- [ ] The visitor count increases after a visit from another device.
- [ ] Link previews (LinkedIn/X) show the correct title and image.

## Rollback

- **App:** Vercel keeps every deployment; promote the last good one (Deployments → ⋯ → Promote).
- **Database:** test migrations locally first, dump a backup before pushing, and fix forward with a
  new migration.

## Custom domain later

Vercel → Project → Settings → Domains → add the domain and the DNS records it shows. Then update
`NEXT_PUBLIC_SITE_URL` and the Supabase Site URL, and redeploy. No code changes are needed.
