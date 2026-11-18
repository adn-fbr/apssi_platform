# Proposed Phase 1 Backlog - Blueprint MVP Foundation

## Current Reconciliation — 2026-11-15

**Phase 0 audit gate:** PASS for the requested audit deliverables. **Phase 1 implementation:** NOT AUTHORIZED by this document; owner review/approval is required. This current section supersedes the older route/runtime statements below where they differ. The backlog remains a proposal and creates no requirements beyond [BRB-001](../product/BLUEPRINT-REQUIREMENT-BASELINE.md).

### Current repository and decision baseline

- Audited commit: `171182a` on `main`, aligned with `origin/main`; 29 public routes exist.
- Current checks: `npm run test` PASS (2 files/3 tests); `npm run build` PASS; direct `tsc --noEmit` PASS; `npm run lint` FAIL (97 errors/13 warnings). No typecheck script exists.
- OD-01..11 record approved technical direction, including npm, Supabase Auth/PostgreSQL, shared multi-tenant RLS, default-deny layered authorization, guardian relationship, purpose-specific consent, audit direction, and the VS Code/GitHub/Lovable boundaries. They do not prove configured or implemented services.
- OD-11 supersedes the former Lovable-managed database instruction. Schema and migration source belongs in the repository, but no database work is authorized by this backlog. Supabase CLI remains subject to version and official-documentation verification; production changes require explicit owner approval.
- No authentication, data-access service, business server function, database client/schema, or security policy is evidenced in source. Do not use real child records during implementation/testing until the security gates pass.

### Candidate work packages (owner approval required)

| ID | Candidate work | Blueprint alignment | Dependencies / blockers | Entry evidence |
| --- | --- | --- | --- | --- |
| P1-00 | Verify the approved repository migration workflow, Supabase CLI version/documentation, project and environment configuration read-only | Technical prerequisite | Dashboard access and platform owner; no project config or connection is verified in this repository | Reviewed workflow and non-secret environment inventory; no migration execution |
| P1-01 | Establish server boundary, authenticated principal and default-deny authorization; client role selection remains display-only | BR-04, BR-11 | Supabase Auth configuration; OD-09 policy details; route/API contract decision | Server-side anonymous/wrong-role/wrong-org negative tests |
| P1-02 | Define identity/Football ID lifecycle and person/account/role relationships | BR-01, BR-02, BR-04 | Issuer, uniqueness, collision, correction and merge rules are `UNDEFINED` | Owner-approved acceptance criteria and lifecycle tests |
| P1-03 | Define guardian relationship operations and purpose-scoped consent/revocation | BR-06, BR-07 | OD-06/07 approved direction; proof, dispute, scope, age transition and revocation effects remain `UNDEFINED` | Guardian-isolation and consent grant/deny/revoke tests |
| P1-04 | Define organizations, scoped memberships and historical player relationships | BR-03, BR-05 | Organization hierarchy, membership lifecycle and transfer rules remain `UNDEFINED` | Cross-organization negative tests and preserved-history tests |
| P1-05 | Select one modular-monolith domain boundary and implement the first approved SSB/team/training use case | BR-09, BR-12 | P1-00..04; scope, attendance periods, actor grants and server contracts | Server-backed, attributed operation with validation/failure tests |
| P1-06 | Define competition/match/official/result lifecycle and implement an approved vertical slice | BR-08 | Competition formats, eligibility, roster locks, tie-breaks, correction/finalization remain `UNDEFINED` | Authorized state-transition and result-consistency tests |
| P1-07 | Define assessment rubric/version, attribution and visibility; persist an approved assessment workflow | BR-10 | P1-02..05; methodology and disclosure remain `UNDEFINED` | Validation, history, guardian visibility and authorization tests |
| P1-08 | Define payment/finance records and provider/reconciliation boundary | BR-09 | Finance rules/provider/refund/tax/reconciliation are `UNDEFINED`; no client-paid state accepted | Provider callback verification, idempotency and reconciliation evidence |
| P1-09 | Define notification persistence/delivery and user preferences | Cross-cutting | Auth/account; delivery provider and channel policy are `ARCHITECTURE DECISION REQUIRED` | Delivery, retry, opt-in and per-account read-state tests |
| P1-10 | Implement audit/security observability and approved data minimization/retention controls | BR-07 | OD-10 direction; event scope, retention and operational ownership | Attributed access/write/denial events and approved retention evidence |
| P1-11 | Reconcile lint findings and establish CI/browser verification gates | Cross-cutting quality | Owner authorization for code/config changes; browser/CI environment | Green lint/test/build/typecheck and 29-route smoke evidence |

These are sequencing candidates only. Teams may reorder or decline them after review; no microservices, new product behavior, legal rules, or detailed acceptance criteria are prescribed here. The modular-monolith direction is a recommendation, not an approved technology decision.

### Phase 1 entry conditions

1. Project owner reviews the findings and confirms implementation work follows OD-11; verify the migration workflow without bypassing production approval or Lovable UI review boundaries.
2. Owners define only the missing product rules needed for the selected vertical slice; unspecified details remain `UNDEFINED`.
3. Authorized platform review confirms service/project/environment state without exposing secret values.
4. Server authentication, authorization, guardian/consent enforcement, tenant isolation, and audit controls are implemented and negative-tested before real youth-player data is connected.
5. Lint remediation is reviewed and required quality gates pass; browser coverage includes the current 29 routes and relevant denial paths.
6. Project owner explicitly approves a selected Phase 1 work package. Do not begin automatically from this backlog.

## Historical Snapshot — 2026-11-11 (superseded for current checkout)

**Status: BLOCKED.** This proposed backlog requires product and technical owner approval. Do not start implementation until the Phase 0 readiness gates are resolved.  
**Authority:** [BRB-001, Blueprint v0.1](../product/BLUEPRINT-REQUIREMENT-BASELINE.md). This backlog is sequencing guidance, not a new requirement baseline. Undefined business rules remain `UNDEFINED`; unmade technical choices remain `ARCHITECTURE DECISION REQUIRED`.

| ID    | Theme                                         | Candidate vertical slice                                                                                              | Depends on                                                                        | Acceptance direction (not final criteria)                                                                                                                                             |
| ----- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1-01 | Delivery foundation                           | Select package manager, establish reproducible CI checks, document API/server boundary and migration ownership        | Engineering/platform decision; comply with `AGENTS.md`                            | Clean checkout can install from the selected lockfile and run agreed test/build/lint/typecheck gates. Do not add a typecheck claim until an actual command is defined and run.        |
| P1-02 | BR-04 Person and roles                        | Establish authenticated account principal, Person association and persisted role grants                               | Auth provider and account lifecycle are `ARCHITECTURE DECISION REQUIRED`          | One person can hold multiple roles; client role preference is not treated as an authorization grant. Detailed account/verification rules are `UNDEFINED`.                             |
| P1-03 | BR-02 Football ID                             | Create/retrieve player identity/profile and Football ID lifecycle                                                     | P1-02; issuer, uniqueness, duplicate and correction decisions                     | ID is persistent across organizations/activities. Issuance, collision, merge and correction acceptance rules require owner definition.                                                |
| P1-04 | BR-06 / BR-07 Guardian and consent            | Establish guardian relationship and purpose-based consent lifecycle                                                   | P1-02/P1-03; guardian proof and consent policy decisions                          | Guardian access, consent state and revocation are checked server-side and auditable. Exact verification evidence, purposes, age transition and withdrawal effects remain `UNDEFINED`. |
| P1-05 | BR-05 / BR-03 Organization and player history | Organization registry, scoped organization membership, player affiliation history                                     | P1-02/P1-03; organization hierarchy and membership lifecycle decisions            | Support baseline organization types; prior player-organization history is not overwritten. Membership states and transfer approval criteria need owner definition.                    |
| P1-06 | BR-09 SSB operations                          | Organization-scoped player registration, teams, training and attendance; finance workflow discovery                   | P1-04/P1-05; SSB role and consent policy                                          | Authorized SSB staff access only their scope; attendance/registration writes are validated and attributable. Finance acceptance is separate from selecting a payment provider.        |
| P1-07 | BR-08 Competition                             | Competition setup/registration, rosters, groups/draw, schedule/venue/referees, matches/results/standings/certificates | P1-03/P1-05/P1-06; competition format, eligibility and result lifecycle decisions | Lifecycle is server-backed and consistent; exact formats, tie-break, age cutoff, roster lock and match finalization are `UNDEFINED`.                                                  |
| P1-08 | BR-11 API-first direction                     | Define versioned/authenticated integration contracts and external-system ownership                                    | Backend/API technology and partner identity decisions                             | Document stable contracts and server-side validation; protocol, versioning and provider are `ARCHITECTURE DECISION REQUIRED`.                                                         |
| P1-09 | BR-10 Player development                      | Define and persist assessments across baseline dimensions                                                             | P1-03/P1-05; rubric/version, visibility and assessment policy                     | Assessment author, period, criteria version and access are explicit. Scoring methodology and disclosure are `UNDEFINED`.                                                              |
| P1-10 | BR-07 / BR-08 / BR-09 Audit and privacy       | Audit sensitive reads/writes; data classification, minimization, retention and privacy operations                     | P1-02 through P1-08; legal/security owner review                                  | Server records attributable events without excess child data; retention/access policy is owner-approved. No legal interpretation is inferred by this backlog.                         |
| P1-11 | Finance and payments (sequencing decision)    | Define invoice, payment, reconciliation, refund and financial records                                                 | BR-09; finance owner and payment provider decision                                | Do not mark an invoice paid from a client action; provider and reconciliation criteria must be approved before live payment integration.                                              |

## Cross-cutting quality gates

- Server-side authorization and negative tests for anonymous, wrong-role, wrong-organization, wrong-guardian and unconsented requests.
- Server-side schema validation, explicit state transitions, idempotency for retried writes/provider callbacks, and tested error/retry states.
- Synthetic-only child data in fixtures and tests; no production child details bundled in browser code.
- Audit, logging redaction, privacy, accessibility, backup/restore and operational ownership are planned before production release.
- Current UI may be reused where appropriate; success toasts/local state are not accepted as business completion evidence.

## Candidate later work

Advanced scouting search, marketplace features, AI/national intelligence, broad federation integrations and full payment-provider functionality may be sequenced after the MVP foundations. This is a proposal only; BRB-001's long-term direction is not removed or re-prioritized by this table.

## Owner decisions required before approval

1. Confirm scope and sequence against the accepted MVP focus in BR-12.
2. Resolve authentication, data store, API/server boundary, deployment and migration ownership (`AGENTS.md` reserves DB/schema changes to the Lovable-managed workflow).
3. Define Football ID, guardian verification, consent and organization/membership lifecycle rules.
4. Define competition formats, eligibility, results/corrections and payment/accounting policies.
5. Confirm quality gates, operational responsibilities and data privacy/legal review.
