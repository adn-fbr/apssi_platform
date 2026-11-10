# Phase 0 — Repository Inventory

## 1. Scope and evidence

Inspected the supplied `mobile-first-web-main.zip` archive. Extracted source was inspected statically. No files in the original archive were modified.

**Evidence limitation:** the archive does not contain `.git`, `node_modules`, or runtime test output.

## 2. Technology inventory

| Area | Observed implementation | Assessment |
|---|---|---|
| UI framework | React 19 | Verified in `package.json` |
| Language | TypeScript 5.8 range | Verified in `package.json` |
| App framework | TanStack Start | Verified in dependencies and `src/start.ts` |
| Routing | TanStack Router, file-based | Verified in `src/routes/` and `src/routeTree.gen.ts` |
| Build | Vite 8 | Verified in dependencies and `vite.config.ts` |
| Styling | Tailwind CSS 4 | Verified in dependencies and `vite.config.ts` |
| UI primitives | Radix UI, local shadcn-style components | Verified in `src/components/ui/` |
| Form/validation libraries | React Hook Form, Zod, resolver | Installed dependencies; actual domain usage not established by this audit |
| Server-state library | TanStack Query | Installed and QueryClient wired in router/root |
| Charts | Recharts | Installed dependency; UI chart usage exists in prototype |
| Tests | Vitest, Testing Library, jsdom | Configured; only one test file found |
| Backend/database SDK | No Supabase, Prisma, Drizzle, or PostgreSQL client dependency observed | No concrete backend/database implementation identified in archive |
| Authentication | No authentication SDK or implemented auth flow identified | Not implemented / not evidenced |
| Package manager | `bun.lock`, README suggests npm | Tooling guidance inconsistent; owner decision required |

## 3. Repository structure

```text
.
├── AGENTS.md
├── README.md
├── package.json
├── bun.lock
├── roadmap.md
├── vite.config.ts
├── vitest.config.ts
└── src/
    ├── components/
    │   ├── app-shell.tsx
    │   ├── football-id-card.tsx
    │   ├── kit.tsx
    │   └── ui/
    ├── hooks/
    ├── lib/
    │   ├── mock-data.ts
    │   ├── roles.tsx
    │   ├── error-capture.ts
    │   └── ...
    ├── routes/
    ├── server.ts
    ├── start.ts
    ├── router.tsx
    ├── routeTree.gen.ts
    └── test/
```

## 4. Route inventory

The archive contains these route files:

- `/` — landing/home.
- `/player` — player passport and journey.
- `/parent` — parent dashboard and consent controls prototype.
- `/payments` — parent invoice/payment prototype.
- `/schedule` — shared schedule.
- `/opportunities` — trials/opportunities.
- `/ssb` — SSB dashboard, roster, attendance and training prototype.
- `/ssb/finance` — SSB finance prototype.
- `/coach` — coach dashboard.
- `/coach/assessment` — player assessment prototype.
- `/referee` — referee assignments.
- `/referee/report` — match event/report prototype.
- `/organizer` — tournament organizer operations.
- `/tournament` — tournament fixtures/results/standings.
- `/scout` — player search prototype.
- `/association` — regional/national dashboard prototype.

## 5. Source-level findings

- `src/lib/mock-data.ts` exports static sample records for player, journey, development, children, organizations, teams, roster, sessions, tournaments, fixtures, invoices, coach, referee, organizer, scout pool, and regional dashboard.
- 14 route files import `src/lib/mock-data.ts`; `src/components/football-id-card.tsx` also imports a mock player record.
- `src/lib/roles.tsx` defines eight UI roles and route/tab ownership. Role selection is persisted to `localStorage` using key `bolaid.role`.
- `src/components/app-shell.tsx` wraps the UI with `RoleProvider`, responsive navigation, and a role switcher.
- `src/start.ts` defines error middleware and CSRF middleware for TanStack server functions. This is useful framework plumbing, not evidence of authentication or domain authorization.
- `src/server.ts` wraps the TanStack server entry and normalizes SSR errors; it is not a domain API implementation.
- `src/test/app-routing.test.tsx` contains one route-matching test for `/`.

## 6. Runtime verification status

| Check | Result | Reason |
|---|---|---|
| Build | NOT RUN | `node_modules` absent; dependency installation not performed |
| Unit/integration tests | NOT RUN | `node_modules` absent |
| Lint | NOT RUN | `node_modules` absent |
| Typecheck | NOT RUN | No `typecheck` script in package scripts; dependencies absent |
| Browser/mobile responsive verification | NOT RUN | No runtime launched |
| Git history/branch audit | BLOCKED | `.git` absent from ZIP |

## 7. Findings requiring owner decision

1. Whether VS Code/Copilot becomes the primary source-code and migration workflow while Lovable remains connected as a UI editor.
2. Which package manager is canonical: Bun or npm. Lockfile and README currently disagree.
3. Whether the working product name `BolaID` is approved or remains provisional; Blueprint naming section does not lock a brand.
