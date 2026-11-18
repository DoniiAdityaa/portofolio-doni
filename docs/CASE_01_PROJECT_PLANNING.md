# Case 01 — Project Planning

**Project:** Personal Developer Portfolio
**Status:** Approved (2026-11-18)
**Last updated:** 2026-11-18
**Depends on:** `PORTFOLIO_PROJECT_GUIDE.md`, `CASE_BASED_PLANNING_WORKFLOW.docx`

> **Decision labels used in this document**
> - **Confirmed**: approved by the owner during the Case 01 discussion.
> - **Proposed**: recommendation by the AI assistant that the owner has not yet approved. It becomes a requirement only after review.
> - **To be decided (TBD)**: still open.
>
> Technical choices (libraries, analytics tools, API details) belong to Case 02 and appear here only as product needs.

---

## 1. Goals and audience

| Item | Decision | Status |
|---|---|---|
| Main goal | Personal branding: show who the owner is, what they build, and how they work. | Confirmed |
| Headline role | **Mobile Developer (Flutter)** | Confirmed |
| Primary visitors | Fellow developers | Confirmed |
| Primary call to action | **Download CV** | Confirmed |
| Owner need | Manage all content through a private admin area without editing code. | Confirmed |

**Implications (Confirmed):**
- Because the audience is developers, project pages should show how things were built (case study, tech stack, repo link), and the GitHub Dashboard is a strong supporting page.
- The Download CV button appears in the Home hero and in the sidebar so it is reachable from every page.

## 2. Language

| Item | Decision | Status |
|---|---|---|
| Languages | Bilingual: English (EN) and Indonesian (ID), for both UI and content, from v1. | Confirmed |
| Default language | English | Confirmed |
| Language switch | A toggle in the sidebar (and in the mobile drawer). | Confirmed |
| Missing translation | If a field is empty in the selected language, show the other language's version. | Confirmed |
| URL per language | Each page has its own language URL, e.g. `/en/projects` and `/id/projects`. | Confirmed |
| CV per language | The CV is managed as two files (EN and ID); Download CV gives the file for the active language. | Confirmed |

**Admin impact:** every translatable text field has an EN and ID input. Non-text fields (dates, links, images, tech stack) are shared.

## 3. Visual identity

### 3.1 Direction (Confirmed, carried from Project Guide)
- **Playful Professional**: modern, clean, understated; playful through small details, not loud colors.
- **Dark mode only in v1.** Light mode is deferred (see §11).
- Avoid lavender and pastel-heavy styling.

### 3.2 Color palette (Confirmed)

| Role | Name | Hex |
|---|---|---|
| Main background | Midnight Navy | `#0B1120` |
| Sidebar / cards | Charcoal | `#111827` |
| Secondary surface | Slate | `#1F2937` |
| Primary accent | Sky Blue | `#38BDF8` |
| Secondary accent | Teal | `#2DD4BF` |
| Small highlight | Amber | `#F59E0B` |

Accents are used selectively; the interface stays mostly neutral and dark.

### 3.3 Typography (Confirmed)

| Use | Font |
|---|---|
| Headings | Space Grotesk |
| Body text | Inter |
| Code, tags, small technical accents | JetBrains Mono |
| Handwritten signature on About (CR-03) | Dancing Script |

### 3.4 Layout (Confirmed)
- **Desktop:** the sidebar and the page content sit together in one **centered container** (not stretched edge to edge); the sidebar stays in place (sticky) while the content scrolls. The sidebar contains a short profile (photo, name, role), navigation menu, social links, language toggle, and Download CV.
- **Mobile:** the sidebar becomes a **top bar** (name + menu button) with a **side drawer** holding the same content.
- **Tablet:** keeps the left sidebar. The top bar + drawer is used on phone widths only. The exact breakpoint is set during design-system work.

### 3.5 Playful details (Confirmed; animation scope widened by CR-01)
- Tech tags styled like code, e.g. `<flutter />`.
- **Rich animation (CR-01):** content fades/slides in on page load and on scroll, page transitions, a sliding active-menu indicator, hover lift on cards and skill chips, tilt on cards, and a looping typing effect in the Home hero. The page background stays one solid color (CR-02).
- Skill chips use a light tint of each brand's color (e.g. Flutter blue, Laravel red).
- Contribution graph colored with the Teal/Sky palette instead of GitHub green.
- All motion respects the visitor's "reduce motion" setting.

## 4. Public navigation (Confirmed)

1. Home
2. About
3. Achievement
4. Projects (+ Project detail)
5. Dashboard
6. Contact

The admin area is separate and is not linked from the public navigation.

---

## 5. Page specifications

### 5.1 Home

**Sections, in order (Confirmed):**
1. **Hero:** name, headline "Mobile Developer (Flutter)", short introduction (1–3 sentences), and a **Download CV** button.
2. **Tech skills:** shown with **icons**, not text only, and **grouped by category** (e.g. Mobile, Web, Backend, Tools).
3. **Featured projects:** projects marked "featured" in admin, with a link to the Projects page.

**Content notes:**
- Skill data is **dummy for now** (e.g. Flutter, Dart, Laravel, Next.js, Vue, and more) and will be replaced through admin. (Confirmed)
- Skill icons are **picked from an icon library** by name in admin, with no manual upload. (Confirmed)

**Acceptance criteria (Confirmed):**
- The hero, skills, and featured projects render in the active language.
- Download CV downloads the CV for the active language.
- Only published, featured projects appear, **maximum 3**.
- Skills appear under their category in the order set manually in admin.

**Empty states (Confirmed):**
- No featured projects: hide the section.
- No skills: hide the section.

### 5.2 About

**Sections, in scroll order (Confirmed):**
1. **Full introduction:** photo and personal story.
2. **Career:** vertical timeline, newest first. Internships are included and labeled **"Internship"**.
3. **Education:** vertical timeline, newest first.

**Fields per Career entry:** company name, company **logo (uploaded in admin)**, position, type (**Full-time / Internship / Freelance / Contract**), start–end date or "Present", **Responsibilities**, **What I learned**, and **Impact** (CR-04; each a list, one item per line), tech used (optional). Details open with "Show details".

**Current content (Confirmed):** only Internship entries are published for now. An earlier company job is kept as **Draft** (hidden from visitors) and can be published later from admin. Full-time and other types are available in admin for future use.

**Fields per Education entry:** institution name, institution **logo (uploaded in admin)**, degree/major, start–end date, notes (optional).

**Acceptance criteria (Confirmed):**
- Entries sort by start date, newest first, by default. The owner can override the order manually in admin.
- Entries without a logo show a neutral placeholder icon.
- An entry marked "Present" shows "Present" / "Sekarang" according to language.

**Empty states (Confirmed):** a timeline section with no published entries is hidden.

### 5.3 Achievement

**Types (Confirmed):** Certificates, and Competitions / Awards.

**Fields per achievement (Confirmed):**
- Title
- Type (Certificate / Award)
- Image of the certificate or award
- Issuer / organizer and issue date (expiry date optional)
- Credential link / credential ID
- Category, plus related skills taken from the skills list

**Interaction (Confirmed):** clicking an item opens a **lightbox/modal** with the enlarged image, the details, and a "Verify" button when a credential link exists.

**Acceptance criteria (Confirmed):**
- Visitors can search by title or issuer (CR-05) and filter by type (Certificate / Award) and by category.
- The Verify button opens the credential link in a new tab and is hidden when there is no link.
- The modal can be closed with a close button, the Esc key, or a click outside.

**Empty state (Confirmed):** a friendly message such as "Nothing here yet."

### 5.4 Projects

**List page (Confirmed):**
- Project cards: thumbnail, title, short description, tech stack icons, category, status.
- **Filter by category** (All / Mobile / Web / Backend; categories managed in admin).
- **Search** by title and description.

**Fields per project (Confirmed):**
- Title, short description, thumbnail
- Tech stack (picked from the skills list, shown with icons)
- Links: repository, live demo, Play Store / App Store (each optional)
- **Screenshot gallery**, supporting both portrait (mobile) and landscape (web) images
- Category, status (Completed / In Progress / Archived), period (start–end)
- Featured flag (used on Home)

**Detail page as a case study (Confirmed).** Sections:
1. Overview
2. Problem
3. Solution
4. Key features
5. Tech stack
6. Challenges & learnings
7. Gallery
8. Links (repo / demo / store)

**Acceptance criteria (Confirmed):**
- Search and category filter can be combined.
- Case-study sections left empty in admin are hidden on the detail page.
- Link buttons appear only for links that exist.
- The gallery opens images in a lightbox and handles mixed portrait/landscape images without distortion.
- Draft and archived-in-admin projects are not reachable publicly (their URL returns "not found").
- Projects sort by period, newest first, by default; the owner can override the order manually.

**Empty states (Confirmed):**
- No projects: friendly message.
- No search results: "No projects match your search" with a reset button.

### 5.5 Dashboard (GitHub)

**Content (Confirmed):**
- **Contribution graph:** contribution calendar for the past year.
- **Pinned repositories:** name, description, main language, stars, link.
- **Top languages:** share of the most-used languages.

**Acceptance criteria (Confirmed):**
- Data refreshes on a schedule rather than on every visit (frequency decided in Case 02).
- If GitHub data cannot be loaded, the page shows the last saved data or a clear fallback message. It never shows a broken page.
- The GitHub username is set in admin Site Settings.

### 5.6 Contact

**Content (Confirmed):**
- **Contact form:** name, email, message. Submissions are **saved and read in the admin Inbox**.
- **Contact info and social links:** Email, GitHub, LinkedIn, Instagram, X, TikTok. Each is optional and hidden when empty.

**Acceptance criteria (Confirmed):**
- The form validates required fields and email format before sending.
- After sending, the visitor sees a success message; on failure, an error message, and the typed message is not lost.
- Basic spam protection exists (method decided in Case 02).

---

## 6. Admin area (product level)

**General (Confirmed):**
- Private, owner-only access. A single owner account; no public sign-up.
- Same visual language as the public site.
- Content is managed through forms. Translatable text has EN and ID inputs.

**Content workflow (Confirmed):**
- Content has **Draft** and **Published** states. Only Published content is visible to the public.
- Deleting moves content to an **archive/trash** where it can be restored. Permanent deletion is a separate, explicit action.

**Admin modules for v1:**

| Module | Purpose | Status |
|---|---|---|
| Overview | Counts of projects, achievements, new messages, plus **visitor count**. | Confirmed |
| Profile & About | Introduction text, photo. | Confirmed |
| Skills | Add/edit skills: name, icon (picked from library), category, order. | Confirmed |
| Career | Timeline entries with logo upload. | Confirmed |
| Education | Timeline entries with logo upload. | Confirmed |
| Achievements | Certificates and awards with image upload. | Confirmed |
| Projects | Projects, case-study sections, gallery upload, featured flag. | Confirmed |
| Inbox | Read contact messages, mark as read, archive. | Confirmed |
| CV | Upload CV PDF in EN and ID. | Confirmed |
| Site Settings | Name, headline, photo, social links, GitHub username, SEO meta. | Confirmed |
| Trash / Archive | Restore or permanently delete archived content. | Confirmed |

**Visitor statistics (Confirmed):** the owner can see the **number of visitors** (unique visitors and page views, by day/week/month). The tool used is decided in Case 02.

**Acceptance criteria (Confirmed):**
- Every content type supports create, view, edit, publish/unpublish, archive, and restore.
- Saving shows a clear success or error message.
- Changes to published content appear on the public site shortly after saving (exact timing in Case 02).
- Uploads reject unsupported file types and files that are too large (limits in Case 02).

---

## 7. SEO and sharing (Confirmed)
- Each page has a title and description per language, editable in Site Settings (global) and per project.
- Project pages have a share image (thumbnail) for link previews on LinkedIn, X, and similar sites.

## 8. Responsive and accessibility expectations (Confirmed)
- Fully usable from 360px phone width to large desktop.
- Text contrast meets WCAG AA on the dark palette.
- All interactive elements are keyboard-accessible; images have alt text (alt text fields in admin).
- Motion respects reduced-motion preferences.

## 9. Content summary (what admin must manage)

| Content type | Translatable fields | Uploads |
|---|---|---|
| Profile / Site settings | Headline, short intro, full intro, SEO meta | Photo |
| Skill | Name (usually the same in both languages), category name | none (icon from library) |
| Career | Position, description | Company logo |
| Education | Degree/major, notes | Institution logo |
| Achievement | Title, description | Certificate/award image |
| Project | Title, short description, case-study sections | Thumbnail, gallery |
| CV | — | PDF (EN), PDF (ID) |
| Contact message | — (visitor input) | none |

## 10. Resolved decisions (from review on 2026-11-18)

| # | Item | Decision |
|---|---|---|
| 1 | Featured projects on Home | Maximum 3. |
| 2 | Ordering | Projects, Career, Education, Achievements sort by date (newest first) by default, with a manual override in admin. Skills are always ordered manually. |
| 3 | Career types | Full-time, Internship, Freelance, Contract. Only Internship is published for now. |
| 4 | Tablet layout | Tablet keeps the sidebar; drawer on phones only. |
| 5 | Project categories | Managed in admin. Defaults: Mobile, Web, Backend. |
| 6 | Achievement categories | Managed in admin. Defaults: Mobile, Web, Backend, Cloud, Soft Skill. |
| 7 | Playful details | Code-style tags, subtle hover motion, Teal/Sky contribution graph, all respecting reduced motion. |

No open product decisions remain.

## 10a. Change log

| ID | Date | Change | Approved |
|---|---|---|---|
| CR-01 | 2026-11-18 | Desktop layout becomes a centered container with a sticky sidebar (UI/UX reference style). Animation scope widened from "subtle" to rich animation (§3.5). Skill chips tinted with brand colors. Palette unchanged. | Owner, in chat |
| CR-02 | 2026-11-18 | Background is one solid color (no gradient glow). Hero typing effect loops. No emoji in the greeting. | Owner, in chat |
| CR-04 | 2026-11-18 | Career entries split their description into Responsibilities, What I learned, and Impact, each with an icon; career cards get creative hover animations. | Owner, in chat |
| CR-05 | 2026-11-18 | Achievement gets a search box (title and issuer). The certificate viewer becomes a wide split view: large image left, details panel right (stacked on phones), with entry animations. | Owner, in chat |
| CR-06 | 2026-11-18 | Projects have a **type** (platform: Web, Mobile) and a separate **category** (context: Personal project, Internship, Freelance, Competition), both managed in admin; the list filters by both in two labeled pill rows plus search. Every page ends with a "You've reached the end" marker and a back-to-top button. | Owner, in chat |
| CR-03 | 2026-11-18 | About signature uses the handwritten font Dancing Script in Sky, with a write-on animation and a pen-stroke underline. | Owner, in chat |

## 11. Out of scope

**Deferred to a later version:**
- Light mode
- Comments / likes on projects

**Not planned (removed from the plan):**
- Blog / articles
- Testimonials

---

## 12. Exit criteria for Case 01
- [x] Owner reviews all **Proposed** items and approves, changes, or rejects each one.
- [x] Open items in §10 are resolved or explicitly accepted as defaults.
- [x] Owner declares Case 01 **Approved** (2026-11-18).

After approval, Case 02 (Technical Planning) can begin.
