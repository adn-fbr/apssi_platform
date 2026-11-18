# Phase 1B B-11I Current Dependency Risk Assessment

## 1. Document Control

- **Work package:** B-11I — Current Dependency Risk Assessment
- **Assessment date:** 2026-11-16
- **Assessment capture time:** 2026-11-16T05:51:50.6109244+08:00 (local time, after the audit commands completed; registry response time is not included in npm's JSON metadata)
- **Repository:** `apssi_platform`
- **Branch:** `chore/phase-1a-governance-reconciliation`
- **HEAD:** `6da46b5058d38ebff302b7934ce576d149573a08`
- **Manifest and lockfile:** `package.json`; `package-lock.json` (lockfileVersion 3)
- **Status:** `READ-ONLY ASSESSMENT COMPLETE; NO REMEDIATION PERFORMED`
- **Scope:** Read-only npm audit of the full dependency graph and the graph with development dependencies omitted, using the existing canonical npm lockfile.
- **Exclusions:** No install, dependency modification, source or manifest change, database/Supabase access, deployment, or remediation was performed.

## 2. Executive Summary

Both npm audit outputs parsed as valid JSON, with empty stderr and no registry-failure indicators. The full-tree audit reported **9 vulnerable package records: 7 moderate and 2 high**. The production-only audit (`npm audit --omit=dev`) reported **2 records: 2 high**. There were no info, low, or critical package-record counts in either npm summary. The production records are Vite and Zod; the full-tree-only records are the TypeScript ESLint dependency chain and nested minimatch.

These are npm advisory matches against resolved lockfile versions, not proof that vulnerable functionality is reachable or exploitable in this application. Application-level reachability and exploitability remain **UNVERIFIED**. Vite appears in the production-only graph through non-development dependency paths even though the root manifest also declares it in `devDependencies`. Zod is a direct production dependency. The audit does not establish that the dependency tree is secure or that every finding is exploitable.

The npm commands exited with code 1 because advisories were reported. This is an assessment result, not an audit transport failure. No dependency changes were authorized or made. Current findings supersede, but do not erase, the historical B-11A count; the fact that both assessments report nine findings does not prove that the finding set is unchanged.

## 3. Assessment Scope and Limitations

- The audit evaluated the lockfile-backed dependency graph using npm 11.19.1 and the registry audit response available at assessment time.
- The full audit includes production and development dependency records. The production audit used `--omit=dev` and returned a reduced vulnerability map. npm's `metadata.dependencies` field reports the lockfile graph totals in both JSON outputs; it is not the scope-specific vulnerable-package count. Scope comparison here uses the actual audit command and vulnerability records.
- Full JSON reported dependency metadata of 256 production, 274 development, 74 optional, 11 peer, 0 peerOptional, and 582 total dependency entries. The production-only audit JSON repeated these metadata totals; its vulnerability map contained only Vite and Zod.
- The two JSON files were redirected by Windows PowerShell as UTF-16LE. They were decoded with BOM-aware parsing and validated as JSON. Both stderr files were empty; no registry/network failure was indicated.
- No source-code reachability, runtime loading, deployed artifact, exploitability, or mitigation testing was performed. Findings therefore describe package/advisory matches, not confirmed application exposure.
- npm's `fixAvailable` values are recorded as returned. A suggested version is not an approved or automatically safe upgrade; compatibility, advisory applicability, and migration impact require review.
- No `.npmrc`, credential file, environment variable, or secret-bearing file was opened or printed. The exact configured registry URL was not independently inspected.
- Historical B-11A results are not used as current findings. No audit output or finding count is inferred from that earlier work.

## 4. Repository and Toolchain Evidence

- **REPOSITORY:** `package.json` declares `packageManager: npm@11.19.1`; actual `npm --version` was `11.19.1`, so the required version check passed. `package-lock.json` is lockfileVersion 3 and is canonical under the recorded WS-0 decision.
- **REPOSITORY:** `bun.lock` remains tracked. It was not read beyond prior governance evidence and was not modified; this assessment does not decide its removal.
- **REPOSITORY / EXECUTION:** `node --version` returned `v24.22.0`. This is the actual runtime used here, not an approved repository pin. B-11G D-08 requires a Node.js pin after compatibility verification but does not select v24.22.0.
- **REPOSITORY:** Vite is in root `devDependencies`; `typescript-eslint` is in root `devDependencies`; Zod is in root `dependencies`. `package-lock.json` resolves them to the versions in the finding tables below.
- **EXECUTION:** `npm ls vite --omit=dev --all` showed Vite in the non-development graph through `@tailwindcss/vite`, `@tanstack/react-start` / `@tanstack/start-plugin-core` (including `vitefu`), `@tanstack/router-plugin` / `unplugin`, and `vite-tsconfig-paths`.
- **OWNER DECISION:** npm and `package-lock.json` remain canonical. No lockfile or package-manager change is authorized by D-08 or this assessment.

## 5. Audit Method and Data Sources

The commands used the existing lockfile and did not install or update packages:

| Scope | Command | Exit code | JSON result | npm summary |
|---|---|---:|---|---|
| Full dependency tree | `npm audit --json` | 1 | Valid JSON, auditReportVersion 2 | 9 records: 7 moderate, 2 high |
| Production-only | `npm audit --omit=dev --json` | 1 | Valid JSON, auditReportVersion 2 | 2 records: 2 high |

JSON and stderr were stored outside the repository in a unique `%TEMP%\apssi-b11i-*` directory. The report records normalized audit fields only; raw audit output is not copied here. The data source is npm's configured registry audit service. The registry URL was not inspected, and the audit response did not expose a server-side assessment timestamp; the local capture time is recorded in Document Control.

## 6. Full Dependency Tree Results

Npm reports vulnerable package-record counts by the highest reported package severity. A package record may aggregate multiple advisories, so these counts are not counts of unique CVEs/GHSAs.

| npm severity | Vulnerable package records |
|---|---:|
| Info | 0 |
| Low | 0 |
| Moderate | 7 |
| High | 2 |
| Critical | 0 |
| **Total** | **9** |

The seven full-tree-only moderate records are `typescript-eslint` (direct development dependency), `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `@typescript-eslint/type-utils`, `@typescript-eslint/typescript-estree`, `@typescript-eslint/utils`, and nested `minimatch`. The six TypeScript ESLint package records are connected through the affected dependency chain; they are not seven independent root causes. They do not appear in the production-only vulnerability map.

The shared records are Vite and Zod. Their detailed paths and advisories are in Section 8. The npm `fixAvailable` values for the TypeScript ESLint chain report coordinated `typescript-eslint@8.36.0` with `isSemVerMajor: true`; the installed meta-package is 8.72.2. This unusual recommendation must be validated rather than interpreted as a safe downgrade or implemented automatically.

## 7. Production Dependency Results

| npm severity | Vulnerable package records |
|---|---:|
| Info | 0 |
| Low | 0 |
| Moderate | 0 |
| High | 2 |
| Critical | 0 |
| **Total** | **2** |

- **Vite 8.1.5:** Present in the production-only audit and in the `npm ls --omit=dev` tree. It is directly declared in root `devDependencies` but also occurs through non-development dependency paths listed in Section 4. npm marks the record `isDirect: true` for the root manifest. This does not establish that the vulnerable Vite functionality is included in or reachable from a deployed application.
- **Zod 3.25.76:** Direct root production dependency and present in both audit scopes.

The production audit excludes the TypeScript ESLint/minimatch records, but its results do not prove that the production application is free of all dependency risk. Applicability and reachability remain unverified.

## 8. Finding-by-Finding Risk Analysis

### 8.1 TypeScript ESLint and Minimatch Chain — Full Tree Only

Npm reported seven moderate package records in this chain. Resolved versions and lockfile paths:

| Package record | Resolved version | Directness | Lockfile path | npm reported range / relation | Scope |
|---|---|---|---|---|---|
| `typescript-eslint` | 8.72.2 | Direct root dev dependency | `node_modules/typescript-eslint` | `<=8.72.2`; via the listed ESLint packages | Full only |
| `@typescript-eslint/eslint-plugin` | 8.72.2 | Transitive | `node_modules/@typescript-eslint/eslint-plugin` | `6.16.0 - 8.72.2`; via type-utils and utils | Full only |
| `@typescript-eslint/parser` | 8.72.2 | Transitive | `node_modules/@typescript-eslint/parser` | `6.16.0 - 8.72.2`; via typescript-estree | Full only |
| `@typescript-eslint/type-utils` | 8.72.2 | Transitive | `node_modules/@typescript-eslint/type-utils` | `6.16.0 - 8.72.2`; via typescript-estree and utils | Full only |
| `@typescript-eslint/typescript-estree` | 8.72.2 | Transitive | `node_modules/@typescript-eslint/typescript-estree` | `6.16.0 - 8.72.2`; via minimatch | Full only |
| `@typescript-eslint/utils` | 8.72.2 | Transitive | `node_modules/@typescript-eslint/utils` | `6.16.0 - 8.72.2`; via typescript-estree | Full only |
| `minimatch` | 10.2.6 | Transitive | `node_modules/@typescript-eslint/typescript-estree/node_modules/minimatch` | `>=7.0.0 <11.0.1` | Full only |

The underlying advisory returned for minimatch is npm advisory 1244623, **GHSA-g3hv-75wg-m249**, “minimatch has potential denial of service via globparts amplification,” severity moderate: <https://github.com/advisories/GHSA-g3hv-75wg-m249>. The TypeScript ESLint records refer through `via` dependency links to this chain; npm does not repeat the advisory object on every propagated package record.

For the minimatch record, npm's `fixAvailable` reports a coordinated `typescript-eslint@8.36.0` change with a major-version flag, not a standalone safe minimatch update. The advisory range indicates versions before 11.0.1 are affected, but that does not authorize or establish a compatible update. Actual exposure depends on the development tooling execution path and input; exploitability is `UNVERIFIED`.

### 8.2 Vite — Full and Production-Only Trees

Npm resolves Vite 8.1.5 at `node_modules/vite`, reports the package record as direct, and gives the package vulnerable range `8.0.0 - 8.1.5`. The root manifest declares Vite in `devDependencies`, while the production-only dependency tree also contains it through the Section 4 paths. Npm reports `fixAvailable` as Vite 8.3.8 with `isSemVerMajor: false`.

The Vite package record aggregates these five advisories:

| Advisory | npm severity | Reported vulnerable range | Advisory title |
|---|---|---|---|
| 1242624 — GHSA-698v-4r3x-3vcv | Moderate | `>=8.0.0 <=8.1.5` | launch-editor `escapeCmdArgs()` omits percent escaping on Windows |
| 1242653 — GHSA-r825-w8mm-5pxw | Moderate | `>=8.0.0 <=8.1.5` | Editor CLI flag misinterpretation can cause arbitrary command execution for some editors |
| 1242660 — GHSA-587h-7wmj-h5pm | High | `>=8.0.0 <=8.1.5` | launch-editor `fs.existsSync()` existence check can be bypassed on Windows |
| 1242726 — GHSA-9jrq-w75r-8gcw | Low | `>=8.0.0 <=8.1.5` | Cross-origin script execution through Vite custom middleware |
| 1242732 — GHSA-rq7h-c2jc-7f22 | Moderate | `>=8.0.0 <=8.1.5` | Files outside `server.fs.allow` could be served when project paths match system paths on non-Windows systems |

Advisory references: <https://github.com/advisories/GHSA-698v-4r3x-3vcv>, <https://github.com/advisories/GHSA-r825-w8mm-5pxw>, <https://github.com/advisories/GHSA-587h-7wmj-h5pm>, <https://github.com/advisories/GHSA-9jrq-w75r-8gcw>, and <https://github.com/advisories/GHSA-rq7h-c2jc-7f22>.

Npm's package-level severity is high, which is why the package counts as high in both summaries; the record also contains moderate and low advisories. The specific affected launch-editor, middleware, or file-serving paths were not traced through application use or a production artifact. Production-tree presence is confirmed; application reachability and exploitability are `UNVERIFIED`.

### 8.3 Zod — Full and Production-Only Trees

- **Package/version:** `zod` 3.25.76.
- **Directness/path:** Direct production dependency at `node_modules/zod`.
- **Npm severity and range:** High; `<4.6.6`.
- **Advisory:** npm advisory 1243066, **GHSA-mrhx-c7xc-m3w5**, “Zod can exhaust memory while validating oversized constrained collections”: <https://github.com/advisories/GHSA-mrhx-c7xc-m3w5>.
- **Scope:** Present in both full and production-only audit results.
- **Remediation availability:** Npm reports Zod 4.6.7 with `isSemVerMajor: true`; compatibility and breaking changes require review.
- **Applicability:** Usage sites, attacker-controlled inputs, and reachability of affected validation behavior were not analyzed. Exploitability is `UNVERIFIED`.

## 9. Risk Disposition Register

| Finding/group | Assessment | Disposition | Rationale and evidence limit |
|---|---|---|---|
| Vite 8.1.5 and five returned advisories | High npm package record; present in full and production-only graph | `REMEDIATION RECOMMENDED` | Production dependency-tree presence and a high advisory justify review before release. Whether vulnerable features ship or are reachable is `UNVERIFIED`; Vite 8.3.8 is npm's reported available version, not an approved change. |
| Zod 3.25.76 / GHSA-mrhx-c7xc-m3w5 | High; direct production dependency; present in both scopes | `REMEDIATION RECOMMENDED` | Direct production graph presence and high severity merit owner attention. Application inputs/reachability are `UNVERIFIED`; the reported Zod 4.6.7 change is major and requires compatibility review. |
| TypeScript ESLint/minimatch chain | Seven moderate package records; full tree only; development tooling | `REMEDIATION RECOMMENDED` | Findings are associated with the development toolchain and a shared minimatch advisory chain. Actual triggerability in tooling is `UNVERIFIED`; npm's coordinated fix suggestion is marked major and needs validation. |
| Application exposure/exploitability for all findings | Not assessed by npm's package graph output | `UNVERIFIED — ADDITIONAL INVESTIGATION REQUIRED` | No source reachability, runtime, artifact, or exploitability analysis was part of this package. Do not equate the npm severity label with confirmed application exploitation. |

The high-severity Vite and Zod records warrant explicit review before any release candidate. This report does not assign an owner risk acceptance, approve an exception, or authorize remediation. If remediation is deferred, the applicable risk decision must be recorded by the authorized owner under the approved process.

## 10. Remediation Recommendations (Recommendations Only)

- Review Vite's production-tree presence and determine which affected Vite/launch-editor/middleware paths are actually used in development, build, and any deployed artifact. Consider the npm-reported 8.3.8 candidate only after compatibility and advisory review.
- Review Zod call sites and whether untrusted or oversized input can reach the affected constrained-collection validation behavior. Evaluate the reported 4.6.7 major-version candidate with compatibility tests before considering an update.
- Review the TypeScript ESLint/minimatch chain as a development-tooling risk. Validate the npm-reported coordinated `typescript-eslint@8.36.0` major-change suggestion and advisory ranges; do not assume it is a safe upgrade or downgrade.
- Assign a responsible owner and decision date for each finding group. Any deferral requires explicit risk rationale and approval; no such acceptance is recorded here.

No recommendation in this section is an instruction to change dependencies. No remediation was performed.

## 11. Owner Decisions Required

- Decide whether to authorize remediation work for the high-severity production-tree records (Vite and Zod), after applicability and compatibility review.
- Decide whether to remediate or accept the full-tree development-tooling findings, with explicit risk ownership if deferred.
- Record any exception or risk acceptance under B-11G D-10. This assessment itself approves none.
- Keep package-manager policy unchanged: npm and `package-lock.json` remain canonical; `bun.lock` was not modified.

## 12. Relationship to B-11G Quality-Gate Decisions

- B-11G D-05 requires a current dependency risk assessment before each release candidate; this B-11I report provides current evidence for the evaluated lockfile revision and assessment time.
- This assessment does not constitute release approval or owner risk acceptance.
- Prototype Quality Completion under D-01 does not automatically require a release-candidate dependency assessment. A dependency-risk assessment is required before each release candidate under D-05.
- D-05 and this assessment authorize no dependency remediation, upgrade, removal, or package-manager change.
- D-08 keeps npm and `package-lock.json` canonical, requires a Node.js pin after compatibility verification, and does not authorize selecting v24.22.0 or modifying `bun.lock`.

## 13. Final Assessment

The current lockfile-backed audit returned valid, scope-appropriate results: 9 vulnerable package records for the full dependency tree (7 moderate, 2 high) and 2 high package records for the production-only audit. The production-only findings are Vite and Zod; the full-only findings are the TypeScript ESLint/minimatch development-tooling chain. Vite's production graph presence is verified through non-development dependency paths, but application reachability and exploitability remain `UNVERIFIED` for all finding groups.

The current dependency posture is not risk-free. The high-severity Vite and Zod records require owner attention before a release candidate. No dependency change, remediation, or owner risk acceptance was performed or approved. This report completes B-11I assessment only; it does not close B-11 or authorize a release.
