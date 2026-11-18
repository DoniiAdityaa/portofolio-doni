<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules

- Read `docs/PORTFOLIO_MASTER_BLUEPRINT.md` first, then the Case document for the area you are touching.
- Follow the clean-code rules in `docs/CASE_02_TECHNICAL_PLANNING.md` §6.
- Work one milestone at a time (`docs/CASE_03_DEVELOPMENT_PLANNING.md`) on its own branch.
- Features or technical changes not in the approved docs need the owner's approval first (change control in the workflow document).
- Run `pnpm check` before opening a Pull Request.
