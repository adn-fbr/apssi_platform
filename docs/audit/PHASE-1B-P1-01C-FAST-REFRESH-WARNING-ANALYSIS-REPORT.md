# Phase 1B P1-01C Fast Refresh Warning Analysis

## 1. Document Control and Scope

- **Assessment date:** 2026-11-16
- **Repository:** `apssi_platform`
- **Source revision:** `6da46b5058d38ebff302b7934ce576d149573a08`
- **Work package:** B-11D — Fast Refresh Warning Analysis & Remediation Planning
- **Status:** `READ-ONLY INVESTIGATION COMPLETE; REMEDIATION NOT PERFORMED`
- **Scope:** Reproduce current ESLint Fast Refresh warnings, inspect warned exports and in-repository import relationships, assess implementation options, and recommend a separately authorized remediation sequence.

No application, configuration, dependency, test, or build file was modified. B-11 remains unresolved.

## 2. Executive Summary

**VERIFIED — EXECUTED:** `npm run lint` completed with exit code 0, reporting 0 errors and 13 warnings. All 13 warnings use `react-refresh/only-export-components`, matching the B-11C expected warning count. The complete output is captured at `%TEMP%\apssi-b11d-lint-20261116-025048.txt`.

**VERIFIED — STATIC:** Each warning points to a non-component named export in a TSX module that also exports React components. The warned values are component-variant functions, a custom hook, a navigation style helper, role data, and pure role-routing functions. No warning indicates a demonstrated runtime failure. The rule flags a module-boundary pattern that can make Fast Refresh less reliable when a non-component export changes.

**RECOMMENDATION:** Separate reusable non-component exports from component modules where there are real cross-module consumers. For helpers used only within their own module, first decide whether those exports are intended module API; avoid gratuitous file splits. Keep `src/lib/roles.tsx` as a separately planned structural change because it has six warnings and many consumers.

## 3. Git and Tooling Preflight Evidence

**Source repository:** `D:\APSSI\PROYEK WEB\apssi_platform`

- Branch: `chore/phase-1a-governance-reconciliation`
- HEAD: `6da46b5058d38ebff302b7934ce576d149573a08`
- Pre-existing modified tracked files: exactly the eight B-11C formatting files listed below.
- Staged changes: 0
- Pre-existing untracked governance/audit files: exactly 9
- No other source path was changed during B-11D.

**Pre-existing B-11C modified paths:**

- `src/components/role-page.tsx`
- `src/routes/coach_.report.tsx`
- `src/routes/coach_.teams.tsx`
- `src/routes/organizer_.draw.tsx`
- `src/routes/organizer_.results.tsx`
- `src/routes/referee_.profile.tsx`
- `src/routes/scout_.watchlist.tsx`
- `src/routes/ssb_.roster.tsx`

**Pre-existing untracked paths:**

- `docs/audit/PHASE-1A-DOCUMENTATION-RECONCILIATION-REPORT.md`
- `docs/audit/PHASE-1A-RECONCILIATION-REPORT.md`
- `docs/audit/PHASE-1B-ENTRY-GATE.md`
- `docs/audit/PHASE-1B-OWNER-DECISION-REGISTER.md`
- `docs/audit/PHASE-1B-P1-00A-REPOSITORY-TOOLING-EVIDENCE-REPORT.md`
- `docs/audit/PHASE-1B-P1-01A-SECURITY-ACCESS-CONTROL-ARCHITECTURE.md`
- `docs/audit/PHASE-1B-P1-01B-LINT-FAILURE-ANALYSIS-REPORT.md`
- `docs/audit/PHASE-1B-WS-0-OWNER-DECISIONS.md`
- `docs/audit/PHASE-1B-WS-1-OWNER-DECISION-RECORD.md`

Toolchain: Node `v24.22.0`, npm `11.19.1`; `node_modules` and `node_modules/.bin/eslint.cmd` are present. No install or registry access occurred.

## 4. Fresh ESLint Execution Result

- **Command:** `npm run lint` (`eslint .`)
- **Working directory:** `D:\APSSI\PROYEK WEB\apssi_platform`
- **Git HEAD:** `6da46b5058d38ebff302b7934ce576d149573a08`
- **Result:** `PASS` as a command, exit code `0`
- **Diagnostics:** `13 warnings, 0 errors`; every warning is `react-refresh/only-export-components`.
- **Discrepancy from B-11C:** None in total count, rule ID, warning distribution, or reported locations.

## 5. Complete Warning Inventory

| File and location | Export reported | Export kind | Message |
| --- | --- | --- | --- |
| `src/components/kit.tsx:96:10` | `buttonVariants` | `cva` variant function | Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components. |
| `src/components/ui/badge.tsx:32:17` | `badgeVariants` | `cva` variant function | Same rule message. |
| `src/components/ui/button.tsx:49:18` | `buttonVariants` | `cva` variant function | Same rule message. |
| `src/components/ui/form.tsx:163:3` | `useFormField` | Custom React hook | Same rule message. |
| `src/components/ui/navigation-menu.tsx:111:3` | `navigationMenuTriggerStyle` | `cva` style function | Same rule message. |
| `src/components/ui/sidebar.tsx:743:3` | `useSidebar` | Custom React hook | Same rule message. |
| `src/components/ui/toggle.tsx:42:18` | `toggleVariants` | `cva` variant function | Same rule message. |
| `src/lib/roles.tsx:77:14` | `roles` | Role-data array | Same rule message. |
| `src/lib/roles.tsx:210:14` | `roleById` | Function | Same rule message. |
| `src/lib/roles.tsx:216:17` | `activeTab` | Function | Same rule message. |
| `src/lib/roles.tsx:222:17` | `ownerOf` | Function | Same rule message. |
| `src/lib/roles.tsx:234:17` | `resolveRole` | Function | Same rule message. |
| `src/lib/roles.tsx:273:17` | `useRole` | Custom React hook | Same rule message. |

Totals: 13 warnings in 8 modules; 0 lint errors.

## 6. Per-Module Root-Cause Analysis

| Module | Mixed exports and direct evidence | In-repository consumers | Static cause and implementation implications |
| --- | --- | --- | --- |
| [src/components/kit.tsx](../../src/components/kit.tsx) | Exports React components and `buttonVariants`, a `cva` function. | `buttonVariants` is imported by `src/routes/coach.tsx`, `src/routes/index.tsx`, and `src/routes/referee.tsx`. | A style utility is exported from a TSX component module. Extracting it requires updating three route imports and the component's own use. |
| [src/components/ui/badge.tsx](../../src/components/ui/badge.tsx) | Exports `Badge` and `badgeVariants`; the latter is a `cva` function. | No in-repository import of `badgeVariants` was found; `Badge` consumers are separate and do not use that helper. | Mixed component/variant export; helper appears module-local in this checkout, but deleting its export changes the module's importable surface. |
| [src/components/ui/button.tsx](../../src/components/ui/button.tsx) | Exports `Button`, `ButtonProps`, and `buttonVariants`; the variant helper is a `cva` function. | `buttonVariants` is imported by `src/components/ui/alert-dialog.tsx`, `calendar.tsx`, and `pagination.tsx`. | Shared style helper is a real cross-module dependency. A dedicated variants module and coordinated importer changes are the clearest boundary-preserving runtime option. |
| [src/components/ui/form.tsx](../../src/components/ui/form.tsx) | Exports form components and the `useFormField` hook. | `useFormField` is called by components in this same module; no external in-tree import was found. | Hook is exported alongside form components despite only internal use in this tree. Making it private is smallest only if this export is not an intended API; otherwise extract it and decide how compatibility is maintained. |
| [src/components/ui/navigation-menu.tsx](../../src/components/ui/navigation-menu.tsx) | Exports navigation components and `navigationMenuTriggerStyle`, a `cva` style function. | Helper is used within this same module; no external in-tree import was found. | Internal style function is exported with components. Same API caveat as other apparently local exports. |
| [src/components/ui/sidebar.tsx](../../src/components/ui/sidebar.tsx) | Exports sidebar components and `useSidebar`, a context hook. | Hook calls are inside `sidebar.tsx`; no external in-tree import was found. | Context hook is exported with the provider/components. Extracting context and hook requires care to avoid context duplication or a circular dependency. |
| [src/components/ui/toggle.tsx](../../src/components/ui/toggle.tsx) | Exports `Toggle` and `toggleVariants`, a `cva` function. | `toggleVariants` is imported by `src/components/ui/toggle-group.tsx`. | Shared variant utility is a cross-module dependency. A dedicated variants module can be consumed by both component modules without a cycle. |
| [src/lib/roles.tsx](../../src/lib/roles.tsx) | Exports role data, pure lookup/routing functions, a React provider, and a hook. Six runtime non-component exports are warned; type-only exports are not warned. | `roles` is used by `app-shell.tsx`, `routes/account.tsx`, and `routes/index.tsx`; `activeTab` by `app-shell.tsx`; `resolveRole` by this module and `src/test/roles.test.ts`; `useRole` by app shell and account/notifications/opportunities/schedule routes. `RoleId`, `AppPath`, and related types are imported by `src/lib/mock-data.ts`, `src/lib/notifications.ts`, and application modules. No external import of `roleById` or `ownerOf` was found. | This is a broader domain/data/provider boundary, not just one helper. A layered split must avoid circular imports and update multiple value and type importers. |

The `src/lib/roles.tsx` six warning locations are the only module with multiple warning diagnostics. Existing test coverage for role routing is limited to `src/test/roles.test.ts`; the rest of the listed cross-module links were established by source import/use inspection.

## 7. Import/Export Dependency Analysis

**Directly observed import relationships:**

- `kit.tsx` `buttonVariants` → coach dashboard, home route, referee dashboard.
- UI button `buttonVariants` → alert-dialog, calendar, pagination.
- `toggleVariants` → toggle-group.
- `roles` data → app shell, account route, home route.
- `activeTab` → app shell.
- `resolveRole` → role module and role unit test.
- `useRole` → app shell and account, notifications, opportunities, and schedule routes.
- Role/path types → mock data, notifications, and consumers that declare role-aware types.
- `badgeVariants`, `useFormField`, `navigationMenuTriggerStyle`, and `useSidebar` have no cross-module in-tree imports in the inspected source. This does not establish absence of out-of-repository consumers.

The application package is marked `private` in `package.json` and has no package `exports` map. That reduces npm package-public API exposure, but does not prove that internal import paths are unimportant to future application code or uninspected consumers. Any implementation should review complete imports before moving/removing exports.

## 8. Fast Refresh Technical Assessment

**VERIFIED — STATIC:** `eslint.config.js` enables `react-refresh/only-export-components` as a warning with `{ allowConstantExport: true }`. Installed `eslint-plugin-react-refresh` is version `0.4.26`. Its local rule implementation scans TSX exports, recognizes component names using a PascalCase naming heuristic, and reports non-component named exports when a module also exports React components. Type-only exports are skipped. The Vite-compatible `allowConstantExport` case is limited to primitive constant expressions; it does not cover the warned arrays, `cva` function values, or lower-camel helper/hook functions.

**TECHNICAL INTERPRETATION:** This is a genuine development-time HMR boundary safeguard, not evidence that production rendering or a specific Fast Refresh session currently fails. Mixed modules can cause refresh propagation or a broader reload when non-component exports change. No interactive Fast Refresh failure was reproduced in this read-only work package.

**Options:**

- Separate non-component exports into non-TSX helper/data modules and update consumers. This aligns module boundaries with the rule and preserves runtime behavior, but changes internal import paths.
- For a genuinely private, module-local helper, stop exporting it only after confirming the export is not an intended contract. This is the smallest source change but removes an importable export.
- Keep an intentionally public mixed export and use a narrowly scoped, documented rule exception only if preserving that contract is more important than enforcing the boundary for that particular symbol. This suppresses the warning rather than making the boundary component-only; do not apply a blanket suppression.

## 9. Remediation Options and Risk Comparison

| Option | Proposed files/importers | Expected reduction | Risk and verification |
| --- | --- | ---: | --- |
| Extract shared variant utilities | Add `src/components/kit-variants.ts`, `src/components/ui/button-variants.ts`, and `src/components/ui/toggle-variants.ts`; update `kit.tsx`, `ui/button.tsx`, `ui/toggle.tsx`, coach/index/referee routes, alert-dialog/calendar/pagination, and toggle-group. | 3 warnings | Low runtime risk if definitions are moved without alteration. Internal import paths change; avoid cycles by keeping variant modules independent of component modules. TypeScript, unit tests, lint, and build required. |
| Resolve apparently module-local exports | `ui/badge.tsx`, `ui/form.tsx`, `ui/navigation-menu.tsx`, `ui/sidebar.tsx`; either make the four helpers non-exported or move them to dedicated helper/context modules if their API is needed. | 4 warnings | No external in-tree importers found. Removing exports changes importable module surface; extracting context/hooks has more structural risk. Check actual import inventory and test the component modules before selecting. |
| Separate roles model, routing, and React provider | Candidate files: `src/lib/roles-data.ts`, `src/lib/role-navigation.ts`, and retained `src/lib/roles.tsx`; update app shell, account/home/notifications/opportunities/schedule modules, role-aware types in mock-data/notifications, and `src/test/roles.test.ts`. Exact split should be finalized before implementation. | 6 warnings | Moderate structural risk and broad import churn. Keep dependency direction data/types → pure navigation helpers → provider, avoiding reverse imports/cycles. Preserve role resolution behavior; run role tests, app routing tests, TypeScript, lint, and build. |
| Narrow rule exception | Only for a named export with an explicitly accepted mixed-module boundary; configure at the narrowest file/symbol scope supported. | Warning(s) for explicitly excepted names | No runtime change and preserves import paths, but weakens the HMR guarantee for the exception and leaves the structural concern. Document rationale; never disable the rule globally. |

No option was implemented or tested for runtime behavior in this work package. External consumer/API expectations remain unresolved.

## 10. Prioritized Implementation Plan

### Priority 1 — Minimal, low-risk boundary cleanup

1. Extract the three shared variant functions (`kit` button, UI button, and toggle) into pure helper modules and update their known importers. Keep the helper definitions identical and module dependencies one-way. Expected reduction: 3 warnings.
2. For `badgeVariants`, `useFormField`, `navigationMenuTriggerStyle`, and `useSidebar`, confirm whether their exports are intentionally supported. If they are internal-only, make the helpers private or extract them without re-exporting from the component TSX module. If an import contract must remain, defer to a narrowly justified exception rather than silently breaking it. Expected reduction: up to 4 warnings.

### Priority 2 — Structural role-module improvement

Separate role types/data and pure route-ownership/tab helpers from the React provider/hook module. Update all affected type/value imports and preserve existing role data and navigation semantics. Expected reduction: 6 warnings. Because this affects many consumers, implement and review as its own bounded unit.

### Priority 3 — Justified exceptions

Use only for an export whose mixed-module boundary is deliberately retained for compatibility or framework integration. Name the exact file/export and explain the HMR tradeoff. Do not blanket-disable `react-refresh/only-export-components` or suppress warnings broadly.

## 11. Required Future Verification Gates

For each separately authorized implementation unit:

- Review complete diff and confirm no logic/data changes beyond the agreed module move/import updates.
- Run `npm run lint`; record remaining warning count/rule IDs and require zero unintended errors.
- Run `tsc --noEmit --project tsconfig.json`.
- Run `npm run test`, including `src/test/roles.test.ts` for role-module changes.
- Run `npm run build` and report warnings.
- For changes to the Fast Refresh boundary, verify development HMR manually only if explicitly included in that work package; no such runtime verification occurred here.
- Do not claim B-11 release readiness from lint cleanup alone; CI, security, browser/E2E, and release evidence are separate gates.

## 12. Explicit Exclusions and Unresolved Decisions

- No source/configuration/test/dependency file was modified; no module was split and no export/import was changed.
- No warning suppression, formatter, autofix, install, dependency audit/remediation, test, build, browser automation, or deployment command was run in B-11D.
- No external package consumers or deployment/HMR runtime were inspected. Public compatibility beyond in-repository imports remains unknown.
- Whether internal helper exports are intended APIs, and whether a narrow rule exception is acceptable for any specific symbol, requires owner/maintainer decision.
- The nine npm audit vulnerabilities, B-07, B-09, and B-11 release/CI status remain outside scope and unresolved.

## 13. Final Assessment and Recommendation

**Assessment:** `PASS — REMEDIATION PLAN READY FOR OWNER REVIEW`.

Fresh lint evidence confirms 13 warnings and zero errors. All warning symbols and in-repository dependencies are identified. The smallest low-risk sequence is to separate the three shared variant helpers, then resolve the four apparently module-local exports after their API expectations are confirmed, and handle the six-warning roles module in a separate structural unit. Use a narrow documented exception only when preserving a specific mixed-module contract justifies the HMR tradeoff.

This report is analysis only. It does not claim that any warning has been fixed or that B-11 is resolved.

## 14. Final Integrity Verification

- **Source branch/HEAD:** `chore/phase-1a-governance-reconciliation` / `6da46b5058d38ebff302b7934ce576d149573a08`, unchanged at postflight.
- **Tracked changes:** Exactly the eight pre-existing B-11C formatting paths remain modified; no staged changes and no additional tracked path changes were introduced.
- **Untracked files:** The nine pre-existing governance/audit files remain; this report is the only additional untracked path.
- **Lint evidence:** `npm run lint` exited 0 with 13 Fast Refresh warnings and 0 errors; complete output remains at `%TEMP%\apssi-b11d-lint-20261116-025048.txt`.
- **Report quality:** Strict UTF-8 decoding passed; no U+FFFD or checked mojibake; no trailing whitespace. `git diff --check` was run; because the report is untracked, it does not inspect this report's contents.
