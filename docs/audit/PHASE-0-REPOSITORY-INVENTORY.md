# Phase 0 Repository Inventory

**Audit date:** 2026-11-11  
**Scope:** Repository evidence available in this checkout. This is an implementation inventory, not a product acceptance sign-off.

## Status vocabulary

- **VERIFIED:** directly present in inspected repository evidence.
- **PARTIAL:** a UI or limited local implementation exists, but the complete production capability is not evidenced.
- **NOT IMPLEMENTED:** no implementation was found in the inspected repository.
- **UNKNOWN:** repository evidence is insufficient to determine the answer.
- **BLOCKED:** the question or verification depends on an unavailable artifact, tool, or owner decision.

Severity uses **Critical / High / Medium / Low** as prioritization, not as a claim of exploitability. Recommendations below are proposals, not approved architecture.

## Authority and source inventory

| Artifact | Status | Evidence / implication |
|---|---|---|
| Product requirement authority | **VERIFIED** | [BRB-001 Blueprint Requirement Baseline](../product/BLUEPRINT-REQUIREMENT-BASELINE.md) records the dated owner decision that Blueprint v0.1 is the sole initial requirements baseline; no separate PRD is assumed. The original Blueprint source itself is not separately present in this checkout. |
| Detailed user stories / acceptance criteria | **UNKNOWN** | BRB-001 explicitly lists detailed workflow criteria as undefined. Product compliance can only be traced to the 12 requirement themes, not per-screen acceptance tests. |
| Approved technical architecture | **UNKNOWN** | No approved architecture contract or ADR set was found. Architecture documents in this package are recommendations only. |
| `AGENTS.md` | **VERIFIED** | Lovable project rules and project-structure guidance are present. They prohibit manual edits to generated files and database migrations and specify static mock data as prototype input. |
| `README.md` / `roadmap.md` | **VERIFIED, supporting only** | README describes Lovable and local development. Roadmap identifies planned screens and role-adaptive navigation; neither is a PRD or an approved architecture. |
| Source code | **VERIFIED** | 16 file-based route definitions plus shared shell, mock data, components, and setup/configuration are present. Source demonstrates current behavior only. |

**Finding F0-01 | PARTIAL | High:** BRB-001 is available and resolves the source-of-truth question: Blueprint v0.1 is the sole initial product baseline and no separate PRD is assumed. However, the original Blueprint text, per-workflow acceptance criteria, and approved technical architecture are not in the live checkout. Record undefined requirements as `UNDEFINED` and unmade technical choices as `ARCHITECTURE DECISION REQUIRED`; request owner clarification rather than inferring them.

## Reconciliation with supplied preliminary package

The supplied preliminary package was based on `mobile-first-web-main.zip`, which lacked `.git` and described runtime verification as pending. Its copied audit documents have been removed after reconciliation; this directory now contains the canonical audit.

- The 16-route inventory and the central prototype/security findings are consistent with the preliminary package.
- The earlier Git-inspection blocker is resolved for this checkout. Remote `origin` is `https://github.com/adn-fbr/mobile-first-web.git`; `main`, `origin/main`, and `origin/HEAD` now point to `382555e` (`Update audit documentation with Git history verification and route source evidence`).
- The previous audit observed commit `5e8283e` (`Refactor code structure for improved readability and maintainability`, author `konitabee-byte`), whose stat contains documentation and `package-lock.json` but no `src/` paths. Its title did not describe the files in its stat. No commit, amend or push was performed by this audit agent.
- `AGENTS.md` states that the project is connected to Lovable and that commits pushed to the connected branch sync to Lovable. The Git remote itself does not prove dashboard configuration. No push or history rewrite was performed by this audit.
- The historical commit `dbb71da` is titled `Added bottom nav & dashboard PRD`, but its changed-file list contains `roadmap.md` and source files, not a PRD document. This does not override BRB-001's explicit decision not to assume a separate PRD.
- The live README uses npm instructions while the repository contains both `package-lock.json` and `bun.lock`/`bunfig.toml`; package-manager ownership remains `ARCHITECTURE DECISION REQUIRED`.
- The preliminary proposed architecture's PostgreSQL and versioned REST suggestions are not stated in BRB-001. They remain proposals, not product requirements or approved technical decisions.

**Git inspection:** `git rev-parse --show-toplevel` returned `D:/APSSI/PROYEK WEB/BolaID`; branch `main` is synchronized with `origin/main` at `382555e`. Current uncommitted changes are the audit-document edits/deletions from deduplication and a status `M` marker on generated `src/routeTree.gen.ts`. Its index and working-tree blob IDs match and `git diff` shows no content change; this audit did not edit it. No commit, push, rebase or history rewrite was performed by this audit agent.

## Repository structure

| Area | Observed contents | Assessment |
|---|---|---|
| `src/routes/` | Root, landing, player, parent, payments, schedule, opportunities, SSB, SSB finance, coach, assessment, referee, referee report, organizer, scout, association, tournament | **VERIFIED:** 16 routes, routed by TanStack file-based routing. The generated tree maps nested underscore route filenames to public paths. |
| `src/components/` | Application shell, Football ID card, radar chart, shared kit, Radix-based UI primitives | **VERIFIED:** reusable UI foundation; no evident domain service layer. |
| `src/lib/` | `mock-data.ts`, `roles.tsx`, utilities, error reporting/capture/page | **VERIFIED:** demo fixtures, client role state, shared utilities and error-handling helpers. |
| `src/hooks/` | `use-mobile.tsx` | **VERIFIED:** one custom hook directory entry; no domain or server-state hooks found. |
| `src/test/` | setup and one routing test | **VERIFIED:** small test footprint; only root route matching is explicitly tested by the discovered test file. |
| `public/` | favicon and robots.txt | **VERIFIED.** |
| root | Vite/TanStack Start, TypeScript, Vitest, ESLint, Prettier, Bun and npm configuration/lockfiles | **VERIFIED.** `bun.lock` and `package-lock.json` coexist; no CI workflow or deployment contract was found in the root inventory. |
| `supabase/`, `drizzle/`, Prisma/schema directories | Not present in visible repository inventory | **NOT IMPLEMENTED in this checkout.** Do not infer the existence or absence of externally managed services from this alone. |

Evidence: [AGENTS.md](../../AGENTS.md); [src/routes/README.md](../../src/routes/README.md); [src/routeTree.gen.ts](../../src/routeTree.gen.ts#L11-L74); [package.json](../../package.json); [src/test/app-routing.test.tsx](../../src/test/app-routing.test.tsx#L1-L17).

## Runtime and dependency inventory

| Concern | Observed technology / state | Status |
|---|---|---|
| UI | React 19, React DOM, Radix primitives, Tailwind CSS 4, Lucide icons, shared custom kit | **VERIFIED** in dependency manifest and source imports. |
| Routing / SSR | TanStack Router and TanStack Start; generated route tree; `src/server.ts` wraps the Start server entry | **VERIFIED.** This is an SSR-capable application shell, not evidence of business APIs. |
| Client state / data | React component state and a root TanStack Query provider; routes read static exports from `src/lib/mock-data.ts` | **PARTIAL:** query package/provider exist; no query hooks, query functions, or remote data source were found under `src`. |
| Forms / schemas | React Hook Form, Zod, and resolver packages are declared | **PARTIAL:** dependencies exist, but inspected business forms use direct state/native inputs and no route schema validation was found. |
| Tests | Vitest, jsdom, Testing Library and one routing test | **VERIFIED:** `npm run test` passed 1 test in 1 test file; the suite remains very small. |
| Server middleware | CSRF middleware is configured for Start server functions; generic error middleware is configured | **PARTIAL:** no server functions were found to protect or use. |
| Database / auth / storage / payment SDK | No corresponding client or schema dependency was found in `package.json` or `src` | **NOT IMPLEMENTED in inspected checkout**; external managed infrastructure remains **UNKNOWN**. |
| Package-manager setup | README documents npm; both npm and Bun lockfiles/configuration are present | **UNKNOWN:** repository does not establish a canonical package manager. |
| Environment config | No root `.env*` or `.dev.vars` files appeared in the root listing; no application `VITE_*` access was found in `src` | **UNKNOWN:** deployment secrets and dashboard configuration are outside this checkout. No secret values were inspected. |
Key evidence: [package.json](../../package.json#L1-L94); [package-lock.json](../../package-lock.json#L1-L5); [bun.lock](../../bun.lock); [src/router.tsx](../../src/router.tsx#L1-L17); [src/routes/__root.tsx](../../src/routes/__root.tsx#L78-L146); [src/start.ts](../../src/start.ts#L1-L33); [src/server.ts](../../src/server.ts#L1-L64).

## Application entry and request flow

1. `src/router.tsx` creates a TanStack router and a new `QueryClient` per router/request, with a comment explaining SSR cache isolation.
2. `src/start.ts` configures request error and CSRF middleware; its comments describe an auth middleware only as a future condition if Lovable Cloud/Supabase is connected.
3. `src/server.ts` delegates to the Start server entry and normalizes selected catastrophic SSR failures to an HTML error page.
4. `src/routes/__root.tsx` installs the query provider, shared `AppShell`, router outlet, and toaster.
5. Route pages render locally imported mock constants and local React state; no business data request or server action was found.

**Positive finding F0-02 | VERIFIED | Low:** QueryClient is instantiated per router, avoiding an obvious module-level cache shared between SSR requests. This does not establish row-level or tenant isolation.

## Routes and generated routing

The generated route tree declares all 16 routes, including `/coach/assessment`, `/referee/report`, and `/ssb/finance`. `src/routes/README.md` and the generated file state that the tree is auto-generated; do not hand-edit it. See [src/routeTree.gen.ts](../../src/routeTree.gen.ts#L11-L74) and [src/routes/README.md](../../src/routes/README.md#L1-L21). Detailed purposes, interactions, and workflow gaps are recorded in [PHASE-0-ROUTE-FUNCTIONAL-AUDIT.md](PHASE-0-ROUTE-FUNCTIONAL-AUDIT.md).

## Shared UI and client state

- `AppShell` wraps every route with desktop navigation, mobile navigation, role switcher, and a notification affordance. The role switcher chooses among eight hard-coded demo personas.
- `roles.tsx` uses URL-derived role selection and browser `localStorage` persistence on shared pages. This affects presentation/navigation only; it is not an authenticated identity or authorization boundary.
- `kit.tsx` defines `Panel`, `Pill`, `Btn`, `Stat`, `Switch`, `Segmented`, and other presentational building blocks.
- The single custom hook found is `use-mobile.tsx`; route state is generally defined within route components.
- `mock-data.ts` combines child/player identity, guardian, organization, roster, event, assessment, finance, scout, and region fixtures in one module, with a comment explicitly stating it is not persisted.

Evidence: [src/components/app-shell.tsx](../../src/components/app-shell.tsx#L18-L59); [src/lib/roles.tsx](../../src/lib/roles.tsx#L17-L250); [src/components/kit.tsx](../../src/components/kit.tsx#L1-L224); [src/lib/mock-data.ts](../../src/lib/mock-data.ts#L1-L8).

## Build, test, and environment configuration

- Scripts include development, production/development builds, preview, lint, formatting, and Vitest runs. TypeScript strictness is enabled with several additional strict checks.
- Vite uses the Lovable TanStack config wrapper; the config comments describe Cloudflare as a default Nitro target and caution against changing generated plugin setup. This is configuration evidence, not proof of the deployed target.
- Vitest uses jsdom and includes `src/**/*.{test,spec}.{ts,tsx}`.
- **Install:** the user reports `npm install` exited 0.
- **Test:** `npm run test` exited 0; Vitest 4.1.12 reported 1 test file and 1 test passed.
- **Lint:** `npm run lint` exited 1 with 8,745 errors and 13 warnings. The errors report Prettier `Delete ␍` line-ending findings; no autofix was run.
- **Build:** `npm run build` exited 0, including client, SSR and Nitro output. Vite warned that `vite-tsconfig-paths` overlaps native tsconfig path support; Nitro warned `inlineDynamicImports` is ignored with code splitting.
- **Typecheck:** no `typecheck` script exists. Direct `node_modules\\.bin\\tsc.cmd --noEmit` exited 0 without diagnostics.
- **Editor diagnostics:** `get_errors` returned "No errors found" for `src`; this is not a substitute for a compiler, lint, test, or production build run.
- **Environment:** no `.env*` or `.dev.vars` was visible at repository root; no deployment/dashboard secret inventory was available.

Evidence: [package.json](../../package.json#L5-L13); [vitest.config.ts](../../vitest.config.ts#L1-L16); [tsconfig.json](../../tsconfig.json#L1-L34); [vite.config.ts](../../vite.config.ts#L1-L15); [.gitignore](../../.gitignore#L1-L29).

**Finding F0-03 | PARTIAL | Medium:** Tests, build, and direct TypeScript checking completed successfully, but lint fails on widespread line-ending formatting findings. Resolve the lint/configuration issue under an owner-approved line-ending policy, then rerun lint; do not use broad autofix without reviewing its scope.

## Audit boundaries and unknowns

- The checkout cannot establish whether a Lovable-managed backend, external payment gateway, deployment secrets, or production logging configuration exists outside version control.
- No requirements were assumed from UI copy. For example, "verified," "consent," "real-time," "payment," or "audit trail" labels are not treated as proof of the underlying service.
- Git history was not rewritten by this audit agent. No application source or generated file was edited.
- No source, generated route tree, package manifest, database schema, or existing UI was changed.