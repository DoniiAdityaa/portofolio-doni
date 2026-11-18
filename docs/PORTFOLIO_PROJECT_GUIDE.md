# Personal Developer Portfolio --- Project Guide

**Status:** Planning complete (Cases 01–03 Approved); ready to code\
**Document purpose:** This is the central orientation document for the
Personal Developer Portfolio project. It explains what the project is,
why it is being built, the decisions already agreed, and how planning
and development will proceed.

------------------------------------------------------------------------

## 1. What this document is for

Use this document as the shared starting point for the owner,
collaborators, and AI coding assistants.

It is intended to: - explain the purpose and boundaries of the portfolio
project; - preserve decisions already agreed during brainstorming; -
distinguish confirmed decisions from items that still need research or
approval; - prevent implementation from starting before the plan is
sufficiently clear; - give future AI assistants reliable context instead
of making them guess.

**Important:** This is not yet the final technical specification. Items
marked **To be decided** must be discussed, researched, and approved
before they are treated as requirements.

## 2. Project overview

The project is a personal developer portfolio website. It will present
the owner's profile, skills, education, career experience,
certificates/achievements, projects, GitHub activity, and contact
information.

A key requirement is that the owner must be able to add or update
portfolio content through a private admin area **without editing
application source code** for ordinary content changes.

Examples: - add a new project and its screenshots; - add a new
certificate; - update profile or skills; - update education or career
information; - publish or unpublish content, if that workflow is
approved.

The public website reads published content and presents it to visitors.
The admin area is used by the owner to manage content.

## 3. Current confirmed decisions

### 3.1 Product direction

-   Product: Personal Developer Portfolio.
-   Planning must be completed before coding begins.
-   The website should be maintainable and easy to extend.
-   Content updates should happen through an admin interface rather than
    source-code edits.

### 3.2 Visual direction

-   Design direction: **Playful Professional**.
-   Default appearance: **Dark**.
-   The design should feel modern, clean, understated, and playful
    through details---not loud or overly colorful.
-   Avoid lavender and pastel-heavy styling.
-   A left sidebar inspired by the reference supplied in the
    conversation is the current visual direction. The exact page layouts
    still need review.

### 3.3 Agreed initial color palette

  Role                Name            Hex
  ------------------- --------------- -----------
  Main background     Midnight Navy   `#0B1120`
  Sidebar / cards     Charcoal        `#111827`
  Secondary surface   Slate           `#1F2937`
  Primary accent      Sky Blue        `#38BDF8`
  Secondary accent    Teal            `#2DD4BF`
  Small highlight     Amber           `#F59E0B`

Use accent colors selectively. The visual direction should remain mostly
neutral and dark.

### 3.4 Initial public navigation

The currently proposed public navigation is: 1. Home 2. About 3.
Achievement 4. Projects 5. Dashboard 6. Contact

The names and exact routes may be refined during Case 01.

### 3.5 Initial technology preferences

The owner proposed this stack: - TypeScript - Next.js - React - Tailwind
CSS - Supabase - PostgreSQL

These are **proposed technologies**, not yet a finalized technical
architecture. Case 02 must validate the choices, responsibilities,
integration approach, security, and project structure.

### 3.6 Admin direction

-   The admin interface may use the same visual language as the public
    portfolio.
-   It remains a separate, private area with different permissions and
    capabilities.
-   The owner should be able to manage portfolio content through forms
    and content-management screens.

### 3.7 GitHub direction

GitHub Activity is planned as part of the Dashboard page. The precise
scope---such as contribution activity, repositories, pinned
repositories, followers, or recent activity---is still to be confirmed.

## 4. Initial feature inventory

This inventory records the current ideas. It is not a complete feature
specification yet.

### Home

Current idea: - introduce the owner; - show a concise role or
professional headline; - show selected skills; - potentially feature
selected projects.

Exact content order and components: **To be decided in Case 01.**

### About

Current idea: - fuller personal introduction; - career or work
experience; - education; - skills and other relevant background, if
approved.

Exact sections and content model: **To be decided in Case 01.**

### Achievement

Current idea: - display certificates.

Potential details such as issuer, issue date, credential link,
categories, filters, and certificate image handling: **To be decided in
Case 01.**

### Projects

Current idea: - list projects created by the owner; - provide a project
detail page; - show project images/screenshots and descriptions.

Potential fields and behavior---technology tags, category, status,
repository URL, live demo, featured status, draft/published state,
filters, and gallery behavior---must be decided in Case 01.

### Dashboard

Current idea: - GitHub Activity; - potentially pinned repositories.

The exact GitHub data and display requirements are **To be decided**.

### Contact

Current idea: - show the owner's contact information.

Whether to include a contact form, which social links to show, and how
form submissions are handled are **To be decided**.

### Private admin area

Required direction: - private owner access; - content management without
source-code edits; - visual consistency with the public site.

The exact admin modules, authentication flow, roles, and permissions are
**To be decided**.

## 5. Content-management requirement

The central functional requirement is:

> The owner can add, view, edit, and delete portfolio content through
> the admin interface, and the public website reflects the saved content
> according to its publication state.

This is commonly implemented using CRUD operations: - **Create:** add a
record; - **Read:** retrieve and display records; - **Update:** edit an
existing record; - **Delete:** remove or archive a record, depending on
the approved policy.

The final plan must define which content types are manageable, which
fields are required, how images/files are uploaded, and whether content
supports Draft and Published states.

## 6. Planning and delivery approach

The project uses three sequential planning cases:

### Case 01 --- Project Planning

Define the product and user experience: - goals and scope; - target
visitors and owner/admin needs; - visual identity and design rules; -
page structure; - page-by-page feature specification; - content
requirements and acceptance criteria.

### Case 02 --- Technical Planning

Translate the approved product requirements into a technical design: -
validate the technology stack; - system architecture; - clean-code and
modularity principles; - database design and relationships; -
authentication and authorization; - storage and API integrations; -
security, environment variables, and deployment considerations.

Database and GitHub integration research may be delegated to another AI
assistant, but its output must be reviewed and approved before it
becomes part of the project specification.

### Case 03 --- Development Planning

Prepare an implementation-ready plan: - implementation phases and task
order; - project setup; - design-system implementation; - public
pages; - backend and admin features; - GitHub integration; - testing and
quality checks; - deployment and post-deployment checks.

The roadmap created before Cases 01 and 02 are complete is only a draft.
The final roadmap must reflect the approved design and architecture.

## 7. Rules for AI assistants and collaborators

Any AI assistant working on this project should: 1. Read this guide and
the latest approved case documents first. 2. Treat only explicitly
approved decisions as requirements. 3. Never silently invent missing
product requirements. 4. Mark assumptions and recommendations clearly.
5. Ask for clarification when a decision affects scope, data, security,
or architecture. 6. Avoid coding while planning cases remain open,
unless the owner explicitly changes this rule. 7. Keep documentation
consistent when an approved decision changes. 8. Prefer simple,
maintainable solutions over unnecessary complexity. 9. Do not expose
secrets, service-role keys, private tokens, or credentials in
client-side code. 10. Do not claim a case is complete until the owner
approves it.

## 8. Definition of ready to code

Coding may begin only after: - Case 01 is complete and approved; - Case
02 is complete and approved; - Case 03 is complete and approved; - the
master blueprint reflects all approved decisions; - unresolved
assumptions that could materially affect implementation have been
resolved or explicitly accepted.

## 9. Current open decisions

The following are deliberately left open: - final structure and content
of each public page; - detailed behavior of every public feature; -
exact admin modules and workflows; - exact GitHub Activity scope; -
contact form and social contact options; - final technical architecture
and folder structure; - database schema, relationships, RLS policies,
and storage buckets; - authentication and authorization design; - final
implementation order and acceptance criteria; - hosting/deployment
provider and production configuration.

## 10. Change control

When a decision changes: 1. describe the requested change; 2. identify
which case and sections are affected; 3. assess impacts on other
approved decisions; 4. revise the relevant case document; 5. review and
approve the revision; 6. update the master blueprint and any dependent
documents.

Do not leave contradictory decisions in different documents.

------------------------------------------------------------------------

**Current project state:** Case 01 is **Approved** (2026-11-18). See
`CASE_01_PROJECT_PLANNING.md` / `.docx` for the final product
requirements; where they are more specific than this guide, Case 01
takes precedence. Case 02 (Technical Planning) is **Approved**
(2026-11-18): see `CASE_02_TECHNICAL_PLANNING.md` / `.docx`. Case 03
(Development Planning) is **Approved** (2026-11-18): see
`CASE_03_DEVELOPMENT_PLANNING.md` / `.docx`. All decisions are summarized
in `PORTFOLIO_MASTER_BLUEPRINT.md` / `.docx`. The project is **ready to
code**, starting with Milestone 0.
