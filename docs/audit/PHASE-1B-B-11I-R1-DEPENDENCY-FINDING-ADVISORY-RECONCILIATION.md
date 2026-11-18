# Phase 1B B-11I-R1 Dependency Finding and Advisory Reconciliation

## 1. Document Control

- **Work package:** B-11I-R1 — Dependency Finding and Advisory Reconciliation
- **Assessment date:** 2026-11-16
- **Advisory source access date:** 2026-11-16
- **Repository:** `apssi_platform`
- **Branch:** `chore/phase-1a-governance-reconciliation`
- **HEAD:** `6da46b5058d38ebff302b7934ce576d149573a08`
- **Manifest / canonical lockfile:** `package.json` / `package-lock.json` (lockfileVersion 3)
- **Status:** `READ-ONLY RECONCILIATION COMPLETE; NO REMEDIATION PERFORMED`
- **Target report reviewed:** [B-11I Current Dependency Risk Assessment](PHASE-1B-B-11I-CURRENT-DEPENDENCY-RISK-ASSESSMENT.md)
- **Scope:** Reconcile the original B-11I JSON outputs, lockfile paths and versions, and authoritative GitHub-reviewed advisory metadata. No fresh npm audit was run.

## 2. Executive Summary

The original B-11I audit evidence is still available in `%TEMP%\apssi-b11i-d4c144fd74e84357ba11b9684579b71a`. Both JSON files parse successfully and both stderr files are empty. Independent parsing confirms the original totals: **9 full-tree vulnerable package records (7 moderate, 2 high)** and **2 production-only records (both high)**. The production-only records are Vite and Zod. The full-tree-only records are six TypeScript ESLint-chain packages and nested minimatch; these are linked package records, not seven independent advisories.

The original B-11I package counts, npm package severities, installed versions, vulnerable ranges, and scope classification are supported by the preserved JSON and current HEAD lockfile. No material finding-count correction is required. Clarifications: the npm `isDirect` flag for Vite reflects its root `devDependencies` declaration; Vite is also present in the `--omit=dev` graph through non-development transitive paths. Npm's `fixAvailable` versions are not the same field as the earliest upstream patched version: GitHub's advisory pages list Vite 8.1.6 for the affected 8.1 line and Zod 4.6.6, while the original npm output suggests Vite 8.3.8 and Zod 4.6.7.

Advisory matches and production dependency-graph presence are confirmed. Application source use, deployed-artifact inclusion, runtime reachability, and exploitability remain `UNVERIFIED`. No owner risk acceptance, release approval, dependency change, or remediation is recorded.

## 3. Source Revision and Assessment Evidence

- **Source revision:** `6da46b5058d38ebff302b7934ce576d149573a08`.
- **B-11I command evidence:** `npm audit --json` exited 1; `npm audit --omit=dev --json` exited 1. Both are assessment outcomes containing advisories, not transport failures.
- **Original evidence files:** All four files were present in the original `%TEMP%\apssi-b11i-d4c144fd74e84357ba11b9684579b71a` directory: `full-audit.json`, `full-audit-stderr.txt`, `production-audit.json`, and `production-audit-stderr.txt`.
- **Parsing:** Both JSON outputs parsed as npm audit report version 2. PowerShell redirected the JSON as UTF-16LE; BOM-aware decoding succeeded. Both stderr files were empty.
- **Original counts:** Full scope: info 0, low 0, moderate 7, high 2, critical 0, total 9. Production-only: info 0, low 0, moderate 0, high 2, critical 0, total 2.
- **Dependency metadata:** Both reports list 256 prod, 274 dev, 74 optional, 11 peer, 0 peerOptional, and 582 total dependency entries. These are graph metadata totals, not vulnerable-package counts for the production-only scope.
- **Lockfile versions:** All package versions and audit `nodes` paths were correlated with the lockfile at the evaluated HEAD. `npm ls` was used read-only to trace the TypeScript ESLint/minimatch and Vite graphs.
- **No new audit:** The preserved original JSON was available and complete, so no fresh `npm audit` was needed or run for R1.

## 4. Original B-11I Findings Reconciliation

| Scope | Original B-11I result | R1 reconciliation |
|---|---|---|
| Full dependency tree | 9 package records: 7 moderate, 2 high | Confirmed from original JSON. The seven moderate records are six connected TypeScript ESLint packages plus one nested minimatch record. |
| Production-only | 2 package records: 2 high | Confirmed from original JSON: Vite and Zod. |
| Shared across scopes | Vite and Zod | Confirmed: both records and their advisory arrays appear in both JSON files. |
| Full-only | TypeScript ESLint/minimatch chain | Confirmed: these seven package records do not appear in production-only vulnerability results. |
| Original source quality | Valid JSON; empty stderr | Confirmed. No source was unavailable and no count had to be reconstructed. |

Npm counts vulnerable package records at package level using its severity aggregation. They are not counts of unique advisory IDs: the Vite record aggregates five advisories, and the TypeScript ESLint package records propagate through dependency links.

## 5. Full Dependency Tree Reconciliation

The original full audit's seven moderate records and resolved lockfile nodes are:

| Package record | Resolved version | npm `isDirect` | Lockfile node | npm package range | `via` / advisory relationship |
|---|---:|---|---|---|---|
| `typescript-eslint` | 8.72.2 | Yes | `node_modules/typescript-eslint` | `<=8.72.2` | `@typescript-eslint/eslint-plugin`, parser, typescript-estree, and utils |
| `@typescript-eslint/eslint-plugin` | 8.72.2 | No | `node_modules/@typescript-eslint/eslint-plugin` | `6.16.0 - 8.72.2` | type-utils and utils |
| `@typescript-eslint/parser` | 8.72.2 | No | `node_modules/@typescript-eslint/parser` | `6.16.0 - 8.72.2` | typescript-estree |
| `@typescript-eslint/type-utils` | 8.72.2 | No | `node_modules/@typescript-eslint/type-utils` | `6.16.0 - 8.72.2` | typescript-estree and utils |
| `@typescript-eslint/typescript-estree` | 8.72.2 | No | `node_modules/@typescript-eslint/typescript-estree` | `6.16.0 - 8.72.2` | minimatch |
| `@typescript-eslint/utils` | 8.72.2 | No | `node_modules/@typescript-eslint/utils` | `6.16.0 - 8.72.2` | typescript-estree |
| `minimatch` | 10.2.6 | No | `node_modules/@typescript-eslint/typescript-estree/node_modules/minimatch` | `7.0.0 - 11.0.0` | npm advisory 1244623 / GHSA-g3hv-75wg-m249 |

`npm ls` independently showed the vulnerable minimatch 10.2.6 under `typescript-eslint > @typescript-eslint/typescript-estree`. ESLint also has minimatch 3.1.5, but that version is outside the advisory's affected range and is not one of the seven vulnerable records.

Only minimatch carries the advisory object in the original JSON. The six other TypeScript ESLint package records are npm's propagated `via` entries in that dependency chain, not six additional independently identified GHSAs. The minimatch finding itself is confirmed; exploitability from project-controlled patterns remains `UNVERIFIED`.

The full audit reports `fixAvailable` as `typescript-eslint@8.36.0` with `isSemVerMajor: true` for this chain. This is npm's proposed graph-level fix metadata, not proof that the version is compatible or an approved remediation.

## 6. Production Dependency Path Reconciliation

### Vite

- **Root manifest:** Vite `8.1.5` is directly declared in `devDependencies`; it is not a root `dependencies` entry.
- **Lockfile node:** `node_modules/vite`, version `8.1.5`.
- **Production-only audit:** The Vite record is present in `npm audit --omit=dev --json`. Its `isDirect: true` flag describes its root-manifest declaration; it does not mean every production path is a direct production declaration.
- **`npm ls vite --omit=dev --all` paths:**
  - `@tailwindcss/vite@4.3.5 > vite@8.1.5`
  - `@tanstack/react-start@1.168.60 > vite@8.1.5`
  - `@tanstack/react-start > @tanstack/start-plugin-core@1.171.49 > vite@8.1.5`
  - `@tanstack/react-start > @tanstack/start-plugin-core > vitefu@1.1.3 > vite@8.1.5`
  - `@tanstack/router-plugin@1.168.42 > unplugin@3.7.0 > vite@8.1.5`
  - `vite-tsconfig-paths@6.1.1 > vite@8.1.5`

This confirms Vite is present in npm's production-only dependency graph through non-dev dependency paths. It does not prove that Vite is shipped in a production artifact or that any vulnerable dev-server behavior is reachable after deployment.

### Zod

- **Root manifest:** `zod` is directly declared in `dependencies` as `^3.25.76`.
- **Lockfile node:** `node_modules/zod`, version `3.25.76`.
- **Audit scope:** Present in both full and production-only JSON as a direct high-severity record.
- **Source search:** No `zod` package reference was found in `src/**/*.{ts,tsx}`. The package's presence in the production graph is confirmed; application-level use or runtime reachability is not established by this search.

## 7. Advisory Metadata Verification

GitHub-reviewed advisory pages were fetched on 2026-11-16. The affected ranges below include the installed versions reported in the lockfile. GitHub's patched versions are advisory-specific; npm's `fixAvailable` is separately recorded in the JSON and may suggest a later version.

| Advisory / npm ID | Package / title | GitHub severity | Affected range relevant to installed package | Patched version stated by GitHub | Original npm scope |
|---|---|---|---|---|---|
| GHSA-g3hv-75wg-m249 / 1244623; CVE-2026-118764 | minimatch — globparts amplification denial of service | Moderate | `>=7.0.0 <11.0.1`; installed 10.2.6 | 11.0.1 | Full only |
| GHSA-698v-4r3x-3vcv / 1242624; CVE-2026-112943 | launch-editor via Vite — percent escaping on Windows | Moderate | Vite `>=8.0.0 <=8.1.5`; installed 8.1.5 | Vite 8.1.6 for the 8.1 line; launch-editor 2.14.2 | Full and production |
| GHSA-r825-w8mm-5pxw / 1242653; CVE-2026-112944 | launch-editor via Vite — editor CLI flag interpretation | Moderate | Vite `>=8.0.0 <=8.1.5`; installed 8.1.5 | Vite 8.1.6 for the 8.1 line; launch-editor 2.14.2 | Full and production |
| GHSA-587h-7wmj-h5pm / 1242660; CVE-2026-112942 | launch-editor via Vite — Windows existence-check bypass | High | Vite `>=8.0.0 <=8.1.5`; installed 8.1.5 | Vite 8.1.6 for the 8.1 line; launch-editor 2.14.2 | Full and production |
| GHSA-9jrq-w75r-8gcw / 1242726; CVE-2026-112945 | Vite — cross-origin script execution through custom middleware | Low | Vite `>=8.0.0 <=8.1.5`; installed 8.1.5 | Vite 8.1.6 for the 8.1 line | Full and production |
| GHSA-rq7h-c2jc-7f22 / 1242732; CVE-2026-112946 | Vite — files outside `server.fs.allow` served under path collision conditions | Moderate | Vite `>=8.0.0 <=8.1.5`; installed 8.1.5 | Vite 8.1.6 for the 8.1 line | Full and production |
| GHSA-mrhx-c7xc-m3w5 / 1243066; CVE-2023-54404 | Zod — memory exhaustion validating oversized constrained collections | High | `<4.6.6`; installed 3.25.76 | 4.6.6 | Full and production |

Sources:

- [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)
- [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv)
- [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw)
- [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm)
- [GHSA-9jrq-w75r-8gcw](https://github.com/advisories/GHSA-9jrq-w75r-8gcw)
- [GHSA-rq7h-c2jc-7f22](https://github.com/advisories/GHSA-rq7h-c2jc-7f22)
- [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5)

The advisory pages document conditional applicability: the launch-editor findings require platform/editor and attacker-input conditions; the Vite middleware advisory requires a custom/middleware-mode request/HTML setup; the path-collision advisory describes a network-exposed dev server and non-Windows host conditions; Zod's issue concerns oversized input to affected constrained-collection validation; minimatch's issue requires an attacker-controlled pattern to reach the vulnerable preprocessing path. These conditions do not establish whether the APSI application meets them. Runtime reachability and exploitability remain `UNVERIFIED`.

## 8. Finding-by-Finding Reconciliation Matrix

| Package record | Resolved version / path | Original npm severity and scope | Advisory attribution | R1 classification | Application exposure |
|---|---|---|---|---|---|
| `typescript-eslint` | 8.72.2; root dev dependency, `node_modules/typescript-eslint` | Moderate; full only | Propagated `via` to TypeScript ESLint packages; no independent advisory object | `CONFIRMED — ORIGINAL CLASSIFICATION CORRECT` | `UNVERIFIED` |
| `@typescript-eslint/eslint-plugin` | 8.72.2; transitive, `node_modules/@typescript-eslint/eslint-plugin` | Moderate; full only | Propagated via type-utils and utils; no independent advisory object | `CONFIRMED — ORIGINAL CLASSIFICATION CORRECT` | `UNVERIFIED` |
| `@typescript-eslint/parser` | 8.72.2; transitive, `node_modules/@typescript-eslint/parser` | Moderate; full only | Propagated via typescript-estree; no independent advisory object | `CONFIRMED — ORIGINAL CLASSIFICATION CORRECT` | `UNVERIFIED` |
| `@typescript-eslint/type-utils` | 8.72.2; transitive, `node_modules/@typescript-eslint/type-utils` | Moderate; full only | Propagated via typescript-estree and utils; no independent advisory object | `CONFIRMED — ORIGINAL CLASSIFICATION CORRECT` | `UNVERIFIED` |
| `@typescript-eslint/typescript-estree` | 8.72.2; transitive, `node_modules/@typescript-eslint/typescript-estree` | Moderate; full only | Propagated via minimatch | `CONFIRMED — ORIGINAL CLASSIFICATION CORRECT` | `UNVERIFIED` |
| `@typescript-eslint/utils` | 8.72.2; transitive, `node_modules/@typescript-eslint/utils` | Moderate; full only | Propagated via typescript-estree; no independent advisory object | `CONFIRMED — ORIGINAL CLASSIFICATION CORRECT` | `UNVERIFIED` |
| `minimatch` | 10.2.6; nested under typescript-estree | Moderate; full only | npm 1244623 / GHSA-g3hv-75wg-m249; range `>=7 <11.0.1`; fixed in 11.0.1 | `CONFIRMED — ORIGINAL CLASSIFICATION CORRECT` | `UNVERIFIED` |
| `vite` | 8.1.5; root dev declaration plus production-only transitive paths | High package record; full and production | Five verified GHSAs, with advisory severities moderate, moderate, high, low, moderate | `CONFIRMED — ORIGINAL CLASSIFICATION CORRECT` | `UNVERIFIED` |
| `zod` | 3.25.76; direct production dependency | High; full and production | npm 1243066 / GHSA-mrhx-c7xc-m3w5; range `<4.6.6`; fixed in 4.6.6 | `CONFIRMED — ORIGINAL CLASSIFICATION CORRECT` | `UNVERIFIED` |

No finding was classified `NOT REPRODUCED` because the original raw audit files were available and matched the B-11I counts. No package-level severity was downgraded. “Confirmed” refers to the npm package/advisory match, not confirmed exploitation in the application.

## 9. Risk Disposition Register

| Finding/group | Evidence status | Recommended risk handling | Rationale |
|---|---|---|---|
| Six TypeScript ESLint package records | `CONFIRMED — ORIGINAL CLASSIFICATION CORRECT` as npm-propagated moderate records | `REMEDIATION RECOMMENDED` | Original JSON `via` links and current lockfile paths establish the connected development-tooling chain. No separate GHSA is attached to each propagated package. |
| Nested minimatch 10.2.6 | `CONFIRMED — ORIGINAL CLASSIFICATION CORRECT` | `REMEDIATION RECOMMENDED` | GHSA affected range includes 10.2.6 and specifies 11.0.1 as patched. Actual input reachability is unknown. |
| Vite 8.1.5 | `CONFIRMED — ORIGINAL CLASSIFICATION CORRECT` | `REMEDIATION RECOMMENDED` | Five authoritative advisories include installed 8.1.5; `npm ls --omit=dev` confirms production graph paths. Shipping/reachability of affected server/editor functionality remains unverified. |
| Zod 3.25.76 | `CONFIRMED — ORIGINAL CLASSIFICATION CORRECT` | `REMEDIATION RECOMMENDED` | GHSA affected range includes installed version and marks 4.6.6 patched. No `zod` source match was found, but graph presence is direct; code reachability remains unverified. |
| Application runtime exposure for all records | `UNVERIFIED — INSUFFICIENT EVIDENCE` | `UNVERIFIED — ADDITIONAL INVESTIGATION REQUIRED` | No application threat-path, artifact, runtime, or exploitability assessment was authorized or performed. |

No finding has owner risk acceptance. High-severity Vite and Zod records warrant explicit owner attention before a release candidate, but the report does not authorize or perform remediation.

## 10. Corrections to Original B-11I Assessment

**No corrections are required to the original package-record counts, npm package severities, installed versions, affected ranges, or full-vs-production classification.** The preserved JSON confirms all nine original records and their advisory objects.

The following clarifications should accompany interpretation of the original report:

1. The six TypeScript ESLint package records are `via`-propagated records in one development-tooling/minimatch chain, not six independent advisories. The underlying GHSA is GHSA-g3hv-75wg-m249.
2. Vite's `isDirect: true` means it is directly declared in root `devDependencies`; the production-only graph includes Vite through non-dev dependency paths. The original report correctly states both facts. It does not show that Vite is bundled into a deployed artifact.
3. The B-11I `fixAvailable` values are npm's proposed graph-level versions: Vite 8.3.8, Zod 4.6.7, minimatch's chain via typescript-eslint 8.36.0. GitHub Advisory pages list Vite 8.1.6 as patched for the affected 8.1 line, Zod 4.6.6, and minimatch 11.0.1. These are not necessarily contradictory: npm's suggested target can be later than the minimum advisory fix. Compatibility and selection remain unverified and unauthorized.
4. npm package severity for Vite is high because the package record aggregates a high advisory; the five individual Vite advisories have mixed severities. B-11I already lists those individual severities accurately.
5. The production-only JSON repeats whole-lockfile dependency metadata totals; its two-item vulnerability map, not those totals, establishes the reported production-only finding count.

## 11. Owner Decisions Required

- Decide whether to authorize a separately scoped remediation review for Vite and Zod before any release candidate.
- Decide whether to remediate or explicitly accept the development-tooling/minimatch findings and assign a risk owner if deferred.
- Record any exception or risk acceptance through B-11G D-10. This reconciliation grants none.
- Keep npm and `package-lock.json` canonical. No package-manager, lockfile, or Node pin changes are authorized by this assessment.

## 12. Limitations and Unverified Areas

- npm audit verifies package/advisory graph matches, not whether an application's vulnerable code path is reached.
- No source-level `zod` import or exact `vite` package import was found under `src/**/*.{ts,tsx}`; absence of a match does not prove no indirect, generated, dynamic, or external use.
- Vite's production dependency graph presence is confirmed, but production artifact inclusion and runtime use are unverified.
- The Vite advisory pages describe conditional editor, Windows, middleware, or filesystem path conditions. Whether the APSI configuration meets them was not tested.
- Zod input constraints and whether affected validation is reachable with attacker-controlled oversized input were not reviewed.
- Minimatch pattern provenance and use by development tooling were not analyzed for exploitability.
- npm audit fix metadata and advisory patched versions do not establish compatibility of an update.
- The registry's server-side response timestamp was not present in the audit JSON. GitHub advisory pages were accessed on 2026-11-16.
- No fresh audit was run; this reconciliation is anchored to the preserved B-11I audit at the stated HEAD and to the unchanged lockfile.

## 13. Relationship to B-11G and B-11 Closure

- B-11G D-05 requires a current dependency risk assessment before every release candidate; B-11I and this R1 report provide evidence for the evaluated lockfile revision.
- Neither assessment grants release approval or owner risk acceptance.
- Prototype Quality Completion under D-01 does not automatically require a release-candidate dependency assessment.
- No dependency remediation or upgrade is authorized by D-05 or this reconciliation.
- B-11 remains open pending applicable prototype evidence and other required decisions; this report does not close B-11.

## 14. Final Assessment

**Assessment:** `ORIGINAL B-11I FINDING COUNTS AND PACKAGE CLASSIFICATIONS CONFIRMED; APPLICATION EXPOSURE UNVERIFIED`.

The original JSON and HEAD lockfile support the full-tree 9-record count and production-only 2-record count. All nine package records are confirmed as originally classified. GitHub-reviewed advisory pages confirm the named affected ranges and patched versions; the report clarifies npm fix metadata versus upstream advisory fixes. Vite remains in the production-only dependency graph via non-dev paths, but this does not prove production artifact inclusion or runtime exploitability. No owner risk acceptance, remediation, release approval, or dependency change is recorded.
