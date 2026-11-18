# Phase 1B Owner Decision Register

- **Prepared:** 2026-11-15
- **Source of truth:** [PHASE-1B-ENTRY-GATE.md](PHASE-1B-ENTRY-GATE.md)
- **Status:** WS-0 owner decision directions were recorded as approved on 2026-11-15. B-07 and B-09 owner-approved principles were additionally recorded on 2026-11-16 in WS-1. Their implementation and verification remain pending, and B-11 remains an open technical blocker. This register authorizes no implementation, database operation, project connection, or deployment.
- **Formal decision records:** [PHASE-1B-WS-0-OWNER-DECISIONS.md](PHASE-1B-WS-0-OWNER-DECISIONS.md) records the WS-0 decisions; [PHASE-1B-WS-1-OWNER-DECISION-RECORD.md](PHASE-1B-WS-1-OWNER-DECISION-RECORD.md) records the additional B-07/B-09 approval.

## Authority and Constraints

- [BRB-001](../product/BLUEPRINT-REQUIREMENT-BASELINE.md) remains the sole initial product requirement baseline. Requirements not stated there remain `UNDEFINED — OWNER DECISION REQUIRED`; technical choices not approved there remain `ARCHITECTURE DECISION REQUIRED`.
- OD-11 is approved and settled: VS Code is primary, GitHub/repository is canonical including migration source, and Lovable is limited to reviewed UI/frontend assistance. OD-11 is not reopened here.
- Supabase is an approved architectural direction, not evidence of a configured or connected project. No production database mutation or deployment is authorized.
- This register prepares owner decisions only. The proposed Phase 1 backlog does not authorize implementation.

## Count Summary

The Entry Gate contains **12** entries: **9 owner decision topics** (`B-01` through `B-06`, `B-08`, `B-10`, `B-12`) and **3 technical blockers** (`B-07`, `B-09`, `B-11`). WS-0 approved the directions for the nine owner decision topics on 2026-11-15; deferred details remain identified below. None of the three technical blockers is resolved by architectural approval. Original IDs are preserved.

## Owner Decision Register

### B-01 — Select a bounded Phase 1 work package

- **Classification:** `APPROVED / COMPLETED for P1-00A only`; **approval status:** `APPROVED 2026-11-15`. Every subsequent work package requires separate authorization.
- **Issue:** Select one bounded work package and approve its scope, exclusions, and acceptance criteria. No candidate backlog item is approved implementation scope.
- **Evidence:** [Entry Gate, Product Scope Readiness and B-01](PHASE-1B-ENTRY-GATE.md); [Proposed Phase 1 Backlog, candidate packages and entry conditions](../architecture/PROPOSED-PHASE-1-BACKLOG.md).
- **Approved decision:** P1-00A — Repository & Tooling Evidence Review — was explicitly approved, completed, and reviewed. This does not select or authorize a subsequent package.
- **Remaining condition:** Define and separately authorize each subsequent work package, including its scope and acceptance criteria.
- **Dependencies / affected workstreams:** Applies before any subsequent Phase 1B package; depends on B-02 for slice-specific product criteria.
- **Blocks:** All subsequent implementation until a bounded package is separately authorized.

### B-02 — Define slice-specific product behavior

- **Classification:** `APPROVED — SCOPED REQUIREMENTS PER VERTICAL SLICE`; **approval status:** `APPROVED 2026-11-15; slice-specific details remain pending`.
- **Issue:** Define only the behavior and acceptance criteria necessary for the selected slice. Do not infer identity, competition, payment, consent, or other rules from UI or mock data.
- **Evidence:** [BRB-001, Interpretation Rules and Explicitly Undefined](../product/BLUEPRINT-REQUIREMENT-BASELINE.md); [Entry Gate, Product Scope Readiness and B-02](PHASE-1B-ENTRY-GATE.md).
- **Approved decision:** Define product behavior and acceptance criteria per bounded vertical slice. The first slice and its business rules have not been selected.
- **Deferred details:** Requirements not stated by BRB-001 remain `UNDEFINED — OWNER DECISION REQUIRED` until decided for an authorized slice.
- **Deferral consequence:** The affected workflow cannot have reliable acceptance criteria; dependent implementation must wait.
- **Dependencies / affected workstreams:** B-01; affects the selected product-domain workstream.
- **Blocks:** Only work whose behavior or acceptance depends on the undefined detail.

### B-03 — Select the API/server boundary

- **Classification:** `APPROVED — TANSTACK START SERVER FUNCTIONS WITHIN A MODULAR MONOLITH`; **approval status:** `APPROVED 2026-11-15`.
- **Issue:** Select one authoritative API/server-function boundary and define the necessary service/domain contracts.
- **Evidence:** [Supabase Architecture Decisions, API/service boundary](../architecture/SUPABASE-ARCHITECTURE-DECISIONS.md); [Entry Gate, Architecture Readiness and B-03](PHASE-1B-ENTRY-GATE.md).
- **Approved decision:** Use TanStack Start server functions within a modular monolith as the initial server boundary. The decision does not establish that the boundary is implemented.
- **Deferred details:** Scope-specific contracts and implementation details require separate approval; do not infer them from the current SSR runtime.
- **Deferral consequence:** Slice-specific data-access contracts and trusted server-policy implementation remain undefined.
- **Dependencies / affected workstreams:** B-01 and B-04; blocks backend/API implementation.
- **Blocks:** Backend/API work, not read-only planning.

### B-04 — Decide project and environment topology

- **Classification:** `APPROVED WITH PROJECT/PROVIDER DETAILS DEFERRED`; **approval status:** `APPROVED 2026-11-15`.
- **Issue:** Establish project identity, environment separation, region, access ownership, and non-production/production topology. No Supabase project is verified as connected.
- **Evidence:** [Supabase Architecture Decisions, unresolved project/environment topology](../architecture/SUPABASE-ARCHITECTURE-DECISIONS.md); [Entry Gate, Architecture Readiness and B-04](PHASE-1B-ENTRY-GATE.md).
- **Approved decision:** Development, staging, and production environments are to be isolated.
- **Deferred details:** Hosting provider, Supabase project count/topology, region, and budget remain unresolved. No project is verified as configured or connected.
- **Deferral consequence:** Service configuration and environment-dependent implementation cannot be verified or safely targeted.
- **Dependencies / affected workstreams:** Platform owner/access; affects future backend, testing, and deployment work.
- **Blocks:** Service configuration and environment-dependent work; not repository-only planning.

### B-05 — Approve migration tooling and release operations

- **Classification:** `APPROVED WITH TOOLING/OPERATIONAL DETAILS DEFERRED`; **approval status:** `APPROVED 2026-11-15`.
- **Issue:** Define CLI/version/install policy, migration validation, CI/CD integration, review/approval gates, release sequencing, rollback/forward-fix, and production change approval. Migration source ownership itself is settled by OD-11.
- **Evidence:** [OD-11 migration ownership boundary](PHASE-0-OWNER-DECISION-RECORD.md); [Supabase Architecture Decisions, CLI and migration release process](../architecture/SUPABASE-ARCHITECTURE-DECISIONS.md); [Entry Gate, Operational Readiness and B-05](PHASE-1B-ENTRY-GATE.md).
- **Approved decision:** Database migrations are Git-managed; npm and `package-lock.json` are canonical package-management choices; migration changes require review and controlled release approval.
- **Deferred details:** CLI installation/version, CI implementation, migration validation/deployment procedures, and production release execution remain unresolved. This does not authorize CLI installation, project connection, SQL, migration creation/application, database mutation, or deployment.
- **Deferral consequence:** Repository ownership remains settled, but schema changes cannot be safely validated or deployed under an undefined operating process.
- **Dependencies / affected workstreams:** B-04, platform/engineering owners; blocks migration release workflow.
- **Blocks:** Database deployment workflow; no further decision on migration source ownership is needed.

### B-06 — Select secret-management ownership

- **Classification:** `APPROVED PRINCIPLES; VENDOR/CONFIGURATION DEFERRED`; **approval status:** `APPROVED 2026-11-15`.
- **Issue:** Assign secret provider and operators, environment mapping, rotation, access, revocation, and incident handling.
- **Evidence:** [Supabase Architecture Decisions, Secret boundary and unresolved secret management](../architecture/SUPABASE-ARCHITECTURE-DECISIONS.md); [Entry Gate, Operational Readiness and B-06](PHASE-1B-ENTRY-GATE.md).
- **Approved decision:** Use environment-specific secrets, least-privilege access, rotation and revocation capability; no secrets in Git or browser code.
- **Deferred details:** Secret-manager vendor, environment configuration, and operational rotation procedures remain unresolved.
- **Deferral consequence:** Secret-dependent integrations and deployments must remain blocked or unconfigured.
- **Dependencies / affected workstreams:** Platform/operations owner and B-04; affects service integration and deployment.
- **Blocks:** Secret-dependent integration/deployment, not documentation-only planning.

### B-08 — Define identity, guardian, consent, and privacy rules

- **Classification:** `APPROVED WITH IMPLEMENTATION DEFERRED`; **approval status:** `APPROVED 2026-11-15`.
- **Issue:** Define only the slice-required identity proofing, guardian verification/permissions, consent purpose/scope/lifecycle, and applicable privacy/legal interpretations.
- **Evidence:** [BRB-001, Explicitly undefined](../product/BLUEPRINT-REQUIREMENT-BASELINE.md); [Owner Decision Record, OD-05 through OD-07](PHASE-0-OWNER-DECISION-RECORD.md); [Entry Gate, Security and Privacy Readiness and B-08](PHASE-1B-ENTRY-GATE.md).
- **Approved decision:** Data-protection principles are approved. Sensitive identity, guardian, consent, and retention implementation is deferred pending detailed policy and qualified review.
- **Deferred details:** Identity-proofing method, guardian verification process, consent evidence/lifecycle, final retention/deletion policy, and legal/privacy interpretation remain `UNDEFINED — OWNER DECISION REQUIRED`. Do not encode these as implementation policy before approval.
- **Deferral consequence:** Guardian, consent, scout, or identity workflows that depend on these details cannot proceed; real child data remains disconnected.
- **Dependencies / affected workstreams:** B-01/B-02; product, security, and privacy/legal owners.
- **Blocks:** Affected identity/guardian/consent/scout work and all real-data use, not unrelated read-only setup.

### B-10 — Confirm fixture-data provenance

- **Classification:** `APPROVED`; **approval status:** `APPROVED 2026-11-15`.
- **Issue:** Confirm whether child-like fixture values are wholly synthetic and define their approved use; repository evidence cannot establish provenance.
- **Evidence:** [Security Gap Analysis, SG-02 and data-visible sample content](PHASE-0-SECURITY-GAP-ANALYSIS.md); [Entry Gate, B-10](PHASE-1B-ENTRY-GATE.md).
- **Approved decision:** Development and test fixtures must be synthetic-only. Unknown-provenance fixtures are not verified synthetic data.
- **Required evidence:** Document fixture provenance and intended use before treating any fixture as verified synthetic data. This decision does not establish the provenance of current fixtures.
- **Deferral consequence:** Current fixtures cannot be approved as synthetic; real youth-player data remains disconnected.
- **Dependencies / affected workstreams:** Data owner; testing and all data-using work.
- **Blocks:** Use of current fixtures as verified synthetic data and all real-data connection; not unrelated documentation work.

### B-12 — Assign hosting and operations ownership

- **Classification:** `APPROVED WITH PROVIDER/DETAIL SELECTION DEFERRED`; **approval status:** `APPROVED 2026-11-15`.
- **Issue:** Assign hosting, monitoring, backup/recovery, external-service, and on-call/operations responsibilities as required by the selected scope.
- **Evidence:** [Supabase Architecture Decisions, unresolved backup/recovery, external services, and hosting](../architecture/SUPABASE-ARCHITECTURE-DECISIONS.md); [Entry Gate, Operational Readiness and B-12](PHASE-1B-ENTRY-GATE.md).
- **Approved decision:** Establish accountable operational ownership before selecting hosting and deployment providers.
- **Deferred details:** Named operational owners, hosting provider, operational budget, service-level targets, and backup/incident-response assignments remain unresolved.
- **Deferral consequence:** Deployment, support, recovery, and external-service responsibilities remain unowned where needed.
- **Dependencies / affected workstreams:** B-01 and platform/operations owners.
- **Blocks:** Deployment/production readiness where applicable; not all non-production planning.

## Implementation Blockers

### B-07 — Trusted authentication and authorization

- **Classification:** `BLOCKER` (technical prerequisite; **owner approval:** `APPROVED 2026-11-16`; **implementation/verification:** `PENDING`).
- **Approved decision:** Trusted authentication and server-side authorization are mandatory foundations. Supabase Auth is approved as the initial authentication provider candidate. Protected resources and operations require trusted server-side authorization, default-deny and least-privilege principles, session validation, and controlled privileged operations. Browser-supplied roles, permissions, ownership flags, and authorization claims are not authoritative. Provider configuration and implementation require separate authorized work.
- **Outstanding owner decisions:** Business roles and permission matrix; authentication policy details, including MFA; guardian, youth-player, consent, and privacy-related access rules; and the first protected vertical slice. These remain unresolved.
- **Outstanding architecture decisions:** Session architecture and revocation implementation details and the server-side authorization design for the approved scope remain unresolved.
- **Evidence:** [WS-1 Owner Decision Record](PHASE-1B-WS-1-OWNER-DECISION-RECORD.md); [Security Gap Analysis, SG-01](PHASE-0-SECURITY-GAP-ANALYSIS.md); [Entry Gate, B-07](PHASE-1B-ENTRY-GATE.md). The checked-in app has no authenticated server boundary; client role selection is not authorization.
- **Prevents:** Authenticated pilot and all real-data access; it does not prevent non-production planning.
- **Resolution evidence:** Separately authorized scope and implementation, trusted checks, and passing positive/negative authorization tests. Owner approval alone does not resolve the blocker.
- **Dependencies:** B-01 through B-04 and B-08 for applicable policy.

### B-09 — Tenant isolation, RLS, and server data controls

- **Classification:** `BLOCKER` (technical prerequisite; **owner approval:** `APPROVED 2026-11-16`; **implementation/verification:** `PENDING`).
- **Approved decision:** A shared database with logical tenant isolation is the approved baseline architecture. Database grants and RLS or equivalent database controls are complementary security layers, and independent server-side authorization remains mandatory. Cross-tenant access is denied by default; least-privilege access and ownership validation are required; privileged database operations require separate controls.
- **Outstanding owner decisions:** Exact tenant, organization, and membership model; ownership and resource-relationship rules; data classification, retention, and privacy requirements; and the first protected vertical slice. These remain unresolved.
- **Outstanding architecture decisions:** Specific database grants; RLS policies and policy-evaluation strategy; JWT claims versus database lookup; and implementation of tenant-scoped access controls remain unresolved.
- **Evidence:** [WS-1 Owner Decision Record](PHASE-1B-WS-1-OWNER-DECISION-RECORD.md); [Security Gap Analysis, SG-03 through SG-06](PHASE-0-SECURITY-GAP-ANALYSIS.md); [Entry Gate, B-09](PHASE-1B-ENTRY-GATE.md). No server data path or policies are evidenced; no grant matrix or RLS policy set is approved or implemented.
- **Prevents:** Real-data access and an authenticated pilot using protected data; it does not prevent repository-only planning.
- **Resolution evidence:** Separately authorized data/policy scope, implementation, and passing cross-tenant, denial, and audit tests. Owner approval alone does not resolve the blocker. Production application still requires separate owner authorization.
- **Dependencies:** B-03 through B-08 and an approved slice.

### B-11 — Current engineering quality and release evidence

- **Classification:** `BLOCKER` for release readiness (technical prerequisite; **approval status:** `PENDING current verification`).
- **Prerequisite:** Establish current quality evidence for the selected scope: address the recorded lint failure, define required CI checks, add relevant domain/security tests, and run browser/E2E checks where required.
- **Evidence:** [package.json](../../package.json) and [Vitest configuration](../../vitest.config.ts); [Entry Gate, Engineering Quality Readiness and B-11](PHASE-1B-ENTRY-GATE.md). Two test files exist. The Entry Gate records historical Phase 0 results of 3 tests passing, build passing with warnings, direct TypeScript checking passing, lint failing with 97 errors/13 warnings, and no browser/E2E evidence; these were not rerun for this register.
- **Prevents:** Release readiness for the selected scope. The recorded lint failure is not by itself a blocker to every planning or non-production task.
- **Resolution evidence:** Owner-approved quality gate plus current, recorded test/build/lint/type/browser/security results for the selected scope.
- **Dependencies:** B-01 through B-10 as relevant; CI/browser environment and owner-approved gates.

## Next Governance Step

P1-00A — Repository & Tooling Evidence Review is approved and completed. No subsequent work package or first vertical slice has been selected or authorized. Prepare a separately scoped proposal for owner review, including the objective, scope, exclusions, dependencies, deliverables, and acceptance criteria. This register and the WS-0 decisions do not authorize that work or any implementation.

## Proposed Work Package for Owner Review

**Candidate:** P1-01A — Security & Access-Control Architecture Definition. **Type:** `DESIGN-ONLY`. **Status:** `PROPOSED — PENDING OWNER APPROVAL`.

- **Objective:** Define the architecture and owner decisions required to address the trusted authentication/authorization blocker B-07 and the tenant-isolation/data-control blocker B-09 for a future, explicitly selected vertical slice.
- **In scope, only after separate owner approval:** Document decision requirements and candidate architecture boundaries for trusted identity/session handling, default-deny server authorization, tenant isolation, RLS/data access, and required negative-test evidence. Identify unresolved policy questions, dependencies, and decision owners without deciding undefined product rules.
- **Out of scope:** Application/auth implementation; Supabase CLI use or installation; project connection; SQL or migrations; implementing or approving RLS policies; selecting an identity provider; defining identity, guardian, consent, retention, or other BRB-001-undefined business rules; accessing real personal data; deployment.
- **Prerequisites:** Owner approval of the exact P1-01A scope, deliverables, and acceptance criteria; confirmation of any architecture participants and evidence sources. BRB-001 remains the sole product baseline.
- **Deliverables:** Reviewed design artifact listing trust boundaries, authorization/data-isolation requirements, unresolved owner choices, threat and failure scenarios, dependencies, and proposed verification criteria. The artifact must distinguish approved directions from recommendations and undefined policy.
- **Acceptance criteria:** The artifact addresses B-07 and B-09 without claiming either blocker resolved; maps requirements to a future selected slice or explicitly records them as pending; contains no unapproved business/privacy rules; requires negative authorization and cross-tenant tests before protected-data use; makes no code, configuration, schema, project, or environment changes.
- **Dependencies and risks:** The first vertical slice is not selected. Detailed identity, guardian, consent, privacy, and project-topology decisions remain deferred. Design output alone does not establish implementation, security, pilot, or release readiness.
- **Approval boundary:** This is a proposal only. No P1-01A work begins without separate explicit owner authorization.

## Decision Status and Sequence

The nine WS-0 owner decision directions are recorded as approved on 2026-11-15: B-01 through B-06, B-08, B-10, and B-12. Their deferred details are listed in the corresponding entries above. B-07, B-09, and B-11 remain open technical blockers; architectural approval does not resolve them. OD-11 migration-source ownership remains settled and is not reopened.

Recommended governance sequence:

1. Review and separately authorize a bounded work-package proposal; no package is approved by this sequence.
2. Select a vertical slice and define only its required acceptance criteria (B-02).
3. Refine slice-specific service contracts and required environment topology details (B-03/B-04).
4. Decide remaining operational details needed by the slice (B-05/B-06/B-12).
5. Resolve applicable fixture provenance and identity/guardian/consent/privacy details before relevant workflows or real-data use (B-08/B-10).
6. Implement and verify the applicable technical blockers only under separate authorization; satisfy B-11 before release readiness.

This sequence is a recommendation, not implementation authorization.
