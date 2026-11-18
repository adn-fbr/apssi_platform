# Phase 1B B-11K Build Warning Owner Disposition

## 1. Document Control
- **Work package:** B-11K — Build Warning Owner Disposition
- **Assessment date:** 2026-11-16
- **Repository:** `apssi_platform`
- **Branch / HEAD:** `chore/phase-1a-governance-reconciliation` / `6da46b5058d38ebff302b7934ce576d149573a08`
- **Purpose:** Present evidence-based disposition choices for the three build warnings recorded during B-11E-C.
- **Scope:** Read-only review of recorded B-11E-C build output, B-11G D-06, B-11J, historical warning context, and current repository-owned Vite/TanStack configuration.
- **Exclusions:** This document records the Project Owner's investigation-only decisions but authorizes no investigation execution, build/configuration change, bundle analysis, dependency operation, CI work, deployment, or production activity.

- **Status:** `OWNER DECISIONS RECORDED; INVESTIGATION PACKAGE PENDING`
- **Related evidence:** [B-11G Owner Quality-Gate Decision](PHASE-1B-B-11G-OWNER-QUALITY-GATE-DECISION.md), [B-11J Final Engineering Quality Closure Audit](PHASE-1B-B-11J-FINAL-ENGINEERING-QUALITY-CLOSURE-AUDIT.md), [P1-01C Fast Refresh Warning Analysis](PHASE-1B-P1-01C-FAST-REFRESH-WARNING-ANALYSIS-REPORT.md), and [P1-01D Path and Importer Reconciliation](PHASE-1B-P1-01D-FAST-REFRESH-PATH-IMPORTER-RECONCILIATION.md).

## 2. Executive Summary

The latest recorded B-11E-C build succeeded and emitted three warnings. The exact build output is available in the B-11E-C execution context; this work package did not rerun the build. The current [Vite configuration](../../vite.config.ts) delegates to `@lovable.dev/vite-tanstack-config`; its header says the wrapper supplies `tsConfigPaths` and Nitro. Repository-owned configuration does not explicitly set `inlineDynamicImports` or `codeSplitting`.

B-11G D-06 requires every build warning to receive an explicit disposition. Material issues must be fixed. An accepted non-material warning must have a documented rationale, impact/risk, accountable owner, and review trigger/date. The existing B-11G record lists the warnings but states they are not yet dispositioned. The older Phase 0 technical-debt priority label does not meet D-06 and is not Project Owner acceptance.

For all three warnings, materiality is **UNDETERMINED** from available evidence. No runtime failure, performance measurement, or deployment effect was verified. On 2026-11-16, the Project Owner confirmed `REQUEST ADDITIONAL INVESTIGATION` for W-01, W-02, and W-03 using the rationale recorded verbatim in Section 10. These are investigation-only decisions, not final materiality dispositions. No warning is accepted by default. B-11J remains open until the applicable D-06 decisions and other prototype criteria are satisfied.

## 3. Governing Owner Decision — B-11G D-06

B-11G D-06 is authoritative:

- Every build warning must be reviewed and assigned a documented disposition.
- Material issues must be fixed under separately authorized implementation scope.
- An accepted non-material warning must record its technical rationale, impact and risk, responsible owner, and review trigger or date.
- Any exception to an applicable quality-gate requirement requires explicit Project Owner approval under D-10.
- D-06 governs build warnings; D-02's zero-warning threshold governs lint warnings. These requirements are separate.

This record supplies the Project Owner's `REQUEST ADDITIONAL INVESTIGATION` direction for all three warnings. It does not supply a final materiality determination or acceptance, approve remediation, or authorize implementation or execution of a future investigation package.

## 4. Build Warning Evidence Baseline

**Source classification:** `EXECUTION — B-11E-C build output recorded in work context`; `REPOSITORY — current configuration and B-11G/B-11J records`; `INFERENCE — explicitly labeled below`; `UNVERIFIED — runtime or performance effect not tested`.

The B-11E-C `npm run build` output recorded a successful build and these warnings:

1. `The plugin "vite-tsconfig-paths" is detected. Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option. You can remove the plugin and set resolve.tsconfigPaths: true in your Vite config instead.`
2. `Some chunks are larger than 500 kB after minification.` The output lists `index-Ba2akiBi.js` at 532.86 kB and gzip at 165.62 kB. The warning recommends code splitting and a configurable warning limit.
3. `inlineDynamicImports option is ignored because the codeSplitting option is specified.`

The warning text is recorded from the prior B-11E-C build output, not reproduced in this work package. The build completed; these messages were warnings, not build failures. No application runtime, production deployment, or user-performance test was performed here.

## 5. W-01 — `vite-tsconfig-paths` Redundancy Notice

- **Warning ID:** `W-01`
- **Exact warning:** `The plugin "vite-tsconfig-paths" is detected. Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option. You can remove the plugin and set resolve.tsconfigPaths: true in your Vite config instead.`
- **Observed evidence:** Recorded B-11E-C build output emitted this Vite notice. `package.json` declares `vite-tsconfig-paths`; `vite.config.ts` imports the shared `@lovable.dev/vite-tanstack-config` wrapper rather than directly adding the plugin.
- **Configuration evidence:** The `vite.config.ts` header says the wrapper already includes `tsConfigPaths`, the `@` alias, TanStack Start, Nitro, and other plugins, and instructs maintainers not to add duplicate plugins manually. The Vite notice itself recommends native `resolve.tsconfigPaths`. Repository source does not establish how the wrapper can selectively remove its plugin while preserving alias/SSR behavior.
- **Materiality assessment:** `UNDETERMINED`. The wording is an informational redundancy notice and the recorded build succeeded; no path-resolution failure was observed. Whether removing the wrapper-provided plugin changes alias resolution, SSR, or development behavior has not been tested.
- **Technical recommendation:** `REQUEST ADDITIONAL INVESTIGATION` before selecting removal or acceptance. A separately authorized investigation should establish wrapper configurability and compare resolved paths/SSR behavior. This is a recommendation, not an approved decision.
- **Options for the Project Owner:**
  - `ACCEPT AS NON-MATERIAL` with a rationale, impact/risk, accountable owner, and review trigger/date.
  - `AUTHORIZE SEPARATE REMEDIATION` for a narrowly scoped configuration cleanup and verification.
  - `REQUEST ADDITIONAL INVESTIGATION` into wrapper ownership and path-resolution behavior.
- **Confirmed Project Owner decision (2026-11-16):** `REQUEST ADDITIONAL INVESTIGATION`
- **Decision rationale:** Recorded verbatim in Section 10.
- **Accountable owner:** `PENDING PROJECT OWNER CONFIRMATION`
- **Review trigger/date:** `PENDING PROJECT OWNER CONFIRMATION`
- **Follow-up package:** Proposed separate investigation package: B-11K-W01. Scope and execution authorization remain pending separate package approval.

## 6. W-02 — Client Bundle Size Warning

- **Warning ID:** `W-02`
- **Exact warning:** `Some chunks are larger than 500 kB after minification.` The build output recommends code splitting and allows changing the chunk-size warning limit.
- **Observed evidence:** The recorded client asset table lists `index-Ba2akiBi.js` at 532.86 kB and gzip at 165.62 kB. Thus 532.86 kB is the reported minified chunk size before gzip; 165.62 kB is the gzip size. The named `index-...js` asset is the observed oversized chunk, not an aggregate of every emitted asset.
- **Code-splitting evidence:** The same build output lists separate route-named assets (for example account, coach, referee, schedule, and tournament chunks), indicating that some output chunking is already present. This does not establish which routes are lazy-loaded at navigation time or whether further splitting is beneficial.
- **Potential impact:** A larger entry chunk can increase transfer, parse, and evaluation work for clients that load it. The gzip figure is lower, but does not by itself establish that the warning is harmless. No target-device measurements, network traces, route-level loading analysis, performance budget, or user-impact data are available.
- **Materiality assessment:** `UNDETERMINED`. The chunk exceeds the tool's 500 kB advisory threshold; the repository contains no approved prototype bundle budget or performance measurements establishing materiality.
- **Technical recommendation:** `REQUEST ADDITIONAL INVESTIGATION` before accepting the warning or authorizing code splitting/remediation. A separately scoped bundle analysis should identify chunk contents, initial-route loading, and relevant target performance criteria. This is a recommendation, not an approved decision.
- **Options for the Project Owner:**
  - `ACCEPT AS NON-MATERIAL` for the prototype only, with rationale, impact/risk, accountable owner, and a review trigger such as selecting a target device/network budget.
  - `AUTHORIZE SEPARATE REMEDIATION` for bundle analysis and, if justified, code-splitting/lazy-loading changes.
  - `REQUEST ADDITIONAL INVESTIGATION` before classifying materiality.
- **Confirmed Project Owner decision (2026-11-16):** `REQUEST ADDITIONAL INVESTIGATION`
- **Decision rationale:** Recorded verbatim in Section 10.
- **Accountable owner:** `PENDING PROJECT OWNER CONFIRMATION`
- **Review trigger/date:** `PENDING PROJECT OWNER CONFIRMATION`
- **Follow-up package:** Proposed separate investigation package: B-11K-W02. Scope and execution authorization remain pending separate package approval.

## 7. W-03 — Nitro `inlineDynamicImports` Warning

- **Warning ID:** `W-03`
- **Exact warning:** `inlineDynamicImports option is ignored because the codeSplitting option is specified.`
- **Observed evidence:** The recorded B-11E-C Nitro/Vite build emitted this warning while producing the Cloudflare-module output successfully.
- **Configuration evidence:** `vite.config.ts` uses `@lovable.dev/vite-tanstack-config` and overrides the TanStack Start server entry. Its header says the wrapper supplies Nitro using a Cloudflare default target. Repository-owned configuration does not explicitly set `inlineDynamicImports` or `codeSplitting`; the precise source and intended value of `inlineDynamicImports` are not established by the checked-in Vite config.
- **Potential effect:** The warning says that `inlineDynamicImports` is ignored when `codeSplitting` is specified. The build output demonstrates that a build completed, but does not establish whether the ignored option was intended to alter output layout, whether the generated worker behaves as intended in a deployed environment, or whether any runtime/deployment impact exists.
- **Materiality assessment:** `UNDETERMINED`. No runtime or deployment test was performed, and the option's origin/intent is not explicit in repository-owned configuration.
- **Technical recommendation:** `REQUEST ADDITIONAL INVESTIGATION` to trace wrapper/Nitro effective configuration and compare it with the intended output before accepting or changing the option. This is a recommendation, not an approved decision.
- **Options for the Project Owner:**
  - `ACCEPT AS NON-MATERIAL` only with a documented reason, impact/risk, accountable owner, and review trigger/date.
  - `AUTHORIZE SEPARATE REMEDIATION` for a configuration investigation/cleanup and non-production build/runtime verification.
  - `REQUEST ADDITIONAL INVESTIGATION` into option origin, effective configuration, and output expectations.
- **Confirmed Project Owner decision (2026-11-16):** `REQUEST ADDITIONAL INVESTIGATION`
- **Decision rationale:** Recorded verbatim in Section 10.
- **Accountable owner:** `PENDING PROJECT OWNER CONFIRMATION`
- **Review trigger/date:** `PENDING PROJECT OWNER CONFIRMATION`
- **Follow-up package:** Proposed separate investigation package: B-11K-W03. Scope and execution authorization remain pending separate package approval.

## 8. Consolidated Owner Decision Register

| Warning | Evidence-supported materiality | Technical recommendation (not approval) | Owner decision | Rationale / accountable owner / review trigger |
|---|---|---|---|---|
| W-01 — `vite-tsconfig-paths` | `UNDETERMINED` | `REQUEST ADDITIONAL INVESTIGATION` | `CONFIRMED OWNER DECISION` | Investigation owner and review trigger await separate package approval |
| W-02 — client bundle size | `UNDETERMINED` | `REQUEST ADDITIONAL INVESTIGATION` | `CONFIRMED OWNER DECISION` | Investigation owner and review trigger await separate package approval |
| W-03 — Nitro `inlineDynamicImports` | `UNDETERMINED` | `REQUEST ADDITIONAL INVESTIGATION` | `CONFIRMED OWNER DECISION` | Investigation owner and review trigger await separate package approval |

The Project Owner selected `REQUEST ADDITIONAL INVESTIGATION` for all three warnings. This is not acceptance as non-material, a declaration that a warning is material, or remediation approval. Any eventual acceptance must meet B-11G D-06; any material issue must be fixed under separately authorized scope.

## 9. Consequences and Follow-up Work Packages

- **If accepted as non-material:** The owner-approved record must identify the exact warning, why it is non-material for the selected prototype scope, impact/risk, accountable owner, and review trigger/date. Acceptance applies only to the stated scope and does not imply pre-release or production acceptance.
- **If remediation is authorized:** Define a separate bounded package, verify the relevant change, and rerun only the checks required by that scope. No source/configuration changes are authorized by this proposal.
- **Confirmed direction:** The Project Owner requested additional investigation for W-01, W-02, and W-03. Any investigation requires its own separately scoped and authorized package with explicit evidence sources, permitted commands/files, and verification gates. This B-11K record itself does not authorize execution of that future package. Do not change configuration unless separately authorized.
- **W-01 follow-up:** Verify whether the shared wrapper permits selecting native `resolve.tsconfigPaths` without losing existing alias/SSR behavior.
- **W-02 follow-up:** Analyze entry-chunk contents and route loading against owner-selected prototype performance criteria; do not lower the warning threshold merely to silence the notice.
- **W-03 follow-up:** Trace the effective Nitro options provided by the wrapper and verify expected output/runtime behavior in an authorized non-production environment.

The investigation scopes above remain proposals pending a separately authorized package. The confirmed request for investigation does not authorize implementation, build configuration changes, CI, deployment, or production activity.

## 10. Project Owner Approval Record

- **Approval date:** 2026-11-16
- **Authority:** Project Owner
- **Approval scope:** Formal disposition decision for W-01, W-02, and W-03 only.
- **Project Owner rationale (verbatim):**

  > Lakukan investigasi teknis terlebih dahulu. Jangan melakukan perubahan konfigurasi sebelum hasil investigasi dan ruang lingkup remediation disetujui.

| Warning | Confirmed Project Owner decision | Status | Materiality / acceptance |
|---|---|---|---|
| W-01 — `vite-tsconfig-paths` redundancy | `REQUEST ADDITIONAL INVESTIGATION` | `CONFIRMED OWNER DECISION` | `UNDETERMINED`; not accepted as non-material |
| W-02 — client bundle size | `REQUEST ADDITIONAL INVESTIGATION` | `CONFIRMED OWNER DECISION` | `UNDETERMINED`; not accepted as non-material |
| W-03 — Nitro `inlineDynamicImports` | `REQUEST ADDITIONAL INVESTIGATION` | `CONFIRMED OWNER DECISION` | `UNDETERMINED`; not accepted as non-material |

**Authorization boundary:** This approval authorizes technical investigation only within a separately scoped and separately authorized investigation package. This record itself does not authorize execution of that future package.

- **Implementation authorization:** `NOT AUTHORIZED`
- **Configuration changes:** `NOT AUTHORIZED`
- **Remediation:** `NOT AUTHORIZED`
- **Deployment or production release:** `NOT AUTHORIZED`
- **Investigation package owner/scope/allowed commands/files/verification gates:** `PENDING SEPARATE PACKAGE APPROVAL`
- **Project Owner name:** Not provided in the decision record; no name is inferred.
- **Signature:** Not provided; no signature is inferred.

No warning is accepted as non-material or declared material solely by this approval. Any future remediation requires separate explicit Project Owner authorization. An exception under D-10 cannot override separate security, database, access-control, or production-authorization requirements.

## 11. Relationship to B-11J Closure

B-11J determined that B-11 is not closed because D-06 warning dispositions and D-08 Node standardization are not satisfied; it also recorded partial D-04 test coverage evidence. This B-11K document formally records the Project Owner's request for additional investigation for D-06 warnings; that request is not a final materiality disposition. D-06 remains unsatisfied until each warning receives a compliant disposition or authorized work fixes material issues. B-11J remains unchanged.

B-11K does not satisfy D-08, resolve D-04, authorize implementation, or close B-11. D-10 exception authority remains with the Project Owner. Separate security/database and release/deployment approvals are unaffected.

## 12. Final Status

**B-11K STATUS: OWNER DECISIONS RECORDED — INVESTIGATION PACKAGE NOT AUTHORIZED BY THIS RECORD.**

**B-11 STATUS: NOT CLOSED.** No build warning is accepted by default. No implementation, configuration change, CI, deployment, production release, or exception is authorized by this document.
