# B-13E — Attendance Backend Foundation & Authorization Design

- **Document status:** `DESIGN — PROPOSED; IMPLEMENTATION NOT AUTHORIZED`
- **Work package:** B-13E — Attendance Backend Foundation & Authorization Design
- **Prepared:** 2026-11-17
- **Authority:** BRB-001 and owner-approved decisions recorded in [WS-0](../audit/PHASE-1B-WS-0-OWNER-DECISIONS.md), [WS-1](../audit/PHASE-1B-WS-1-OWNER-DECISION-RECORD.md), and [B-13C](B-13C-SSB-TRAINING-ATTENDANCE-RULES-AND-PERSISTENCE-ARCHITECTURE.md).
- **Related readiness:** [B-13D](B-13D-ATTENDANCE-PERSISTENCE-AND-QR-IMPLEMENTATION-READINESS.md).
- **Scope:** Readiness architecture only. No application, authentication, authorization, database, QR, or deployment implementation is authorized.

> D-13C-01 through D-13C-05 are binding owner-approved operational decisions. Technical designs in this document are **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED** and are not executable specifications or implementation approval.

## 1. Executive Summary

**APPROVED — OWNER DIRECTION:** WS-0 B-03 (2026-11-15) selects TanStack Start server functions within a modular monolith as the initial server execution boundary. WS-1 B-07 (2026-11-16) requires trusted server-side authentication/session validation and independent default-deny, least-privilege authorization. WS-1 B-09 (2026-11-16) approves shared-database logical tenant isolation, with database grants and RLS or equivalent controls complementary to independent server authorization. These are directions, not implementation evidence.

**APPROVED — ATTENDANCE BEHAVIOR:** Assigned coaches record only within verified membership and assignment scope; SSB administrators review and correct within verified scope; attendance uses Hadir/Izin/Absen with unmarked distinct; every roster entry must be marked before final submission; empty-roster submission is blocked; corrections are reasoned append-only revisions; no general reopening in the first slice; drafts are recoverable; final submission is atomic/idempotent; and success is server-confirmed. QR uses Scan → Validate → Display Player → Staff Confirmation and cannot automatically record, authorize, or prove physical presence. See [B-13C](B-13C-SSB-TRAINING-ATTENDANCE-RULES-AND-PERSISTENCE-ARCHITECTURE.md).

**VERIFIED CURRENT STATE — REPOSITORY ONLY:** The checkout has a local-state B-13B attendance demo and fixture Passport UI. It has no attendance business server function, authentication middleware, database client/schema/migration, Supabase project configuration, scanner, or verified membership/assignment source. `src/start.ts` contains error and CSRF middleware for server functions; CSRF is not authentication. External project and environment state was not accessed.

**READINESS:** Protected-data implementation is blocked on B-07/B-09 implementation and security verification, verified identity/membership/assignment data, a session/roster source of truth, and a permitted non-production environment. The architecture below keeps the approved server boundary, does not choose a database client, and explicitly leaves unresolved owner and technical decisions open.

## 2. Approved Decisions and Evidence

### Binding baseline

| Decision | Approved scope | Implementation boundary |
| --- | --- | --- |
| WS-0 B-03, 2026-11-15 | TanStack Start server functions within a modular monolith are the initial server boundary. | Direction only; not implementation or approval of slice-specific contracts. No alternate deployment topology is proposed here. |
| WS-1 B-07, 2026-11-16 | Trusted authentication and session validation; independent server-side authorization; default deny, least privilege, and controlled privileged operations. Browser-supplied roles/permissions/ownership are not authoritative. Supabase Auth is an initial provider candidate. | B-07 remains a blocker. Provider configuration, session policy, permission matrix, and implementation/verification are pending. |
| WS-1 B-09, 2026-11-16 | Shared database with logical tenant isolation; grants and RLS or equivalent controls complement independent server authorization; cross-tenant access denied by default. | B-09 remains a blocker. No tenant schema, grant matrix, RLS policy, or policy implementation is approved. |
| D-13C-01 | Verified assigned coaches may record; verified SSB administrators may review/correct. | Do not grant authority before verifying membership and assignment relationships. Frontend role selection is not authorization. |
| D-13C-02 | Hadir/Izin/Absen; unmarked distinct; all roster entries marked before final submit; empty roster blocked. | No additional status or implied late/partial rule. |
| D-13C-03 | Submitted history is append-only; corrections require a reason; general reopening excluded from first slice. | Preserve original values and correction lineage. |
| D-13C-04 | Recoverable drafts; atomic final submission; idempotent retries; success only after server confirmation. | Exact storage, key, and concurrency design remain proposed. |
| D-13C-05 | QR scan validates/identifies and displays the player, then an authorized staff member confirms. | Scan alone never records, authenticates, authorizes, or proves physical identity. |

### Evidence reviewed

- [WS-0 Owner Decisions](../audit/PHASE-1B-WS-0-OWNER-DECISIONS.md), including exact B-03 approval date/status/scope.
- [WS-1 Owner Decision Record](../audit/PHASE-1B-WS-1-OWNER-DECISION-RECORD.md), including B-07/B-09 approval boundaries and blockers.
- [B-13C Attendance Rules](B-13C-SSB-TRAINING-ATTENDANCE-RULES-AND-PERSISTENCE-ARCHITECTURE.md).
- [B-13D Attendance Readiness](B-13D-ATTENDANCE-PERSISTENCE-AND-QR-IMPLEMENTATION-READINESS.md).
- [Reconciled Supabase Architecture Decisions](SUPABASE-ARCHITECTURE-DECISIONS.md).
- [Development Workflow](DEVELOPMENT-WORKFLOW.md), [BRB-001](../product/BLUEPRINT-REQUIREMENT-BASELINE.md), and [P1-01A Security & Access-Control Architecture](../audit/PHASE-1B-P1-01A-SECURITY-ACCESS-CONTROL-ARCHITECTURE.md).
- Current attendance, Passport, role, middleware, fixture, and test files identified in the repository.

**ARCHITECTURE DOCUMENTATION NOTE:** The Supabase architecture document now records B-03 as approved initial server boundary and explicitly says this does not authenticate, authorize, isolate tenants, choose database access, or define contracts. Its older unresolved details are limited to service/API contracts and data-access choices. The documentation discrepancy is reconciled; those detailed choices remain unresolved.

## 3. Verified Repository and Infrastructure Readiness

Status meanings are repository-scoped. `EXTERNAL STATE UNVERIFIED` does not mean an external service is absent.

| Capability | Status | Evidence / limit |
| --- | --- | --- |
| TanStack Start server functions | `VERIFIED IN REPOSITORY` as a configured framework/runtime boundary; attendance actions `NOT PRESENT` | `src/start.ts` configures framework server-function CSRF/error middleware, but no attendance `createServerFn`/domain action was found. B-03 approves this initial boundary, not a particular function or its implementation. |
| Authentication/session validation | `NOT PRESENT` in inspected application; Supabase Auth `CONFIGURATION CANDIDATE ONLY` | No auth adapter or validated user session was found; `start.ts` does not attach Supabase auth middleware. WS-1 B-07 says configuration/implementation remain pending. |
| Authorization policy service | `NOT PRESENT` | Client role selection/navigation in `roles.tsx`, `role-navigation.ts`, and `roles-data.ts` is display/navigation state, not identity, membership, assignment, or permission evidence. |
| Membership/assignment source | `NOT PRESENT` | No authoritative organization membership, coach assignment, suspended/revoked membership, or player-to-SSB relationship source was found in the inspected code. Fixtures are not evidence. |
| Supabase project/configuration | `EXTERNAL STATE UNVERIFIED`; no project config found in checkout | No `supabase/` project tree, project ID, link, or environment configuration was evidenced. No external dashboard/project was accessed. |
| Database client/connectivity | `NOT PRESENT` in inspected application; external connection `UNVERIFIED` | No Supabase client, database repository, or attendance data access was found. No database was accessed. |
| Database grants/RLS/tenant enforcement | `NOT PRESENT` | WS-1 B-09 approves principles only; no tenant model, grants, policies, or negative tests are implemented. |
| Migration workflow | `VERIFIED` as repository ownership/review direction; migration artifacts `NOT PRESENT` | OD-11/AGENTS assign migration source to GitHub/repository and require reviewed migrations. No SQL/migration files were found. Supabase CLI version/workflow is unverified. |
| Request validation | `PARTIALLY IMPLEMENTED` at framework middleware only | CSRF/error middleware exists. No attendance payload validation, authenticated principal validation, membership/assignment, roster, or business-rule validation exists. |
| Attendance | `PARTIALLY IMPLEMENTED` frontend demo only | B-13B component state and fixtures, no server persistence. |
| QR | `NOT PRESENT` as a scanner/credential | Passport card has a deterministic decorative grid and toast action, not an encoded/scannable QR. No scanner dependency/API or QR lifecycle exists. |
| Environment examples/secrets | `EXTERNAL STATE UNVERIFIED` | No `.env.example` was found in the inspected path search. No `.env` or secret values were read. Secret provider/owner and environment mapping remain unresolved. |
| Test database/security tests | `NOT PRESENT` / `UNABLE TO VERIFY` | Current attendance tests are component-level. No DB integration harness or authorization/tenant security tests were found. |
| Non-production environment/operations | `EXTERNAL STATE UNVERIFIED` | No approved non-production project, connectivity, backup/restore, monitoring, or operational ownership evidence was inspected. |

No dependency presence is treated as service configuration. Supabase remains an approved provider direction/candidate, not a verified connected backend.

## 4. Proposed Backend Architecture and Trust Boundaries

The approved initial execution boundary is a TanStack Start server function inside the modular monolith. The following responsibility split is **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED**. It does not introduce another service/deployment topology or prescribe a database client.

| Layer | Responsibility; inputs/outputs | Trust boundary / failure | Dependencies and browser exclusions |
| --- | --- | --- | --- |
| Browser attendance UI | Displays sessions/roster/draft; sends requested operations; presents pending, conflict, success, and error states. | All client input and state are untrusted. Handle network ambiguity without claiming success. | Must not decide actor identity, role, organization ownership, assignment, roster eligibility, QR validity, or committed state. |
| TanStack Start server-function boundary | Accepts typed operation requests and returns validated results/errors; the sole initial application server execution boundary per B-03. | Enforce CSRF protections plus trusted session validation; fail closed if identity/context missing. CSRF is not authentication. | Uses the approved framework boundary. Exact contracts are below; function implementations are absent. |
| Authentication/session adapter | Validates the request’s authenticated session and returns a trusted principal/session context. | Reject invalid, expired, revoked, or unavailable session; never trust a client role or `sendContext` as verified identity. | Supabase Auth is a candidate/approved provider direction, but configuration/session strategy is not present and requires authorization/validation. |
| Authorization policy/service | Evaluates principal, action, resource, relationship, attributes, and organization/session scope for each protected operation. | Default deny; fail closed on missing/ambiguous relationships; re-evaluate at write/submit/correction time. | Requires owner-approved policy details and verified relationship repositories. Browser cannot supply grants. |
| Organization/membership/assignment lookup | Resolves active membership, organization scope, role within organization, coach-to-team/session assignment, and status (active/suspended/revoked). | Data must be trusted, current, and tenant-scoped. Stale/revoked/ambiguous relation means deny. | Canonical organization identity, lifecycle, assignment authority, and persistence model remain owner decisions; none is evidenced in source. |
| Attendance application service | Coordinates session/roster checks, draft transitions, manual marks, QR confirm, submit, review, and correction. | Validates full operation and approved D-13C rules; maps domain outcomes without leaking other tenants. | Depends on authenticated actor, policy service, session/roster source, and transaction-capable repository. |
| QR resolution service | Accepts opaque QR reference and session scope; resolves active player and roster eligibility; returns minimal display data and a pending confirmation handle. | Treat payload as untrusted; no side effect on scan; prevent enumeration. Revalidate at explicit confirmation. | QR format, issuance/revocation lifecycle, and security properties are not selected. No scanner or QR service exists. |
| Attendance repository/data boundary | Loads authorized session/roster/draft/revision and stores marks/submission/correction through a transaction-capable implementation. | Every read/write is tenant-scoped; enforce constraints and handle conflict/rollback. | **ARCHITECTURE DECISION REQUIRED:** database client/connection method, repository implementation, transaction API, and grant/RLS design. Do not infer direct browser access. |
| Idempotency/concurrency coordinator | Binds retry key to actor/operation/session/payload; returns prior outcome for same intent; uses version/uniqueness checks. | Conflicting payload/key reuse denied; stale writes conflict rather than last-write-wins. | Exact storage/lifetime and transaction coupling require technical validation. |
| Audit event writer | Records approved submission/correction/security events with actor, scope, timestamp, and minimized data. | Append-only/restricted; failure semantics must not yield success when required audit and attendance write are inconsistent. | WS-1 approves append-oriented audit direction, but event coverage/retention/storage details remain unresolved. Scan logging is not automatically required. |
| Error mapping | Converts internal auth/domain/validation/concurrency/storage failures into safe categorized responses. | No stack traces, raw QR values, credentials, or cross-tenant existence details to clients. | Logging/observability and operational ownership remain unverified. |

### Trust-boundary rules

- Authentication answers who made the request; authorization independently answers whether that trusted principal may perform this operation on this resource.
- The server function is a request execution boundary, not an automatic auth or authorization layer.
- The authorization service evaluates current verified membership/assignment and resource scope for every read/write. Final submit and correction repeat checks instead of relying on an earlier page-load decision.
- Database grants and RLS/equivalent provide complementary data isolation; neither replaces server authorization. Privileged credentials are never sent to the browser.
- No separate service/microservice topology is proposed. Supabase/database connection style is not selected by B-03.

## 5. Conceptual Authorization Domain Model

All entities below are **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED** conceptual requirements, not existing database entities, final schemas, or approved table designs.

| Entity | Purpose/relationships | Scope and verification | Unresolved decisions |
| --- | --- | --- | --- |
| Authenticated actor/person | Trusted identity associated with one or more app roles/relationships. | Derived from server-validated session, never frontend role selection. | Identity/account mapping, auth methods, session/revocation policy. |
| Organization/SSB | Tenant that owns teams, sessions, and organization-scoped membership. | Each protected session and record resolves to one verified organization scope. | Canonical organization identity, tenant ownership graph, organization types/parent relations. |
| Organization membership | Person-to-organization relationship and membership lifecycle. | Must be verified and active for requested operations; suspension/revocation denies access. | Who approves membership, evidence, status transitions, admin authority, effective dates. |
| Role within organization | Operation category held by a person within an organization, not a global frontend label. | Authority is derived from trusted membership/grant data. | Role assignment source, permissions, whether an SSB administrator is organization-wide or scoped. |
| Coach assignment | Relationship connecting verified coach membership to a team and/or session. | Must be current and valid for requested session; revoked/stale assignments deny. | Who creates/revokes assignments, team vs session scope, effective dates, substitute coaches. |
| Player identity | Durable person/player identity referenced by Passport and roster entries. | Resolved from trusted player data; independent of one organization. | Identity proofing/merge/correction; player-to-SSB relationship ownership. |
| Player-to-organization/team membership | Time-bounded relationship used to construct session roster. | Preserve history; do not let later transfer rewrite a prior session snapshot. | Membership approval/transfer, guest players, effective-time semantics. |
| Player Passport / QR reference | Player-facing identity presentation and an opaque reference mapped to a player. | QR identifies only; no staff authentication, permission, roster membership, or physical presence proof. | Issuance, replacement/revocation, expiry/rotation, compromised passport response. |
| Training session | Stable scheduled occurrence owned by an SSB/team and lifecycle state. | Organization scope, eligibility, cancellation/closure, and schedule must be server-authoritative. | Stable identity, session owner, cancellation/late attendance rules, time zone source. |
| Session roster snapshot/entry | Immutable participants for one session at an approved cutoff. | One player entry per session snapshot; version checked at draft and submit. | Authoritative source/cutoff, changes/removal after open, cross-organization player participation. |
| Attendance draft | Recoverable working copy of roster marks tied to session/snapshot and authorized actor(s). | Scope by org/session/version and approved actor. | Shared vs actor-specific drafts, expiry, draft ownership and recovery. |
| Submitted attendance/revision | Atomic finalized roster and append-only correction chain. | Store original session/snapshot, actor, server time, marks, revision relation. | Retention, deletion/anonymization, effective revision display. |
| Audit event | Submission/correction/approved security event history. | Append-only and restricted; data minimized. | Event coverage, scan-attempt logging, readers, retention and deletion. |

### Required distinctions

- User identity is not organization membership.
- Organization membership is not a role assignment or coach assignment.
- A role within an organization is not assignment to a specific team/session.
- Assignment is not, by itself, authority to correct or access another session.
- Permission is an operation-specific server decision over a trusted actor and scoped resource.
- A Player Passport QR reference identifies a player record only; it confers no authority.

## 6. Server Contracts (Conceptual)

These contracts are **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED** and are not endpoint/server-function implementations. TanStack Start server functions are the approved initial server boundary (WS-0 B-03), but no attendance functions exist. All actor and resource relationships must be resolved or revalidated server-side.

Common conceptual rules:

- Actor source is a server-validated session. Never accept caller-supplied actor IDs, role, tenant, assignment, ownership, roster eligibility, or QR validity as authoritative.
- Every operation has an explicit organization/session scope and default-deny authorization check.
- Return only minimally necessary player/session data. Error responses do not leak cross-tenant existence, raw tokens, or secrets.
- `idempotencyKey` and `expectedVersion` below are conceptual contract fields; exact names, persistence, and lifetimes are not selected.

| Operation | Conceptual input → output | Actor/policy checks and validation | Transaction, idempotency, errors, audit |
| --- | --- | --- | --- |
| Load authorized sessions | Approved filters/date scope → eligible session refs, minimal context, lifecycle and version. | Validate session; resolve active organization membership and assigned coach scope. | Read-only; deny by default; generic not-found/denied; log only under approved read-audit policy. |
| Load session roster | Session ref/version → roster snapshot/version and minimal player display fields. | Check org ownership and assigned coach or authorized admin read scope; snapshot only. | Read-only; stale/unavailable/denied categories; do not leak other tenant roster. |
| Create/recover draft | Session/snapshot ref and expected version → draft ref/version/statuses. | Assigned coach with verified membership/assignment; verify eligible session and exact snapshot. | Idempotent create/recover; version conflict; preserve last acknowledged draft. Whether admin may create drafts is not approved (deny by default). |
| Update a player’s draft status | Draft/session ref, roster entry ref, approved status, expected version, idempotency key → canonical draft version. | Assigned coach in scope; reject unknown participant, invalid status, stale snapshot, or inactive session. | Atomic draft update; retry same intent; conflict on concurrent version; record actor/method only per approved audit design. |
| Validate scanned QR | Untrusted QR payload, session ref/version → minimal player/session display, existing status, pending confirmation handle. | Authenticate staff; authorize selected session; resolve active QR reference server-side; verify player belongs to that session roster. | No attendance side effect. Generic invalid/revoked/not-in-roster response; rate-limit; never persist/echo raw token. Optional scan audit needs approval. |
| Confirm QR Hadir | Pending handle, session/draft/version, idempotency key → acknowledged Hadir draft mark/version. | Revalidate trusted actor, membership/assignment, org/session, QR active state, roster snapshot, current status and duplicate constraints. | Atomic/idempotent mark. Duplicate Hadir returns existing result; existing Izin/Absen is not overwritten; stale data conflicts; record confirming actor and QR method. |
| Submit full attendance | Session/draft/snapshot/version and idempotency key → canonical submitted revision, server actor/time, statuses. | Assigned coach in verified scope; non-empty roster; every entry marked; exact allowed statuses/participant set; eligible session. | One atomic transaction for full roster, final revision, actor/time, and required audit. Duplicate key returns same outcome; partial failure rolls back; server confirmation only on commit. |
| Review submitted attendance | Session/submission/revision ref → authorized current revision/history. | Verified SSB administrator in same org. Coach’s own receipt vs broader review scope is not specified; deny broader review by default. | Read-only; scope history; generic denied/not-found; audit reads only under approved policy. |
| Correct submitted record | Revision ref, replacement marks, mandatory reason, expected revision, idempotency key → new revision linked to original. | Verified SSB administrator within same org; validate reason, roster/session history, current revision, and correction authority. | Atomic append-only revision + marks + actor/time/reason/audit. Stale conflict; no overwrite, delete, or general reopen. |
| Retrieve revision/audit history | Scoped submission/revision ref and cursor → minimum authorized revisions/events. | Verified admin review/correction scope; no implicit platform/operator access. | Read-only; redact raw QR; restricted audit access; unknown scope denied. |

**PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED:** QR confirmation handle should be unguessable, short-lived, single-use, and bound server-side to the validated actor/session/player/reference/roster version. Recheck all relationships at confirmation. The handle is not authentication or permission.

## 7. Authorization Matrix

B-07/B-09 are approved principles but remain implementation/verification blockers. `Allow*` is conditional on trusted session and all listed verified resource relationships; `Deny` is default for this attendance slice; `OWNER DECISION REQUIRED` means the records do not specify that access. The matrix does not create membership/assignment policy.

| Actor | View sessions/roster | Create/recover draft | Mark Hadir / confirm QR / mark Izin or Absen | Submit complete roster | Review submitted attendance | Correct with reason | Read revision/audit history | Other organization’s records |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Unauthenticated visitor | Deny | Deny | Deny | Deny | Deny | Deny | Deny | Deny |
| Authenticated user without SSB membership | Deny | Deny | Deny | Deny | Deny | Deny | Deny | Deny |
| Active SSB administrator with verified scope | Allow* within that SSB | Deny; D-13C-01 does not grant draft recording | Deny; admin review/correct does not grant record/confirm | Deny unless a separate owner decision grants submission | Allow* same SSB | Allow* same SSB; reason required | `OWNER DECISION REQUIRED`; minimum history needed for approved review/correction only, otherwise deny | Deny |
| Assigned coach with verified membership/assignment | Allow* for assigned session/team scope | Allow* for own authorized session draft; shared-draft policy still requires validation | Allow* within assigned scope; QR requires explicit staff confirmation; same status rules for manual marks | Allow* when session is eligible and complete | Own submit receipt only; broader read `OWNER DECISION REQUIRED`, deny by default | Deny; administrator correction authority is separate | Deny by default; own audit/history scope not approved | Deny |
| Coach without assignment | Deny for unassigned session; assigned sessions only if separately verified | Deny | Deny | Deny | Deny | Deny | Deny | Deny |
| Suspended/revoked member or assignment | Deny | Deny | Deny | Deny | Deny | Deny | Deny | Deny |
| Player | Deny within attendance-management workflow; personal schedule/passport access is separate policy | Deny | Deny | Deny | Deny pending separate visibility decision | Deny | Deny | Deny |
| Parent/guardian | Deny within attendance-management workflow; guardian viewing rights are not specified here | Deny | Deny | Deny | Deny pending guardian/player visibility and consent policy | Deny | Deny | Deny |
| Member of another SSB | Deny unless a separately verified relationship authorizes the exact session | Deny unless that relationship includes assigned-coach authority | Deny unless verified assignment to this session; QR does not create access | Deny unless assigned and authorized | Deny | Deny | Deny | Deny by default |
| Platform-level privileged operator | Deny by default | Deny | Deny | Deny | Deny | Deny | Deny | Deny; exceptional access needs a separate approved, audited policy |

### Server enforcement point per operation

- Validate authentication/session before all protected operations; CSRF middleware alone is insufficient.
- Resolve active membership/assignment and target organization/session on the server for reads, draft writes, QR validation, confirmation, submission, review, and correction.
- Revalidate authority at QR confirmation, final submission, and correction, not just at initial page load or scan.
- Scope every data query/write by organization and session; validate roster snapshot membership and version independently of client payload.
- Database grants and RLS/equivalent are complementary controls, not replacements for server-side authorization. No policy or grant is approved here.
- Exceptional platform access is denied until a distinct owner-approved policy defines purpose, approval, scope, audit, and safeguards. No broad operator role is inferred.

## 8. Security and Data Integrity Requirements

All controls below are design requirements or proposals; no implementation is claimed.

| Threat/failure | Required defense and verification |
| --- | --- |
| Cross-tenant IDOR/BOLA | Server derives organization scope from trusted relationships, scopes every query, and denies cross-tenant access by default; grants/RLS add independent database enforcement. Test guessed session/player/submission references. |
| Forged org/player/actor/role | Ignore browser authority claims; resolve actor and resource relations server-side. Test modified payloads and forged role/localStorage values. |
| Stale/revoked membership or coach assignment | Revalidate relationship at operation time; fail closed when inactive, suspended, ambiguous, or revoked. Test revocation between page load and submit. |
| Stale roster/session | Compare authoritative roster/session version at draft update and submit; return conflict and preserve draft. Test player transfer/removal/cancellation between open and confirm. |
| Duplicate final submission | Database/repository uniqueness plus idempotency key; same intent returns same result; distinct duplicate is not treated as correction. |
| Concurrent manual/QR marks | Version check and uniqueness on session-roster entry; stale writer gets conflict; never last-write-wins or duplicate marks. |
| QR replay/copied screenshot | Assume static QR is copyable. Revalidate active reference, actor, session, roster, existing status and idempotency at confirmation; copied QR does not prove presence or identity of presenter. Stronger QR alternatives remain proposals. |
| Revoked/replaced QR | Invalidate old reference server-side; check active state at validation and confirmation to close race; do not silently redirect stale reference. |
| Unauthorized correction | Admin scope and correction reason checked server-side; append new revision only; test missing/forged reason and unauthorized actor. |
| Audit history alteration | Append-only revision model, restricted update/delete grants, integrity checks and review; no raw QR payload in audit. Exact DB controls require later approved design. |
| Error-based information leakage | Use safe generic not-found/denied for cross-tenant/invalid QR; no token, child, stack, or credential details. |
| Uncertain network retry | Reuse original idempotency intent or query its outcome before a new key; never show success optimistically; preserve acknowledged draft. |

Authorization is reevaluated at the point of every protected read/write, especially QR confirmation, final submission, and correction. Scan validation is not a durable grant: confirmation rechecks actor, session, roster, QR state, and current mark. Final submission rechecks the full roster and session version.

## 9. Technical Readiness Assessment

| Area | Status | Evidence / limitation |
| --- | --- | --- |
| TanStack Start server-function boundary | `VERIFIED IN REPOSITORY`; attendance function `NOT PRESENT` | WS-0 B-03 approves this as the initial boundary. `src/start.ts` configures CSRF/error middleware but has no attendance action or auth middleware. |
| Authentication/session validation | `NOT PRESENT`; provider configuration `EXTERNAL STATE UNVERIFIED` | B-07 approves candidate/principles only. No project/session config or validated principal implementation. |
| Supabase project | `EXTERNAL STATE UNVERIFIED`; configuration `NOT PRESENT IN REPOSITORY` | No project connection/config evidence in checkout; no external project was accessed. |
| Database access/connectivity | `NOT PRESENT IN INSPECTED APPLICATION`; external state `EXTERNAL STATE UNVERIFIED` | No database client/repository or attendance read/write path. No access attempted. |
| Transactions | `PROPOSED — VALIDATION REQUIRED` | B-13C requires atomic final submission, but no transaction service/client or database is implemented/configured. |
| Grants/RLS/tenant isolation | `NOT PRESENT` | B-09 approved the baseline principles only; no model, grants, policies, or tests exist. |
| Membership/assignment verification | `NOT PRESENT` | Client role catalog/context is presentation/navigation only; no authoritative membership or assignment store found. |
| Audit persistence | `NOT PRESENT` | Append-oriented audit direction exists; no persistence, event model, retention, or access implementation found. |
| Automated authorization tests | `NOT PRESENT` | B-13B tests exercise UI behavior only. No auth, negative-access, cross-tenant, or database integration suite found. |
| Migrations | `VERIFIED IN REPOSITORY` for source ownership; migration artifacts `NOT PRESENT` | Migration files are Git-owned and must be reviewed. No migration source or Supabase project config exists in inspected checkout. |
| Non-production environment/secrets | `EXTERNAL STATE UNVERIFIED` | No `.env.example` found; no secrets were read. Project topology, secret owner, access, and test environment are not evidenced. |
| QR scanner/QR lifecycle | `NOT PRESENT` | Passport grid is decorative; QR action is a toast. No generator, scanner, issuer, resolver, or revocation mechanism found. |
| Backup/restore/operations | `EXTERNAL STATE UNVERIFIED` | Direction appears in architecture docs; actual provider, configuration, owner, or recovery test is not evidenced. |

Supabase PostgreSQL/Auth are approved direction/candidates, not evidence of configuration or connectivity. The B-03 documentation contradiction is reconciled; detailed server/data-access contracts remain unresolved.

## 10. Owner Decisions Required

Do not reopen the binding B-03, B-07, B-09, or D-13C-01 through D-13C-05 decisions. The following subordinate questions remain open and affect safe implementation:

| Exact question | Why it matters | Recommended option if supported | If unresolved, can implementation proceed? |
| --- | --- | --- | --- |
| What is the canonical organization/SSB identifier and tenant ownership graph? | Every session, roster, membership and write needs stable scope. | **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED:** One authoritative organization identity resolved server-side; do not take scope from the client. | No protected data or tenant-scoped attendance. |
| Who approves, suspends, and revokes membership; what is its lifecycle/effective time? | Stale membership must not retain attendance access. | **PROPOSED — OWNER DECISION REQUIRED:** Define accountable verifier, status transitions and effective-time semantics before granting access. | No coach/admin authority. |
| Who creates/revokes coach assignments; are they team-wide or session-specific? | B-13C only permits assigned coaches within verified scope. | **PROPOSED — OWNER DECISION REQUIRED:** Store explicit scoped assignment with active lifecycle; exact authority and scope need owner decision. | No coach attendance writes or QR confirmation. |
| Is SSB administrator scope organization-wide, or restricted by team/session? | Determines review/correction boundary and cross-team exposure. | **PROPOSED — OWNER DECISION REQUIRED:** Least privilege; exact organization-wide vs narrower scope is not specified. | No administrator review/correction implementation. |
| Who owns player-to-SSB membership and roster changes; what is the session snapshot cutoff? | Determines eligible roster and historical integrity after transfer/removal. | **PROPOSED — OWNER DECISION REQUIRED:** Immutable session roster snapshot/version; owner must choose authoritative source and cutoff. | No final submission or QR eligibility decision. |
| What guardian/player visibility applies to attendance and revisions? | Youth privacy and data access are not defined by the attendance decision. | **PROPOSED — OWNER DECISION REQUIRED:** Deny attendance/history reads until role-specific visibility/consent rules are approved. | No player/guardian visibility. |
| May platform-level operators ever access attendance/player data? | Privileged access can bypass ordinary tenant boundaries. | **PROPOSED — OWNER DECISION REQUIRED:** Deny by default; any break-glass scope must specify purpose, approval, time bound, audit, and safeguards. | No exceptional operator access. |
| Which authentication/session details and revocation behavior are approved for the first protected slice? | Provider direction does not settle enrollment, session lifetime, revocation, or identity assurance. | **PROPOSED — ARCHITECTURE / OWNER VALIDATION REQUIRED:** Supabase Auth candidate may be evaluated only after project/environment and session policy are established. | No protected access or trusted principal. |
| How will database client/connection, grants, and table-specific RLS be designed? | B-09 requires independent server authorization and DB controls, but no policies/schema are approved. | **PROPOSED — ARCHITECTURE DECISION REQUIRED:** Validate an explicit server-owned access path and per-surface grant/RLS design with negative tests. | No database-backed protected data. |
| What are the draft ownership/expiry and exact idempotency-key lifetime/scope? | Draft recovery and uncertain retries must not lose work or duplicate marks. | **PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED:** Bind retries to actor/operation/session/payload; define expiry and shared-vs-actor draft behavior. | No implementation of reliable draft/retry semantics. |
| Who issues/replaces/revokes QR references; static or rotating; what rate/audit controls apply? | Copied/replayed QR can identify a player but cannot prove physical presence. | **PROPOSED — OWNER / SECURITY VALIDATION REQUIRED:** Prefer opaque server-resolved reference; revoke on replacement; do not treat QR as authentication/presence proof. | No QR issuance, scanner integration, or production confirmation. |
| What scan/audit events are retained and for how long? | Raw or excessive scan logs risk exposing youth data. | **PROPOSED — OWNER / PRIVACY VALIDATION REQUIRED:** No raw payload logging; log only minimum justified events after purpose/access/retention approval. | QR scan analytics/audit persistence remains off. |
| What is the session cancellation/closure and late/partial attendance policy? | Eligibility and exception handling affect session finalization. | **PROPOSED — OWNER DECISION REQUIRED:** Default deny writes after server marks session ineligible; define operational exceptions separately. | Standard eligible-session workflow can be designed, but exception behavior cannot be implemented. |

The B-03 boundary itself is approved. Separate B-01 package authorization is still required before implementation. Project topology, provider configuration, detailed API/data-access contract, and migration/release process require their own gates and must not be inferred from B-03.

## 11. Proposed Implementation Phases and Gates

All phases below are **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED**. This document does not authorize them.

| Phase | Prerequisites and deliverables | Required tests / exit criteria | Approval gate |
| --- | --- | --- | --- |
| 1 — Authentication and server execution foundation | Verify non-production environment; reconcile B-03 documentation; implement trusted session validation on TanStack Start server functions; agree validated principal/session contract. | Unauthenticated/expired/forged-context denials; CSRF is not counted as auth; no secrets in browser; exact server boundary and error behavior reviewed. | Separate B-01 work-package authorization; platform/security approval; no project/secret access until explicitly authorized. |
| 2 — Organization, membership, and assignment verification | Owner-defined organization/member/assignment lifecycle and authoritative server lookups. | Active/suspended/revoked membership, assigned/unassigned coach, wrong org/team/session, and forged role/ownership negative tests. | Owner approval of org/membership/assignment rules and security design; B-07 verification remains required. |
| 3 — Attendance persistence and atomic submission | Authoritative session/roster snapshot; reviewed conceptual model/schema/migration; recoverable drafts; manual statuses; atomic final submit/idempotency/revisions. | Empty roster, unmarked status, full rollback, retry, duplicate, stale roster, concurrent writes, reasoned corrections and append-only history. | Explicit implementation scope, reviewed migration, B-09 grant/RLS plan and negative tests; separate production approval. |
| 4 — Review, append-only correction, and audit history | Scoped admin review/correction; reason validation; retained original values; restricted revision/audit reads. | Admin same-tenant success; coach/other-tenant denial; missing reason; stale revision conflict; audit integrity/read authorization. | Owner confirms outstanding review/history scope and audit/retention policy; security review. |
| 5 — QR lifecycle and scan-to-confirm | Approved opaque reference format and issuance/revocation process; scanner/device support; server resolver; explicit staff confirmation. | Valid/unknown/revoked/out-of-roster QR, scan-only no-write, explicit confirm, Izin/Absen preservation, copied/replayed token, duplicate/concurrent confirm and retry. | Separate QR scope authorization; product/security/privacy approval of lifecycle, scanner and logging. |
| 6 — Security and regression hardening | Full integrated manual/QR workflow, operational runbook, monitoring/backup ownership as needed. | Cross-tenant security suite, integration/E2E failure recovery, transaction/concurrency, accessibility/device, backup/restore and quality gate evidence. | Security/platform sign-off, owner acceptance, current quality gate, and separate deployment/production authorization. |

## 12. Risks and Explicit Authorization Boundary

- B-07 and B-09 remain technical blockers until implementation and independent security verification; approving their principles does not authorize protected-data use.
- B-13C decisions are binding behavior, not evidence that identity, membership, sessions, drafts, or persistence exist.
- D-13C-01 authority cannot be implemented until coach membership/assignment and administrator scope are verified.
- A static QR can be copied or shared. QR validation is not authentication and is not proof of physical identity or presence.
- Supabase is not verified as configured, connected, or production-ready. No project/environment or secret access was performed for this document.
- No application, test, database, migration, grant/RLS, authentication, authorization, server function, QR scanner, dependency, environment, or deployment changes are authorized or performed.

**This is a design/readiness document only. It authorizes no implementation phase, project connection, credentials access, schema/migration, Supabase configuration, production activity, or protected-data access. A separately scoped and explicitly approved implementation package is required.**
