# Phase 1B B-11K W-01 Investigation Proposal — Vite Configuration Wrapper

## 1. Document Control
- **Work package:** B-11K-W01 — Vite Configuration Wrapper
- **Assessment date:** 2026-11-16
- **Repository:** `apssi_platform`
- **Branch / HEAD:** `chore/phase-1a-governance-reconciliation` / `6da46b5058d38ebff302b7934ce576d149573a08`
- **Warning under review:** W-01 — Vite notice that `vite-tsconfig-paths` is detected and native `resolve.tsconfigPaths` is recommended.
- **Authorizing decision:** `REQUEST ADDITIONAL INVESTIGATION`
- **Materiality:** `UNDETERMINED`
- **Proposal status:** `PENDING SEPARATE PROJECT OWNER APPROVAL`
- **Investigation execution:** `NOT AUTHORIZED BY THIS PROPOSAL`
- **Implementation/remediation:** `NOT AUTHORIZED`
- **Configuration changes:** `NOT AUTHORIZED`
- **Deployment/production activity:** `NOT AUTHORIZED`
- **Scope:** Prepare a proposal-only investigation plan for wrapper ownership, effective configuration, native Vite resolution equivalence, and alias/SSR effects without changing the current repository state.
- **Exclusions:** This proposal does not execute any investigation, change any config, install packages, build the app, alter dependencies, or authorize implementation.

## 2. Project Owner Decision and Authorization Context
This proposal is derived from the confirmed B-11K owner disposition: `REQUEST ADDITIONAL INVESTIGATION` for W-01.

The Project Owner rationale recorded in the B-11K disposition remains authoritative and unchanged:

> Lakukan investigasi teknis terlebih dahulu. Jangan melakukan perubahan konfigurasi sebelum hasil investigasi dan ruang lingkup remediation disetujui.

This proposal does not alter the disclosed uncertainty. The warning remains `UNDETERMINED` for materiality, and the package remains `PENDING SEPARATE PROJECT OWNER APPROVAL`.

This proposal explicitly does not authorize:
- investigation execution;
- remediation or implementation;
- Vite, package, or config changes;
- deployment or production activity.

## 3. Investigation Objective
The objective is to prepare a review-ready investigation plan for the Vite warning that states:

`The plugin "vite-tsconfig-paths" is detected. Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option.`

The investigation must answer only the following technical questions without changing the repository configuration:
- What is the origin and ownership of the detected `vite-tsconfig-paths` plugin?
- What effective configuration is supplied by `@lovable.dev/vite-tanstack-config` in this repository?
- Does the wrapper support native `resolve.tsconfigPaths` behavior as an equivalent or alternative pathway?
- Would removing or disabling the wrapper-provided plugin affect alias resolution, dev-server resolution, SSR, or TanStack Start behavior?
- How could equivalence be verified without changing the current project configuration?

## 4. Existing Evidence Baseline
The following evidence is recorded and must be used as the baseline for this proposal:

- Current repository configuration: [`vite.config.ts`](../../vite.config.ts) delegates to `@lovable.dev/vite-tanstack-config` and comments that the wrapper already supplies `tsConfigPaths`, the `@` alias, TanStack Start, Nitro, and related plugins.
- Current package metadata: [`package.json`](../../package.json) declares `vite-tsconfig-paths` in the dependency set and `@lovable.dev/vite-tanstack-config` in `devDependencies`.
- B-11K owner disposition: records W-01 as `UNDETERMINED` and confirms the owner decision `REQUEST ADDITIONAL INVESTIGATION`.
- B-11G D-06: requires every build warning to be reviewed and assigned a documented disposition. It does not authorize remediation or configuration change by itself.
- B-11J and B-11K records together establish that no runtime failure, path-resolution failure, or production validation was observed for W-01.

Known limitations:
- The repository-owned Vite config does not show the wrapper's full internal implementation.
- The checked-in files do not establish whether the wrapper can selectively remove the plugin without changing alias or SSR behavior.
- The recorded B-11E-C build output is historical evidence; this proposal does not reproduce or re-run it.
- This proposal does not assume that native Vite resolution is equivalent to the wrapper and does not assume the wrapper can be modified.

## 5. Questions to Be Answered
1. Who owns the `vite-tsconfig-paths` plugin detection in the current build pipeline, and what is the path by which it is applied?
2. Does the wrapper `@lovable.dev/vite-tanstack-config` add `tsConfigPaths` explicitly or via a translated config object, and what is the final effective Vite configuration?
3. Does the wrapper expose an equivalent native `resolve.tsconfigPaths` configuration path, or does it intentionally hide that option behind its own wrapper semantics?
4. If the wrapper plugin were removed or disabled, would the `@` alias, dev-server resolution, SSR resolution, or TanStack Start server setup remain functionally equivalent?
5. What read-only verification procedure could demonstrate equivalence without editing `vite.config.ts`, package manifests, or dependency files?

## 6. Proposed Investigation Scope
The future investigation, if separately approved, should be limited to the following read-only tasks:
- Compare repository-owned config with the wrapper package metadata and any installed wrapper implementation already present in the local project environment.
- Trace the effective Vite config, plugin list, and alias resolution rules as supplied by the wrapper.
- Distinguish the repository-owned config layer from the wrapper-provided effective plugin set.
- Determine whether native `resolve.tsconfigPaths` is a supported equivalent option and whether the wrapper explicitly chooses a plugin-based path for compatibility or SSR reasons.
- Evaluate possible alias/SSR/TanStack Start impact under read-only static analysis only.
- Define the minimum evidence required to show a safe equivalence case without modifying project configuration.

This scope excludes any optimization, config cleanup, or implementation change. It also excludes treating the warning as accepted or rejected without owner confirmation.

## 7. Proposed Permitted Files and Sources
The following are the exact repository and package sources that a future, separately authorized investigation may inspect, using read-only methods only:

- `vite.config.ts`
- `package.json`
- `package-lock.json` (if present in the evaluated revision)
- `node_modules/@lovable.dev/vite-tanstack-config` package files, if installed and available locally in the working environment or disposable checkout without modifying dependencies
- `node_modules/vite-tsconfig-paths` package metadata, if installed and available, read only for package ownership and configuration references
- Relevant TanStack Start / Vite config objects and authored route or SSR server entry files already present in the repository, as required to understand alias behavior and server bootstrap
- Historical B-11K / B-11G / B-11J records and the current repository-owned configuration evidence already recorded in the repository

Installed package files may be inspected only when already available in the authorized working environment. Missing package files must be reported as unavailable; no installation, restoration, or dependency preparation is permitted.

This proposal does not extend to modifying package files, adding or removing dependencies, or reading unrelated systems or production environments.

## 8. Proposed Commands and Methods
The following are the proposed read-only commands and methods for a future separately authorized investigation. They are not executed by this proposal:

- `git grep` or `git show` to locate wrapper configuration references and package usage
- `node -p` or `node -e` may be used only to read narrowly scoped package metadata or explicitly identified static values without importing or evaluating application configuration, wrapper configuration functions, or build-pipeline modules.
- `npm ls vite-tsconfig-paths @lovable.dev/vite-tanstack-config` to confirm dependency graph and package presence without modifying anything
- `npm explain vite-tsconfig-paths` or equivalent package metadata readouts to confirm package role and ownership, if available in the authorized environment
- Read-only inspection of the installed wrapper package files, if present locally, to match the effective config against the repository-owned `vite.config.ts`
- Static comparison of alias and server-entry behavior from repository-owned files and wrapper metadata only
- No build, no install, no dependency update, no lockfile change, and no config rewrite

## 9. Expected Deliverables
A future, separately authorized investigation package should produce:
- A short factual summary of the wrapper's origin, ownership, and configuration path.
- A precise description of the effective Vite config supplied by `@lovable.dev/vite-tanstack-config`.
- A comparison of wrapper-provided path resolution with native Vite `resolve.tsconfigPaths` semantics.
- A documented statement on whether alias and SSR behavior are likely equivalent or whether the wrapper intentionally preserves plugin-based behavior.
- A list of remaining unknowns and the exact evidence required to resolve them.
- A proposed owner decision recommendation: accepted as non-material, no change required, or additional remediation after separate approval.

This proposal does not require or authorize any implementation change, code fix, or configuration cleanup.

## 10. Verification and Acceptance Criteria
A future investigation should be considered complete only when the following evidence is available:
- The origin of the `vite-tsconfig-paths` plugin is traced to the actual applied wrapper or package path in the evaluated environment.
- The wrapper-supplied effective Vite config is described and compared with the repository-owned config.
- The wrapper's support for `resolve.tsconfigPaths` is documented as either supported, unsupported, or intentionally not used.
- The alias and SSR/TanStack Start impact of removing or disabling the plugin is evaluated with explicit limitations and no unverified assumptions.
- The evidence is recorded without modifying any configuration or dependencies.
- The owner can determine whether a future config change would be a safe equivalence change or a behavior-altering change requiring separate authorization.

Acceptance does not mean the warning is declared material or non-material. It only means the evidence is sufficient to support a later owner disposition under D-06.

Static inspection of the wrapper and its configuration may establish the configured plugin path, but it does not establish runtime equivalence. Any runtime verification requirement must be identified separately and submitted for explicit Project Owner authorization.

Any required evidence that is unavailable, inaccessible within the authorized static-inspection scope, or not established by the available materials must be recorded as `UNVERIFIED`. The absence of an observed failure must not be treated as proof that the relevant behavior is correct or equivalent.

## 11. Prohibited Actions and Scope Boundaries
This proposal prohibits the following actions during proposal preparation and any future execution unless separately authorized by Project Owner approval:
- Editing `vite.config.ts`, `package.json`, lockfiles, or dependency manifests.
- Installing, updating, removing, or auditing dependencies.
- Running a build, preview, or dev-server command for the purpose of verifying path resolution.
- Removing or disabling the wrapper plugin or changing TanStack Start/Vite/Nitro settings.
- Treating native Vite resolution as equivalent without explicit evidence.
- Making configuration or code changes as a supposed remediation.
- Accessing production systems, deployment environments, or non-repository infrastructure.
- Staging, committing, or pushing any file.

## 12. STOP Conditions
This proposal must stop immediately if any of the following occurs:
- The repository branch or HEAD does not match the expected B-11K baseline.
- The project state includes staged or unapproved changes beyond the permitted proposal files.
- A future investigation attempts to execute a build, install dependencies, alter config, or modify lockfiles.
- The owner does not separately authorize the investigation package before its execution.
- The project team attempts to infer equivalence without direct evidence from the wrapper/package metadata and repository config.
- The investigation begins to suggest a configuration change or remediation as if already approved.

## 13. Dependencies and Risks
- **Repository dependency risk:** The required configuration evidence is distributed across repository-owned files and wrapper package metadata, so the investigation must segregate repository-owned config from wrapper-internal behavior.
- **Evidence risk:** The repository does not fully disclose wrapper internals, so any statement about equivalence must be explicitly qualified as a read-only static conclusion, not a live runtime verification.
- **Operational risk:** A misapplied plugin removal or alias change could affect local dev behavior, SSR, and TanStack Start startup; this remains outside this proposal's authorization.
- **Governance risk:** This proposal is not a remediation approval and does not permit change execution.

## 14. Project Owner Authorization Record
This section documents the proposal-only authorization boundary and intentionally leaves approval fields blank.

- **Project Owner decision:** `REQUEST ADDITIONAL INVESTIGATION`
- **Materiality:** `UNDETERMINED`
- **Proposal status:** `PENDING SEPARATE PROJECT OWNER APPROVAL`
- **Investigation execution:** `NOT AUTHORIZED BY THIS PROPOSAL`
- **Implementation/remediation:** `NOT AUTHORIZED`
- **Configuration changes:** `NOT AUTHORIZED`
- **Deployment/production activity:** `NOT AUTHORIZED`
- **Project Owner name:** ______________________________
- **Project Owner signature:** ______________________________
- **Approval date:** ______________________________
- **Project Owner approval decision:** ______________________________
- **Scope approval:** ______________________________
- **Comments / conditions:** _______________________________________________

No name, signature, date, or approval is inferred or invented.

## 15. Final Proposal Status
**Project Owner decision:** `REQUEST ADDITIONAL INVESTIGATION`

**Materiality:** `UNDETERMINED`

**Proposal status:** `PENDING SEPARATE PROJECT OWNER APPROVAL`

**Investigation execution:** `NOT AUTHORIZED BY THIS PROPOSAL`

**Implementation/remediation:** `NOT AUTHORIZED`

**Configuration changes:** `NOT AUTHORIZED`

**Deployment/production activity:** `NOT AUTHORIZED`

This proposal is prepared for review only. It describes a future, separately authorized investigation package but does not authorize any execution, configuration adjustment, remediation, or production activity.

**B-11K STATUS: INVESTIGATION PROPOSAL PREPARED; PROJECT OWNER APPROVAL REQUIRED BEFORE EXECUTION.**
