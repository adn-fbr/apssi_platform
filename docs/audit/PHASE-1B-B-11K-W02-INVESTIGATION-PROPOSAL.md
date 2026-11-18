# Phase 1B B-11K W-02 Investigation Proposal — Client Bundle Composition and Loading Behavior

## 1. Document Control
- **Work package:** B-11K-W02 — Client Bundle Composition and Loading Behavior
- **Assessment date:** 2026-11-16
- **Repository:** `apssi_platform`
- **Branch / HEAD:** `chore/phase-1a-governance-reconciliation` / `6da46b5058d38ebff302b7934ce576d149573a08`
- **Warning under review:** W-02 — `Some chunks are larger than 500 kB after minification.`
- **Observed output reference:** `index-Ba2akiBi.js` reported at 532.86 kB minified and 165.62 kB gzip.
- **Authorizing decision:** `REQUEST ADDITIONAL INVESTIGATION`
- **Materiality:** `UNDETERMINED`
- **Proposal status:** `PENDING SEPARATE PROJECT OWNER APPROVAL`
- **Investigation execution:** `NOT AUTHORIZED BY THIS PROPOSAL`
- **Implementation/remediation:** `NOT AUTHORIZED`
- **Configuration changes:** `NOT AUTHORIZED`
- **Deployment/production activity:** `NOT AUTHORIZED`
- **Scope:** Prepare a proposal-only investigation plan for chunk composition, route loading, and the criteria required to judge materiality without changing the current repository state.
- **Exclusions:** This proposal does not execute a build, create bundle artifacts, implement lazy loading or code splitting, or authorize optimization work.

## 2. Project Owner Decision and Authorization Context
This proposal is derived from the confirmed B-11K owner disposition: `REQUEST ADDITIONAL INVESTIGATION` for W-02.

The Project Owner rationale recorded in the B-11K disposition remains authoritative and unchanged:

> Lakukan investigasi teknis terlebih dahulu. Jangan melakukan perubahan konfigurasi sebelum hasil investigasi dan ruang lingkup remediation disetujui.

This proposal does not alter the recorded uncertainty. The current materiality assessment remains `UNDETERMINED` because no target-device/network performance budget, route-level loading measurement, or deploy/runtime verification exists.

This proposal explicitly does not authorize:
- bundle analysis execution beyond a separately approved investigation package;
- code splitting or lazy loading implementation;
- dependency removal or optimization changes;
- build or deployment activity.

## 3. Investigation Objective
The objective is to prepare a review-ready investigation plan for the bundle-size warning recorded in the B-11E-C build output. The future investigation must answer the following questions without changing the repository configuration:
- Which modules and dependency groups contribute to the reported oversized client entry chunk?
- Which route chunks exist in the emitted bundle, and are they actually lazy-loaded at navigation time?
- What is the difference between emitted chunk structure and true runtime loading behavior?
- What performance criteria or target-device/network assumptions are required before materiality can be judged?
- How can evidence be gathered and assessed without lowering the warning threshold or changing the working codebase?

## 4. Existing Evidence Baseline
The following evidence is recorded and must be used as the baseline for this proposal:

- B-11K owner record: W-02 is assigned `UNDETERMINED` and `REQUEST ADDITIONAL INVESTIGATION`.
- The B-11E-C build output recorded `index-Ba2akiBi.js` at 532.86 kB minified and 165.62 kB gzip, exceeding the 500 kB advisory threshold.
- The same build output also lists separate route-named chunks (for example account, coach, referee, schedule, and tournament), which indicates some chunking is already present.
- B-11G D-06 requires every build warning to receive a formal disposition. It does not authorize changing the build warning threshold or performing optimization work by itself.
- B-11J records that the latest build passed but the warning remained un-dispositioned, and it notes that no target-device benchmarks or deployment performance measurements are available.

Known limitations:
- The recorded build is historical evidence; it is not reproduced in this proposal.
- The repository contains no owner-approved performance budget or target-device benchmark for this prototype.
- The build output establishes the presence of a large chunk but does not prove that the chunk is materially harmful in runtime loading or user-perceived performance.
- This proposal does not assume the threshold warning is harmless just because gzip size is lower than minified size.

## 5. Questions to Be Answered
1. What actual modules and dependency groups contribute to the `index-Ba2akiBi.js` entry chunk in the recorded build output?
2. Which route chunks exist, and which ones are emitted as distinct lazy-loaded assets versus part of the main entry delivery?
3. Do route-level navigation behaviors in the application correspond to actual chunk loading at runtime, or do emitted chunks differ from runtime load timing?
4. Which device, network, and performance assumptions are required to judge whether the chunk size is material for the approved prototype or specific user flows?
5. What evidence is sufficient to classify the chunk as material or non-material without changing the current project configuration or threshold?

## 6. Proposed Investigation Scope
The future investigation, if separately approved, should be limited to the following read-only tasks:
- Identify the actual modules and dependency groups contributing to the oversized entry asset using the recorded build artifact or a disposable-checkout copy of the same revision, without changing the active project state.
- Compare the emitted chunk list with route definitions, import boundaries, and lazy-loading configuration to document what the available static evidence establishes about chunk structure, without inferring actual browser loading behavior.
- Distinguish statically observed bundle structure from runtime-loading behavior, and report runtime behavior as `UNVERIFIED` when supporting authorized evidence is unavailable.
- Define the project owner's required performance criteria, including target-device assumptions, network profile, and acceptable budget for the prototype.
- Document the evidence needed to classify the warning as material or non-material under D-06 without implementing improvements or changing the threshold.

The W-02 investigation is static and evidence-based: it may inspect route/import definitions, existing build output or archived artifacts, and static module/dependency metadata only when already available in the separately authorized investigation environment. Review of existing runtime evidence is permitted only when that evidence is already available and its use is authorized. This allowance does not authorize accessing production systems, deployment environments, or user-facing runtime telemetry to obtain evidence; those sources remain excluded from this proposal. This package does not generate new runtime evidence. Static evidence alone cannot establish actual browser loading timing, navigation performance, or precise runtime module contribution. If relevant evidence is unavailable within the authorized scope, the corresponding finding must be recorded as `UNVERIFIED`, and runtime loading or measured performance must not be inferred from emitted chunk structure. Browser runtime testing, navigation timing measurements, performance benchmarking, network-throttling experiments, device-specific performance measurements, and generation of a new build or artifacts solely to obtain missing evidence are outside this scope and require separate Project Owner authorization.

This scope excludes optimization authorizations, code-splitting implementation, dependency removal, or change of warning thresholds.

## 7. Proposed Analysis Inputs and Files
The following are the exact inputs and repository-owned files a future, separately authorized investigation may inspect:

- Historical B-11E-C build output and chunk summary showing `index-Ba2akiBi.js` at 532.86 kB / 165.62 kB gzip.
- `vite.config.ts`
- `package.json`
- `package-lock.json` if the evaluated revision includes it and if the investigation uses an archived or disposable copy of the build state
- `src/router.tsx` and route definitions in `src/routes` or other route declarations used by the app
- Entry/index modules, shared component modules, and route-level import boundaries that may contribute to the oversized entry asset
- Any archived build manifest or dist output if it exists in a disposable checkout or isolated build artifact created under explicit, separate authorization

Existing build artifacts and module-level metadata may be inspected only when already available in an authorized archived or disposable environment. If the required artifacts are unavailable, their absence must be documented. No build, rebuild, installation, or artifact generation is permitted to obtain missing evidence under this investigation scope.

The proposal does not authorize creating or modifying build outputs in the active working tree, and it does not authorize any optimization work in the repository.

## 8. Proposed Methods and Commands
The following are the proposed read-only methods and commands for a future separately authorized investigation. They are not executed by this proposal:

- Read-only inspection of the recorded B-11E-C build output and asset summary.
- `git grep` and route-map inspection to determine where route modules and entry logic are loaded.
- Static comparison of route definitions and imported modules to estimate which modules contribute to the entry chunk.
- Use of an archived or isolated build output only if available in a disposable checkout or preserved artifact under separate authorization.
- `npm ls` or package metadata inspection to confirm dependency structure and route-related package contributions without changing the project.
- Performance criteria review using repository evidence and owner-defined target assumptions; no benchmark execution is implied by this proposal.

No build, no bundle generation, no chunk optimization, no dependency change, and no threshold reduction are authorized by this proposal.

## 9. Expected Bundle Composition and Loading Evidence
A future investigation should produce:
- A module-level and dependency-group breakdown for the oversized entry asset.
- A list of emitted route chunks and the route/import definitions they correspond to.
- A comparison between emitted chunk structure and route/import definitions, together with any relevant runtime evidence that already exists and is authorized. If no such runtime evidence is available, actual runtime loading behavior, navigation timing, and performance must be reported as `UNVERIFIED`.
- A summary of whether the large entry chunk reflects initial-route delivery or broader shared dependencies.
- The performance assumptions that would have to be established before concluding that the warning is material.

This evidence must be recorded without asserting that the warning is harmless or material without owner-selected performance criteria.

## 10. Verification and Acceptance Criteria
A future investigation should be considered complete only when the following are documented:
- The actual modules contributing to the oversized entry chunk are identified from the recorded bundle or an archived/disposable copy.
- Route-chunk structure is compared with route definitions, import boundaries, and available lazy-loading configuration. Actual runtime loading behavior is assessed only from relevant runtime evidence that already exists and is authorized; otherwise, it is reported as `UNVERIFIED`.
- The distinction between statically observed emitted chunk structure and available runtime evidence is explicitly described, without inferring actual browser loading timing, navigation performance, or precise module contribution from static evidence alone.
- At least one owner-approved performance assumption is recorded for the prototype scope, including target device/network profile if required.
- Materiality is not declared without these assumptions, and a warning is not treated as benign based solely on gzip size.

Acceptance means that the evidence is sufficient for a later owner disposition under D-06. It does not imply that any optimization is approved.

Static inspection can establish route definitions, import boundaries, and emitted chunk relationships when supporting artifacts are available. It cannot independently establish actual browser loading timing or runtime behavior. Any runtime verification requirement must be identified separately and submitted for explicit Project Owner authorization.

If runtime evidence or module-level bundle metadata is unavailable, the investigation must report the relevant findings as UNVERIFIED. Static evidence must not be used to infer actual runtime loading behavior or precise module-level bundle contribution.

## 11. Prohibited Actions and Scope Boundaries
This proposal prohibits the following actions during proposal preparation and any future execution unless separately authorized by Project Owner approval:
- Lowering the Vite chunk warning threshold to suppress the warning.
- Implementing code splitting, lazy loading, dependency removal, or other optimization changes.
- Running a production build or any build command as part of proposal preparation.
- Editing route modules or app code to test bundle behavior.
- Deciding materiality based only on gzip size without device/network criteria.
- Accessing production systems, deployment environments, or user-facing runtime telemetry.
- Staging, committing, or pushing any file.

## 12. STOP Conditions
This proposal must stop immediately if any of the following occurs:
- The repository branch or HEAD does not match the expected B-11K baseline.
- The project state includes staged or unapproved changes beyond the permitted proposal files.
- A future investigation attempts to execute a build, optimize code, or change config without separate authorization.
- The project team treats the bundle warning as harmless without owner-selected performance criteria.
- The investigation begins implementing code-splitting or other optimization changes as if already approved.
- The owner has not separately approved the investigation package.

## 13. Dependencies and Risks
- **Build-output dependency:** The evidence depends on prior build output or a retained archived bundle artifact; if missing, the future investigation may need to rely on recorded output and static route analysis only.
- **Performance-risk assumption:** The warning may only be judged material with explicit target-device, loading, and network assumptions; without these, the warning remains `UNDETERMINED`.
- **Runtime-risk assumption:** A large minified chunk does not by itself prove a user-visible defect; route-level loading and chunk execution timing must be distinguished from bundle composition.
- **Governance risk:** This proposal does not authorize optimization work, threshold changes, or materiality acceptance.

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

This proposal is prepared for review only. It defines a future, separately authorized investigation package for bundle composition and runtime loading behavior without changing the active configuration or altering any optimization strategy.

**B-11K STATUS: INVESTIGATION PROPOSAL PREPARED; PROJECT OWNER APPROVAL REQUIRED BEFORE EXECUTION.**
