# Phase 1B P1-01B Lint Failure Analysis

## 1. Document Control and Scope

- **Assessment date:** 2026-11-16
- **Repository:** `apssi_platform`
- **Source revision:** `6da46b5058d38ebff302b7934ce576d149573a08`
- **Work package:** B-11B - Lint Failure Analysis & Remediation Planning
- **Status:** `READ-ONLY INVESTIGATION COMPLETE; NO REMEDIATION PERFORMED`
- **Scope:** Reproduce and classify lint diagnostics in the verified disposable checkout; inspect related rules, formatting configuration, and affected modules; propose the smallest remediation work packages.

This report does not change B-11 status. B-11 remains an open release-readiness blocker pending owner review and separately authorized work.

## 2. B-11A Evidence and Current Reproduction

B-11A reported TypeScript PASS, unit tests PASS (2 files, 3 tests), production build PASS with warnings, and ESLint FAIL (97 errors, 13 warnings). The lint finding was described as predominantly Prettier diagnostics, with `react-refresh/only-export-components` among the warnings. The reported npm audit findings (7 moderate and 2 high) are out of scope and were not investigated here.

**Verified in this assessment:** The fresh lint run reproduced the same 97 errors, 13 warnings, and 16-file scope. All 97 errors are `prettier/prettier`; all 13 warnings are `react-refresh/only-export-components`. A separate read-only Prettier check failed on exactly the eight files carrying formatting errors.

## 3. Git and Disposable-Checkout Preflight

**Source repository:** `D:/APSSI/PROYEK WEB/apssi_platform`

- Branch: `chore/phase-1a-governance-reconciliation`
- HEAD: `6da46b5058d38ebff302b7934ce576d149573a08`
- Staged changes: 0
- Unstaged tracked changes: 0
- Original untracked governance files: 8

**Original untracked path set:**

- `docs/audit/PHASE-1A-DOCUMENTATION-RECONCILIATION-REPORT.md`
- `docs/audit/PHASE-1A-RECONCILIATION-REPORT.md`
- `docs/audit/PHASE-1B-ENTRY-GATE.md`
- `docs/audit/PHASE-1B-OWNER-DECISION-REGISTER.md`
- `docs/audit/PHASE-1B-P1-00A-REPOSITORY-TOOLING-EVIDENCE-REPORT.md`
- `docs/audit/PHASE-1B-P1-01A-SECURITY-ACCESS-CONTROL-ARCHITECTURE.md`
- `docs/audit/PHASE-1B-WS-0-OWNER-DECISIONS.md`
- `docs/audit/PHASE-1B-WS-1-OWNER-DECISION-RECORD.md`

**Disposable checkout:** `C:\Users\narham\AppData\Local\Temp\apssi-platform-b11a-6da46b5`; detached at the same HEAD with a clean Git worktree before and after the checks. Node `v24.22.0`; npm `11.19.1`; `node_modules` present. The source and disposable checkout were not repaired, reset, or reinstalled during B-11B.

## 4. ESLint Command and Diagnostic Summary

- **Command:** `npm run lint` (`eslint .`)
- **Working directory:** `C:\Users\narham\AppData\Local\Temp\apssi-platform-b11a-6da46b5`
- **HEAD:** `6da46b5058d38ebff302b7934ce576d149573a08`
- **Exit code:** `1` - `FAIL`
- **Summary:** `110 problems (97 errors, 13 warnings)`
- **Rule totals:** `prettier/prettier`: 97 errors; `react-refresh/only-export-components`: 13 warnings; no other ESLint rule diagnostics.
- **Complete captured output:** `%TEMP%\apssi-b11b-lint-20261116-023304.txt`

## 5. Complete Affected-File Inventory

| File | Errors | Warnings | Main finding |
| --- | ---: | ---: | --- |
| [src/components/role-page.tsx](../../src/components/role-page.tsx) | 2 | 0 | JSX attribute wrapping and line/indentation layout. |
| [src/routes/coach_.report.tsx](../../src/routes/coach_.report.tsx) | 13 | 0 | Nested stats/section arrays: indentation, object layout, quoted property keys, trailing commas. |
| [src/routes/coach_.teams.tsx](../../src/routes/coach_.teams.tsx) | 14 | 0 | Nested stats/section arrays and row objects: indentation, object layout, quoted property keys, trailing commas. |
| [src/routes/organizer_.draw.tsx](../../src/routes/organizer_.draw.tsx) | 13 | 0 | Nested arrays and row objects: indentation, object layout, quoted property keys, trailing commas. |
| [src/routes/organizer_.results.tsx](../../src/routes/organizer_.results.tsx) | 14 | 0 | Nested arrays and row objects: indentation, object layout, quoted property keys, trailing commas. |
| [src/routes/referee_.profile.tsx](../../src/routes/referee_.profile.tsx) | 13 | 0 | Nested arrays and row objects: indentation, object layout, quoted property keys, trailing commas. |
| [src/routes/scout_.watchlist.tsx](../../src/routes/scout_.watchlist.tsx) | 13 | 0 | Nested arrays and row objects: indentation, object layout, quoted property keys, trailing commas. |
| [src/routes/ssb_.roster.tsx](../../src/routes/ssb_.roster.tsx) | 15 | 0 | Nested arrays and row objects: indentation, object layout, quoted property keys, trailing commas. |
| [src/components/kit.tsx](../../src/components/kit.tsx) | 0 | 1 | `buttonVariants` exported with component exports. |
| [src/components/ui/badge.tsx](../../src/components/ui/badge.tsx) | 0 | 1 | `badgeVariants` exported with `Badge`. |
| [src/components/ui/button.tsx](../../src/components/ui/button.tsx) | 0 | 1 | `buttonVariants` exported with `Button`. |
| [src/components/ui/form.tsx](../../src/components/ui/form.tsx) | 0 | 1 | `useFormField` exported with form components. |
| [src/components/ui/navigation-menu.tsx](../../src/components/ui/navigation-menu.tsx) | 0 | 1 | `navigationMenuTriggerStyle` exported with navigation components. |
| [src/components/ui/sidebar.tsx](../../src/components/ui/sidebar.tsx) | 0 | 1 | `useSidebar` exported with sidebar components. |
| [src/components/ui/toggle.tsx](../../src/components/ui/toggle.tsx) | 0 | 1 | `toggleVariants` exported with `Toggle`. |
| [src/lib/roles.tsx](../../src/lib/roles.tsx) | 0 | 6 | Role data, helper functions, a custom hook, and `RoleProvider` share one module. |
| **Total** | **97** | **13** | **16 files** |

## 6. ESLint and Prettier Configuration Findings

**Verified static configuration:**

- [package.json](../../package.json) defines `lint` as `eslint .` and `format` as `prettier --write .`. The formatter script is write-mode and may modify many repository files; it is not a check-only command.
- No `format:check` script exists. The read-only command used in this investigation was `prettier --check` on the eight formatting-error files; it exited 1 and identified exactly those eight files.
- [eslint.config.js](../../eslint.config.js) imports `eslint-plugin-prettier/recommended`. The installed recommended config combines `eslint-config-prettier` rules with `prettier/prettier: error`; therefore Prettier differences are emitted as ESLint errors. There is no evidence of a separate conflicting stylistic ESLint rule causing these 97 errors.
- [`.prettierrc`](../../.prettierrc) specifies `printWidth: 100`, semicolons, double quotes, and `trailingComma: all`. [`.prettierignore`](../../.prettierignore) excludes generated/build paths, `package-lock.json`, and `routeTree.gen.ts`.
- Installed local versions in the disposable checkout: ESLint `9.39.5`, Prettier `3.9.10`, `eslint-plugin-prettier` `5.5.7`, and `eslint-plugin-react-refresh` `0.4.26`. These are local package metadata, not a separate dependency audit.

**Analysis:** The lint failure is formatter enforcement, not a set of 97 independent code-quality rules. In the seven route files, repeated differences are nested-array indentation, object literals written with quoted property keys, compact one-line objects, missing trailing commas, and the resulting Prettier line wrapping. `role-page.tsx` has JSX/layout wrapping differences. No import-order, quote-style, semicolon, or non-formatting error rule appeared in this lint run.

## 7. Formatting-Error Classification

All 97 errors are `prettier/prettier`; no other error category was observed. The check-only Prettier run independently confirmed all eight error files fail formatting checks.

- **Indentation and whitespace:** Repeated under-indentation in nested `stats`, `sections`, and `rows` arrays across the seven route files.
- **Object/array layout:** Inline nested objects and arrays are expanded by Prettier; quoted keys such as `{"title": ...}` are formatted as ordinary object properties; array/object closing delimiters and trailing commas are adjusted.
- **JSX and line wrapping:** The two `role-page.tsx` diagnostics cover a long mapped `<Stat>` element/conditional spread layout and JSX line wrapping. Route components also have compact JSX prop arrays that Prettier reflows.
- **Quotes and semicolons:** The configured double-quote and semicolon conventions are already generally followed in these regions; no separate quote/semicolon rule failed.
- **Imports:** No import-formatting diagnostic was observed.
- **Non-formatting ESLint errors:** None found.

These transformations appear mechanical and should not change runtime behavior. The full diff must still be reviewed to ensure no accidental content or generated-file changes.

## 8. Fast Refresh Warning Analysis

All 13 warnings are from the explicitly configured `react-refresh/only-export-components` rule, set to `warn` with `{ allowConstantExport: true }` in [eslint.config.js](../../eslint.config.js). The installed plugin documentation describes the rule as a Fast Refresh module-boundary check. Its Vite-compatible constant allowance is limited to scalar string, number, boolean, and template-literal exports; it does not cover the array-valued `roles` export or function-valued variant helpers.

| File and reported location | Warned export(s) | In-repository usage observations |
| --- | --- | --- |
| `src/components/kit.tsx:96` | `buttonVariants` | Used in `src/routes/index.tsx` and `src/routes/referee.tsx`. |
| `src/components/ui/badge.tsx:32` | `badgeVariants` | No other in-tree import found. |
| `src/components/ui/button.tsx:49` | `buttonVariants` | Used by `src/components/ui/alert-dialog.tsx`, `calendar.tsx`, and `pagination.tsx`. |
| `src/components/ui/form.tsx:163` | `useFormField` | Used within `form.tsx`; no other in-tree import found. |
| `src/components/ui/navigation-menu.tsx:111` | `navigationMenuTriggerStyle` | Used within the same module; no other in-tree import found. |
| `src/components/ui/sidebar.tsx:743` | `useSidebar` | Used within `sidebar.tsx`; no other in-tree import found. |
| `src/components/ui/toggle.tsx:42` | `toggleVariants` | Used by `src/components/ui/toggle-group.tsx`. |
| `src/lib/roles.tsx:77, 210, 216, 222, 234, 273` | `roles`, `roleById`, `activeTab`, `ownerOf`, `resolveRole`, `useRole` | Role data/helpers are consumed by app shell, routes, library modules, and `src/test/roles.test.ts`. |

**Assessment:** This is the intended Fast Refresh rule, not a Prettier/configuration conflict. Mixed component/non-component exports are a legitimate development-time HMR boundary concern; the warnings do not prove a production runtime defect or an observed lost-state bug. The Vite constant allowance is already enabled, but it does not apply to the exported helper functions or array observed here.

**API and import impact:** Several warned values have in-repository consumers, especially `buttonVariants`, `toggleVariants`, and the `roles` module exports. Moving helpers or components between modules would require coordinated import updates. Some helpers appear internal-only in this source tree, but external consumers were not investigated; do not remove exports without reviewing their intended API contract.

## 9. Minimal Remediation Options and Risks

### 9.1 Mechanical formatting

- **Candidate scope:** The eight files in Section 5 with errors: `src/components/role-page.tsx` and the seven listed route files.
- **Approach:** Run Prettier write-mode only on those files in a separately authorized remediation task, then review the complete diff.
- **Expected effect:** Remove the 97 `prettier/prettier` errors if the formatter output is accepted; the 13 Fast Refresh warnings would remain.
- **Risk:** Low runtime risk because this is formatting-only, but review is still required. Do not use the broad `npm run format` command for this narrow remediation.
- **Verification:** `prettier --check` on the eight files and `npm run lint`; then run relevant TypeScript, unit-test, and build checks on the remediation revision.

### 9.2 Fast Refresh export boundaries

- **Candidate scope:** The eight warning files and their consumers identified in Section 8. Likely work includes separating shared variant/style helpers from component modules and separating role data/pure route helpers from the React provider/hook module.
- **Expected effect:** A boundary-preserving split could remove the 13 warnings while retaining runtime behavior. A rough split would affect `kit.tsx`, the six warned UI modules, `src/lib/roles.tsx`, and import consumers including `src/routes/index.tsx`, `src/routes/referee.tsx`, the UI alert-dialog/calendar/pagination/toggle-group modules, app shell, account/notifications/opportunities/schedule routes, `src/lib/mock-data.ts`, `src/lib/notifications.ts`, and `src/test/roles.test.ts` as applicable.
- **Risk:** Moderate API/import risk: helpers are used across modules, and external consumers of currently exported helpers are unknown. Preserve compatibility intentionally; do not assume that removing an unused-in-tree export is safe.
- **Verification:** Lint, TypeScript, tests, and production build; review HMR behavior during local development if that behavior is part of acceptance criteria.

### 9.3 Configuration changes

No configuration change is needed to explain the 97 errors. The recommended config already avoids conflicting ESLint formatting rules and intentionally enforces Prettier. Do not disable `prettier/prettier`, weaken it globally, or broadly suppress Fast Refresh warnings merely to make lint pass. A narrow `allowExportNames` exception should be considered only if the framework contract is documented and the owner explicitly approves that policy; splitting modules is the safer default.

## 10. Recommended Next Work Package

**B-11C - Formatting-Only Lint Remediation**

- **Objective:** Remove the reproduced 97 Prettier diagnostics without changing application behavior or lint policy.
- **Scope:** Format only the eight identified files, review the complete diff, and run the prescribed formatting check, lint, TypeScript, unit tests, and build on the resulting revision.
- **Prerequisites:** Separate owner authorization for the exact eight-file remediation and validation commands.
- **Exclusions:** Fast Refresh export restructuring, configuration/rule changes, dependency work, unrelated formatting, security implementation, CI/deployment, database/Supabase operations, staging, commit, and push.

Address the 13 Fast Refresh warnings in a later separately scoped work package after deciding module/API boundaries. This ordering keeps mechanical formatting isolated from behavior-adjacent module restructuring.

## 11. Explicit Exclusions and Actions Not Performed

- No source, configuration, dependency, lockfile, or test file was edited.
- No formatter write-mode, ESLint autofix, configuration change, install, update, or audit/remediation command was run in B-11B.
- No database, Supabase, browser automation, deployment, staging, commit, or push operation occurred.
- The nine npm audit vulnerabilities reported during B-11A were not investigated or remediated.
- No Fast Refresh runtime failure was reproduced; this assessment is limited to static rule evidence and source/module inspection.

## 12. Final Integrity Verification

- **Source Git preflight/postflight:** Branch `chore/phase-1a-governance-reconciliation` and HEAD `6da46b5058d38ebff302b7934ce576d149573a08` are unchanged. Staged and unstaged tracked changes are both zero. The eight original untracked governance files remain, with this report as the only additional untracked path.
- **Disposable checkout:** Remained detached at `6da46b5058d38ebff302b7934ce576d149573a08`; no tracked or untracked Git changes before/after investigation. Lint output was captured at `%TEMP%\apssi-b11b-lint-20261116-023304.txt`.
- **Whitespace and encoding:** `git diff --check` passed for tracked changes; it does not inspect this new untracked report. Direct report validation passed strict UTF-8 decoding; U+FFFD is absent, no checked mojibake was found, and trailing-whitespace line count is zero.
- **Governance:** B-11 remains unresolved. B-07 and B-09 remain independent blockers.
