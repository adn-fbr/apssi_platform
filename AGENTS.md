<!-- LOVABLE:BEGIN -->

## Source of truth and Git workflow

- VS Code is the primary development environment. GitHub is the canonical source of truth for application code, configuration, documentation, and database migration history.
- Use a feature branch for every change. Do not commit or push directly to `main`; use a reviewed pull request and required checks before merge.
- Review the complete diff before integration. Preserve unrelated user changes; never overwrite, discard, or revert them without explicit authorization.
- Never commit credentials, secret values, or local environment files. Do not request or expose passwords, tokens, API keys, connection strings, or Supabase `service_role` keys.
- Never rewrite published Git history or force-push. Changes pushed to a Lovable-connected branch may sync to Lovable, so keep that branch controlled and reviewable.

## Supabase and database ownership

- Supabase is the approved backend direction. Database schema and migration source files are maintained in this repository and reviewed through the VS Code/GitHub workflow.
- Supabase CLI is the intended database development tool, subject to verifying the supported version and current official documentation before use. Do not install tools, link a project, execute SQL, or apply migrations without the applicable task authorization.
- Every schema change requires a reviewed migration. Review migrations for backward compatibility, data safety, and security before approval.
- Production database changes require an explicit deployment plan and approval. Never modify a production database without explicit owner authorization.
- Never use a Supabase `service_role` key in browser code. Keep privileged credentials server-side and out of logs and source control.
- Consider and verify RLS for every exposed table containing application data. Server-side authorization and business validation remain required; RLS does not replace them.
- Do not infer that a Supabase project, environment, secret store, or deployment is configured merely because Supabase is approved.

## Lovable boundary

- Lovable may assist with UI design and frontend implementation. It is not the source of truth or authority for database schema, migration history, RLS policies, backend authorization, or production infrastructure.
- Review and reconcile every Lovable-generated change in Git before integration. Never merge generated changes automatically or assume they are safe.
- Do not allow uncontrolled concurrent edits to the same files from Lovable and VS Code. When Lovable is connected, use a controlled branch and reviewed pull request; do not use a direct-to-main sync as an approval path.
- Lovable connectors and secrets may support an approved UI preview workflow only. They do not establish production secret ownership or production infrastructure authority. Use only an owner-approved secret-management workflow; its production provider/owner is an architecture decision until documented.
- Preserve the existing Lovable AI gateway rule for model calls and keep `LOVABLE_API_KEY` out of browser code.

## Generated files and architecture

- Do not edit files whose headers identify them as automatically generated, including `src/routeTree.gen.ts`.
- Keep business domains separated. Avoid direct coupling between unrelated domain modules; use explicit interfaces and application-service boundaries where they serve a clear use case.
- Keep UI components separate from business rules and persistence logic. Do not add generic abstractions without a concrete use case.
- Do not invent product rules or acceptance criteria that are undefined in [the approved baseline](docs/product/BLUEPRINT-REQUIREMENT-BASELINE.md).
- Follow the approved workflow in [DEVELOPMENT-WORKFLOW.md](docs/architecture/DEVELOPMENT-WORKFLOW.md) and technical governance in [SUPABASE-ARCHITECTURE-DECISIONS.md](docs/architecture/SUPABASE-ARCHITECTURE-DECISIONS.md). These documents do not authorize application or database implementation by themselves.

<!-- LOVABLE:END -->

## Project structure

- App shell (mobile bottom tabs + desktop sidebar) lives in src/components/app-shell.tsx and wraps <Outlet /> in __root — so every page shares one nav.
- Prototype screens read static demo data from src/lib/mock-data.ts — swap for real queries when a backend is added.
- Shared UI primitives (Panel, Pill, Btn, Stat, Switch, Segmented) live in src/components/kit.tsx with cva variants on design tokens — keeps styling in the design system.
