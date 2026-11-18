# Phase 1B P1-01D Fast Refresh Path and Importer Reconciliation

## 1. Document Control and Scope

- **Assessment date:** 2026-11-16
- **Repository:** `apssi_platform`
- **Source HEAD:** `6da46b5058d38ebff302b7934ce576d149573a08`
- **Work package:** B-11D-R1 — Warning Path & Importer Reconciliation
- **Status:** `READ-ONLY RECONCILIATION COMPLETE`
- **Authority:** This report supplements [P1-01C — Fast Refresh Warning Analysis](PHASE-1B-P1-01C-FAST-REFRESH-WARNING-ANALYSIS-REPORT.md). It proposes a future implementation scope only.

No application source, configuration, dependency, test, or build file was modified. B-11 remains unresolved.

## 2. Executive Summary

**VERIFIED — STATIC:** The warning path is `src/components/kit.tsx`. It exists and is tracked. `src/components/ui/kit.tsx` does not exist and is not tracked. There are exactly two `buttonVariants` declarations: one in each of `src/components/kit.tsx` and `src/components/ui/button.tsx`.

**VERIFIED — EXECUTED:** A fresh `npm run lint` at the expected HEAD completed with exit code 0 and reported 13 `react-refresh/only-export-components` warnings and 0 errors. The warning paths, symbols, and locations agree with P1-01C.

**RECOMMENDATION:** Keep the two variant systems separate. Candidate B-11E work can address the three shared variant functions through three pure `.ts` helper modules and update their known importers. Four same-module-only exports can be made private if maintainers confirm no out-of-repository import contract must be preserved. The six warned exports in `src/lib/roles.tsx` need a distinct, coordinated data/navigation/context split; do not combine this broader structural change with the small variant extraction.

## 3. Git Preflight Evidence

- **Branch:** `chore/phase-1a-governance-reconciliation`
- **HEAD:** `6da46b5058d38ebff302b7934ce576d149573a08`
- **Staged changes:** 0
- **Modified tracked paths:** exactly the eight pre-existing B-11C formatting paths: `src/components/role-page.tsx`, `src/routes/coach_.report.tsx`, `src/routes/coach_.teams.tsx`, `src/routes/organizer_.draw.tsx`, `src/routes/organizer_.results.tsx`, `src/routes/referee_.profile.tsx`, `src/routes/scout_.watchlist.tsx`, `src/routes/ssb_.roster.tsx`.
- **Untracked inventory recorded at the original R1 preflight:** Nine governance/audit paths were listed. The P1-01C report already existed and its SHA256 was recorded as `33A4D6EC0E7D76EDB78EAD7BE05F635F4D81A6E30AFA728BFAA1A7113B2D3F0F`, but that report was omitted from the recorded untracked-path listing/classification.
- **Subsequent R1A classification:** `docs/audit/PHASE-1B-P1-01C-FAST-REFRESH-WARNING-ANALYSIS-REPORT.md` is untracked and is not ignored by Git.
- **Historical inventory limitation:** Because the complete original Git classification was not recorded, the exact original untracked count cannot be independently reconstructed from this record.

Toolchain evidence: Node `v24.22.0`, npm `11.19.1`; local `node_modules` and ESLint executable were present. No install or registry access occurred.

## 4. `kit.tsx` Path Discrepancy Resolution

| Candidate path | Exists | Tracked | `buttonVariants` declaration | React component export | Finding |
| --- | --- | --- | --- | --- | --- |
| `src/components/kit.tsx` | Yes | Yes | Line 63: `const buttonVariants = cva(...)`; exported at line 96 | Yes; examples include `Panel`, `Pill`, `Btn`, `Avatar`, and others | This is the actual B-11D warning module. |
| `src/components/ui/kit.tsx` | No | No | None | None | This path is not a repository file. |
| `src/components/ui/button.tsx` | Yes | Yes | Line 7: `const buttonVariants = cva(...)`; exported at line 49 | Yes; `Button` is exported | A second, separate `buttonVariants` definition. |

P1-01C named the actual warning path correctly. There are two functions with the same symbol name in distinct modules, not duplicate declarations in one module. Their variant definitions and consumers are separate and must not be conflated.

## 5. Complete 13-Symbol Warning Reconciliation

The warning locations below are from the fresh `npm run lint` output. Declaration/export lines were checked in current source. Direct `export function`/`export const` declarations have one declaration-and-export line; export-list entries have separate locations.

| Warning location | Symbol and current source declaration/export | Kind | Module also exports React components? |
| --- | --- | --- | --- |
| `src/components/kit.tsx:96:10` | `buttonVariants`: declared line 63; exported line 96 | `cva` variant function | Yes |
| `src/components/ui/badge.tsx:32:17` | `badgeVariants`: declared line 6; export list line 32 | `cva` variant function | Yes (`Badge`) |
| `src/components/ui/button.tsx:49:18` | `buttonVariants`: declared line 7; export list line 49 | `cva` variant function | Yes (`Button`) |
| `src/components/ui/form.tsx:163:3` | `useFormField`: declared line 40; export list line 163 | React hook | Yes (form components) |
| `src/components/ui/navigation-menu.tsx:111:3` | `navigationMenuTriggerStyle`: declared line 37; export list line 111 | `cva` style function | Yes (navigation components) |
| `src/components/ui/sidebar.tsx:743:3` | `useSidebar`: declared line 40; export list line 743 | Context hook | Yes (sidebar components) |
| `src/components/ui/toggle.tsx:42:18` | `toggleVariants`: declared line 7; export list line 42 | `cva` variant function | Yes (`Toggle`) |
| `src/lib/roles.tsx:77:14` | `roles`: declared/exported line 77 | Role-data array | Yes (`RoleProvider`) |
| `src/lib/roles.tsx:210:14` | `roleById`: declared/exported line 210 | Function | Yes |
| `src/lib/roles.tsx:216:17` | `activeTab`: declared/exported line 216 | Function | Yes |
| `src/lib/roles.tsx:222:17` | `ownerOf`: declared/exported line 222 | Function | Yes |
| `src/lib/roles.tsx:234:17` | `resolveRole`: declared/exported line 234 | Function | Yes |
| `src/lib/roles.tsx:273:17` | `useRole`: declared/exported line 273 | React hook | Yes |

Fresh lint totals: 13 warnings, 0 errors. All warnings use `react-refresh/only-export-components`.

## 6. Complete In-Repository Importer Matrix

Classification key: **A** = confirmed runtime import/use; **B** = type-only import; **C** = re-export/intermediary; **D** = same-module use only; **E** = no in-repository consumer found. No re-export intermediary was found for these symbols.

| Warned symbol | In-repository consumers and evidence | Class |
| --- | --- | --- |
| `src/components/kit.tsx` `buttonVariants` | Local `Btn` use at line 93. Named imports: `src/routes/coach.tsx:19` (used at lines 99, 102); `src/routes/index.tsx:4` (used at lines 64, 67); `src/routes/referee.tsx:5` (used at line 113). | A, plus D |
| `src/components/ui/badge.tsx` `badgeVariants` | Used by `Badge` at line 29; no other source import or re-export found. | D |
| `src/components/ui/button.tsx` `buttonVariants` | Used by `Button` at line 43. Named imports: `src/components/ui/alert-dialog.tsx:5` (runtime uses at lines 87, 97); `src/components/ui/calendar.tsx:8` (runtime uses at lines 47, 52); `src/components/ui/pagination.tsx:5` (runtime use at line 38). | A, plus D |
| `src/components/ui/form.tsx` `useFormField` | Called by `FormLabel`, `FormControl`, `FormDescription`, and `FormMessage` in the same file at lines 90, 107, 125, and 142; no other source import/re-export found. | D |
| `src/components/ui/navigation-menu.tsx` `navigationMenuTriggerStyle` | Used by `NavigationMenuTrigger` at line 47; no other source import/re-export found. | D |
| `src/components/ui/sidebar.tsx` `useSidebar` | Used by sidebar components in the same file at lines 172, 264, 288, and 546; no other source import/re-export found. | D |
| `src/components/ui/toggle.tsx` `toggleVariants` | Used by `Toggle` at line 35. Imported by `src/components/ui/toggle-group.tsx:8`; used in type expressions and runtime class generation at line 42. | A, plus D |
| `src/lib/roles.tsx` `roles` | Runtime imports: `src/components/app-shell.tsx:6` (used at lines 32 and 43); `src/routes/account.tsx:15` (used at lines 47 and 81); `src/routes/index.tsx:6` (used at line 30). | A |
| `src/lib/roles.tsx` `roleById` | Used inside `roles.tsx` by `resolveRole` at line 235 and provider at line 267; no external source import found. | D |
| `src/lib/roles.tsx` `activeTab` | Runtime import `src/components/app-shell.tsx:6`; use at line 141. Also used within `roles.tsx` by `resolveRole` at line 235. | A, plus D |
| `src/lib/roles.tsx` `ownerOf` | Used within `roles.tsx` by `resolveRole` and provider initialization at lines 236 and 248; no external source import found. | D |
| `src/lib/roles.tsx` `resolveRole` | Runtime import `src/test/roles.test.ts:2`, with assertions at lines 6, 7, 11, and 12; also used within `roles.tsx` at lines 253 and 259. | A, plus D |
| `src/lib/roles.tsx` `useRole` | Runtime imports: `src/components/app-shell.tsx:6`; `src/routes/account.tsx:15`; `src/routes/notifications.tsx:17`; `src/routes/opportunities.tsx:7`; `src/routes/schedule.tsx:6`. Each invokes the hook in its module. | A |

### Related type imports

- `RoleId` is imported type-only by `src/components/app-shell.tsx:6`, `src/routes/account.tsx:15`, and via `import type` by `src/lib/mock-data.ts:325` and `src/lib/notifications.ts:2`.
- `AppPath` is imported type-only by `src/lib/notifications.ts:2`.
- `Role`, `NavTab`, and the `Role`-related declarations are defined/exported in `roles.tsx` but no external import of those specific types was found in the complete source search.
- `src/components/app-shell.tsx` imports `RoleProvider` as a runtime symbol from `roles.tsx`; its provider JSX use is at line 292.

The repository search found no namespace imports, re-exports from these modules, or dynamic imports targeting them. A dynamic import exists in `src/server.ts`, but it targets the TanStack server entry and is unrelated. No external consumers outside this repository were checked.

## 7. Module-Boundary and Context Ownership Assessment

### Unit A — Shared variant helpers

**Actual paths and definitions:**

- `src/components/kit.tsx:63` defines one `buttonVariants` using its own variant set; direct consumers are `Btn` and the coach, home, and referee routes.
- `src/components/ui/button.tsx:7` defines a different `buttonVariants`; consumers are `Button`, alert dialog, calendar, and pagination.
- `src/components/ui/toggle.tsx:7` defines `toggleVariants`; consumers are `Toggle` and toggle group.

These are three distinct helpers. Each can be moved without changing its definition into an independent non-React `.ts` module. Consumers should import from that helper module; re-exporting the helper from the component TSX module would retain the mixed-export warning. New helper modules must not import their corresponding component modules.

### Unit B — Module-local helpers and hooks

- **`badgeVariants`:** No external in-repository importer. Safe to make private within repository scope; retain the local constant used by `Badge`. External source-path consumers are unknown.
- **`useFormField`:** Only used by components in `form.tsx`. Safe to remove from the export list within repository scope; keep both contexts and hook with the form components. Extracting only the hook without moving its contexts would create a dependency problem.
- **`navigationMenuTriggerStyle`:** Only used by `NavigationMenuTrigger`. Safe to make private within repository scope; leave the `cva` value and its local use together.
- **`useSidebar`:** Only used by components in `sidebar.tsx`. Safe to remove from the export list within repository scope. Keep `SidebarContext`, its type, hook, and provider in the same module. If future reuse justifies extraction, move the context identity, type, hook, and provider dependency as one design; do not create a second context or a sidebar/context import cycle.

For all four, “safe to make private” means no in-repository external import was found and the app package is marked private; it is not proof that no untracked external consumer exists. If maintainers require these source exports, preserve them through a deliberate API decision and accept/document an exception rather than breaking an unverified contract.

### Unit C — Role module

Current dependency direction is: role definitions/data and exported types are declared in `roles.tsx`; pure lookup/path functions use that data; `RoleProvider` uses those functions and owns `RoleContext`; app modules import data, helpers, provider, hook, and types from the combined module.

A feasible, non-circular candidate separation is:

1. `src/lib/roles-data.ts` — `AppPath`, `RoleId`, `NavTab`, `Role` types and the `roles` array; imports Lucide icon values/types but no React.
2. `src/lib/role-navigation.ts` — pure `roleById`, `activeTab`, `ownerOf`, and `resolveRole`; depends on `roles-data.ts`, not React or the provider.
3. `src/lib/roles-context.ts` — the single `RoleContext`, its context type, and `useRole`; depends on `roles-data.ts` and React, contains no JSX.
4. Keep `src/lib/roles.tsx` as the React provider module; it imports the single context and data/navigation functions and exports `RoleProvider` plus any intentionally preserved type-only exports.

This is a proposal, not an implementation. Dependency direction must remain one-way; no new module may import back from `roles.tsx`. Because `useRole` and `roles` have several consumers, this unit requires coordinated import updates and role-resolution regression tests.

## 8. Validated B-11E Proposals

### Unit A — Shared variant helpers

**Definite candidate new files:**

- `src/components/kit-variants.ts` — non-React module containing the existing `buttonVariants` definition from `src/components/kit.tsx`; runtime consumers: `src/components/kit.tsx`, `src/routes/coach.tsx`, `src/routes/index.tsx`, `src/routes/referee.tsx`.
- `src/components/ui/button-variants.ts` — non-React module containing the existing UI button `buttonVariants`; runtime consumers: `src/components/ui/button.tsx`, `src/components/ui/alert-dialog.tsx`, `src/components/ui/calendar.tsx`, `src/components/ui/pagination.tsx`.
- `src/components/ui/toggle-variants.ts` — non-React module containing the existing `toggleVariants`; consumers: `src/components/ui/toggle.tsx`, `src/components/ui/toggle-group.tsx`.

**Definite existing files to modify:**

- `src/components/kit.tsx`, `src/components/ui/button.tsx`, `src/components/ui/toggle.tsx` to import helper values and stop exporting them.
- `src/routes/coach.tsx`, `src/routes/index.tsx`, `src/routes/referee.tsx`, `src/components/ui/alert-dialog.tsx`, `src/components/ui/calendar.tsx`, `src/components/ui/pagination.tsx`, and `src/components/ui/toggle-group.tsx` to import helpers from the new modules.

Expected reduction: 3 warnings. Import paths change; variant expressions and runtime output should remain identical. Keep helpers free of component imports to prevent cycles.

### Unit B — Make module-local helpers private

**Conditional existing files:** `src/components/ui/badge.tsx`, `src/components/ui/form.tsx`, `src/components/ui/navigation-menu.tsx`, `src/components/ui/sidebar.tsx`.

If maintainers accept the exports as internal-only, remove the corresponding helper name from each export statement/list while retaining its current local declaration and uses. This changes no known in-repository imports and is expected to remove 4 warnings. No new module is necessary. For `useSidebar`, keeping context and provider together is specifically recommended. If API preservation is required, defer that symbol or authorize a narrowly scoped exception; external consumer absence is not established by this search.

### Unit C — Separate role data, navigation, and context/provider

**Candidate new files:** `src/lib/roles-data.ts`, `src/lib/role-navigation.ts`, `src/lib/roles-context.ts`, with responsibilities defined in Section 7.

**Existing files expected to change:**

- `src/lib/roles.tsx` — retain provider/component responsibility; import single context and pure helpers; do not re-export runtime non-component values.
- `src/components/app-shell.tsx` — split imports for `activeTab`, `roles`, `RoleProvider`, `useRole`, and `RoleId`.
- `src/routes/account.tsx` — split `roles`, `useRole`, and `RoleId` imports.
- `src/routes/index.tsx` — import `roles` from the data module.
- `src/routes/notifications.tsx`, `src/routes/opportunities.tsx`, `src/routes/schedule.tsx` — import `useRole` from the context module.
- `src/lib/mock-data.ts`, `src/lib/notifications.ts` — redirect type-only imports for `RoleId`/`AppPath` to the data/types module, unless type-only re-exports are deliberately retained.
- `src/test/roles.test.ts` — import `resolveRole` from the pure navigation module.

Expected reduction: 6 warnings if all six warned runtime exports leave the TSX component module. Preserve the role list contents, types, route matching, ownership behavior, localStorage behavior, and single context identity. Review compatibility and module cycles before implementation.

## 9. Conditional Decisions and Unresolved Questions

- Are the four module-local helper exports intended to support consumers outside this repository? No external consumer search was performed.
- Should existing type import paths from `roles.tsx` be preserved with type-only re-exports, or should all consumers move to `roles-data.ts`? Type-only re-exports are ignored by this rule, but compatibility should be intentional.
- Confirm B-11E acceptance criteria for removing warnings versus preserving any deliberately mixed export contract. A narrow exception must name the exact export and document the HMR tradeoff.
- The suggested three-file roles split is a viable dependency design, but the owner/maintainer must approve its exact scope before implementation.

## 10. Required Future Implementation Verification

For each separately authorized B-11E unit:

- Review complete diff and ensure no role definitions, route behavior, component output, or runtime expressions change beyond moving identical definitions and updating imports.
- Confirm no circular imports and exactly one `RoleContext` instance.
- Run ESLint and record remaining warning IDs/counts; run TypeScript, unit tests, and build.
- For Unit C, run role-resolution and routing tests and verify role switching/provider behavior remains unchanged.
- If source module boundaries affect development HMR acceptance, test Fast Refresh explicitly; no interactive HMR verification was performed here.
- Do not claim overall B-11 release readiness from warning cleanup alone.

## 11. Explicit Exclusions

No source/import/export/configuration/test/dependency file was changed. No module was moved or created in application source. No warning suppression, formatter, autofix, install, test, build, browser automation, database, Supabase, deployment, staging, commit, or push operation occurred. This report is the only file created by B-11D-R1.

## 12. Final Assessment and Git Postflight Evidence

**Assessment:** `PASS — PATHS AND IMPORTERS RECONCILED; B-11E SCOPE READY`.

- The actual warning path is `src/components/kit.tsx`; `src/components/ui/kit.tsx` is absent. Two distinct `buttonVariants` declarations exist, in `src/components/kit.tsx` and `src/components/ui/button.tsx`.
- Fresh lint reproduced 13 warnings and 0 errors, exit code 0.
- Postflight branch/HEAD remain `chore/phase-1a-governance-reconciliation` / `6da46b5058d38ebff302b7934ce576d149573a08`; zero staged changes.
- Exactly the eight pre-existing B-11C tracked paths remain modified. Staged changes are zero.
- The verified current untracked inventory contains 11 files: nine other governance/audit documents, the P1-01C report, and this P1-01D report. R1A classified P1-01C as untracked and not ignored. The original R1 inventory listing omitted P1-01C, so this report does not claim that the exact original untracked count was independently reconstructed.
- B-11D report SHA256 remains `33A4D6EC0E7D76EDB78EAD7BE05F635F4D81A6E30AFA728BFAA1A7113B2D3F0F`.
- The report passed strict UTF-8, no-U+FFFD/no-mojibake, trailing-whitespace, section-presence, and warning-total checks. `git diff --check` was run; this report is untracked and therefore is not checked by Git's diff whitespace check.

This assessment is planning only. B-11 remains unresolved; no B-11E remediation has been performed or authorized by this report.
