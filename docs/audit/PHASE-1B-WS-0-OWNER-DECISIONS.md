# Phase 1B WS-0 Owner Decisions

- **Project:** APSI Platform (`apssi_platform`)
- **Decision date:** 2026-11-15
- **Workstream:** WS-0 — Owner Decision Review
- **Status:** `WS-0: OWNER DECISIONS APPROVED WITH DEFERRED DETAILS`

## Authority and Evidence

This record is governed by [BRB-001](../product/BLUEPRINT-REQUIREMENT-BASELINE.md), the [Phase 0 Owner Decision Record](PHASE-0-OWNER-DECISION-RECORD.md), the [Development Workflow](../architecture/DEVELOPMENT-WORKFLOW.md), [Supabase Architecture Decisions](../architecture/SUPABASE-ARCHITECTURE-DECISIONS.md), the [Phase 1B Entry Gate](PHASE-1B-ENTRY-GATE.md), the [Phase 1B Owner Decision Register](PHASE-1B-OWNER-DECISION-REGISTER.md), and the [P1-00A Repository & Tooling Evidence Report](PHASE-1B-P1-00A-REPOSITORY-TOOLING-EVIDENCE-REPORT.md).

OD-11 remains authoritative and is not reopened by this decision. BRB-001 remains the sole initial product requirement baseline. Requirements and policies not defined by BRB-001 or an applicable approved owner decision remain undefined; this record does not infer them from UI, mock data, or technical direction.

## Owner-Approved Decisions

The following directions were approved on 2026-11-15. Approval is limited to the direction stated; deferred details remain unresolved.

| ID | Topic | Approved direction and boundary |
| --- | --- | --- |
| B-01 | Work package selection | P1-00A — Repository & Tooling Evidence Review — was approved and completed. Every subsequent package requires separate owner authorization. No subsequent package or first vertical slice is selected here. |
| B-02 | Product behavior | Define product behavior and acceptance criteria per bounded vertical slice. The first slice and its business rules have not been selected; unrelated requirements remain undefined. |
| B-03 | API/server boundary | Use TanStack Start server functions within a modular monolith as the initial server boundary. This approves a direction, not implementation or slice-specific contracts. |
| B-04 | Environment topology | Isolate development, staging, and production environments. Hosting provider, Supabase project count/topology, region, and budget remain deferred; no project is verified as configured or connected. |
| B-05 | Migration and release operations | Keep migrations Git-managed; use npm and `package-lock.json` as canonical package-management choices; require reviewed migration changes and controlled release approval. CLI installation/version, CI, validation/deployment procedures, and production release execution remain deferred. |
| B-06 | Secret management | Use environment-specific secrets, least-privilege access, and rotation/revocation capability; keep secrets out of Git and browser code. Vendor, configuration, and operating procedures remain deferred. |
| B-08 | Identity, guardian, consent, and privacy | Data-protection principles are approved. Sensitive identity, guardian, consent, and retention implementation is deferred pending detailed policy and qualified review. |
| B-10 | Fixture-data provenance | Development and test fixtures must be synthetic-only. Unknown-provenance fixtures are not verified synthetic data; this decision does not establish current fixture provenance. |
| B-12 | Hosting and operational ownership | Establish accountable operational ownership before selecting hosting and deployment providers. Named owners and operating details remain deferred. |

## Open Technical Blockers

The following Entry Gate classifications remain open. The WS-0 decisions do not resolve or reclassify them:

- **B-07 — Trusted authentication and authorization:** Trusted session handling and server-side, default-deny authorization require approved scope, implementation, and verification before authenticated or protected-data use.
- **B-09 — Tenant isolation, RLS, and server data controls:** Data-isolation architecture, implementation, server-side controls, and negative tests require approved scope and verification before protected-data use. No RLS policy set is approved or implemented by this record.
- **B-11 — Engineering quality and release evidence:** Current owner-approved quality gates and verification evidence are required before release readiness. Historical Phase 0 results are not current verification.

## Deferred Decisions and Boundaries

- A vertical slice and its business rules/acceptance criteria remain unselected. No product behavior is inferred beyond BRB-001 and the approved directions above.
- Supabase is an approved architectural direction, not evidence of a configured project or authorization to connect to one.
- Project topology, hosting, region, budget, identity provider, CLI version/install policy, migration validation and release procedures, CI enforcement, secret provider, and named operational owners remain unresolved as specified above.
- Identity proofing, guardian verification/permissions, consent purposes and lifecycle, retention/deletion policy, and legal/privacy interpretation remain undefined pending detailed decisions and qualified review.
- Fixture provenance remains unknown unless independently documented and verified.
- Technical blockers B-07, B-09, and B-11 require separate technical evidence; owner approval of architectural direction is not evidence of implementation or verification.

## Proposed Next Work Package

- **Candidate:** P1-01A — Security & Access-Control Architecture Definition
- **Type:** `DESIGN-ONLY`
- **Status:** `PROPOSED — PENDING OWNER APPROVAL`

**Objective:** Define architecture and decision requirements for B-07 and B-09 for a future, explicitly selected vertical slice. The proposal does not claim either blocker resolved.

**Proposed scope, only after separate authorization:** Document trust boundaries and requirements for trusted identity/session handling, default-deny server authorization, tenant isolation, server-side data controls, and required negative-test evidence. Identify unresolved policy decisions, owners, dependencies, threat/failure scenarios, and verification criteria. Distinguish approved directions from recommendations and undefined policy.

**Exclusions:** Application or authentication implementation; Supabase CLI installation or use; project connection; SQL or migration work; implementation or approval of RLS policies; selection of an identity provider; definition of identity, guardian, consent, retention, or other BRB-001-undefined business rules; access to real personal data; configuration changes; deployment.

**Prerequisites:** Separate owner approval of the exact scope, deliverables, and acceptance criteria; confirmation of participants and permitted evidence sources. BRB-001 remains the sole product baseline. The first vertical slice remains to be selected.

**Deliverables:** A reviewed design artifact covering trust boundaries, authorization and data-isolation requirements, unresolved owner choices, threat/failure scenarios, dependencies, and proposed verification criteria.

**Acceptance criteria:** The artifact addresses B-07 and B-09 without claiming either blocker resolved; maps requirements to a selected slice or explicitly records them as pending; introduces no unapproved business or privacy rules; requires negative authorization and cross-tenant tests before protected-data use; and makes no code, configuration, schema, project, or environment changes.

**Risks and dependencies:** The first slice is not selected. Identity, guardian, consent, privacy, and project-topology details remain deferred. Design output alone does not establish implementation, security, pilot, or release readiness.

**Approval request:** Review and approve, reject, or request changes to the exact P1-01A scope, exclusions, deliverables, and acceptance criteria before any work begins. Until that separate approval is recorded, P1-01A remains a proposal only.

## Authorization Boundary

This decision record documents owner-approved directions and a proposed next work package. It does not authorize implementation, tests/builds for an implementation, CLI installation or execution, project discovery/connection, credentials or secret access, SQL, migration creation/application, database mutation, production activity, or deployment. Any subsequent work requires a separately approved bounded scope and applicable access authorization. No production database change is authorized.
