# B-13C — SSB Training Attendance Operational Rules & Persistence Architecture

- **Document status:** `OWNER-APPROVED OPERATIONAL DECISIONS RECORDED; TECHNICAL DESIGN PROPOSED`
- **Work package:** B-13C — Attendance Operational Rules & Persistence Architecture
- **Type:** Decision-definition and architecture proposal only
- **Prepared:** 2026-11-16
- **Product authority:** [BRB-001](../product/BLUEPRINT-REQUIREMENT-BASELINE.md) remains the sole initial product requirement baseline.
- **Implementation status:** No production attendance persistence is authorized by this document.

> The Project Owner has approved the operational baselines D-13C-01 through D-13C-05 as stated in the decision register. QR token format, issuance and revocation lifecycle, scanner/device requirements, and implementation architecture remain **PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED**. This document authorizes no implementation or production persistence.

## 1. Executive Summary

**CONFIRMED CURRENT BEHAVIOR** — B-13B provides an interactive frontend demonstration at `/ssb/training`. The page uses fixture sessions and a fixture roster, keeps drafts in React component state, supports Hadir/Izin/Absen, distinguishes unmarked players, and offers review, reset confirmation, and local-only confirmation. It explicitly tells users that attendance is not saved to the server. It is not authoritative, durable, or connected to another role.

**VERIFIED REPOSITORY EVIDENCE** — The current checkout contains no Supabase project configuration, database client, schema, migration directory, or attendance server function. `src/start.ts` installs error and CSRF middleware for server functions; it does not install Supabase authentication middleware. A project may exist outside the checkout, but no project or connection was verified.

**APPROVED TECHNICAL DIRECTION, NOT IMPLEMENTATION** — Owner records approve Supabase PostgreSQL as the intended primary database, Supabase Auth as the initial authentication provider candidate, shared-database logical tenant isolation with RLS or equivalent database controls, and TanStack Start server functions within a modular monolith as the initial server boundary. B-07 and B-09 remain technical blockers pending implementation and verification. Browser role state is not authority.

**APPROVED — PROJECT OWNER DECISION** — Attendance may be recorded by assigned coaches within verified scope; SSB administrators may review and correct; statuses remain Hadir/Izin/Absen with unmarked distinct, complete non-empty rosters required; submitted history is preserved through append-only revisions with correction reasons and no general reopening in the first slice; drafts are recoverable, submission atomic, retries idempotent, and success server-confirmed. Staff authority cannot be implemented until membership and assignment relationships are verified.

**APPROVED — PROJECT OWNER DECISION** — QR Player Passport Attendance uses Option A: Scan → Staff Confirmation. A scan identifies and validates the player but never automatically records attendance. An authorized staff member must explicitly confirm; the server records Hadir only after its independent validation and persistence succeed.

**PROPOSED — OWNER APPROVAL REQUIRED** — The recommended first operational slice is one organization-scoped training session attendance submission with an explicit roster snapshot, atomic server-side submission, trustworthy actor attribution, idempotent retries, and append-only correction history. Recommended defaults and unresolved choices appear in the decision register below. No schema, table name, field list, policy, API contract, or migration is approved here.

## 2. Authority, Evidence, and Status Vocabulary

### Status vocabulary

- **CONFIRMED CURRENT BEHAVIOR** — Directly observed in the checked-in B-13B route or fixtures; describes the prototype only.
- **APPROVED DIRECTION** — Explicitly recorded owner-approved technical direction. It does not mean configured, implemented, tested, or production-ready.
- **APPROVED — PROJECT OWNER DECISION** — An operational decision explicitly approved by the Project Owner. It does not authorize implementation or imply that prerequisites are satisfied.
- **PROPOSED — OWNER APPROVAL REQUIRED** — Product or operational rule recommended for owner decision. It is not an approved requirement.
- **PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED** — An unapproved QR or persistence detail requiring technical validation and, where it affects policy, owner approval.
- **ARCHITECTURE DECISION REQUIRED** — A technical detail remains undecided or requires validation before implementation.
- **IMPLEMENTATION PREREQUISITE** — Evidence or work that must exist before a protected-data workflow can operate.

### Evidence reviewed

- [SSB training route](../../src/routes/ssb_.training.tsx)
- [Focused attendance tests](../../src/test/ssb-training.test.tsx)
- [Session and roster fixtures](../../src/lib/mock-data.ts)
- [Role catalog and route metadata](../../src/lib/roles-data.ts)
- [Role context](../../src/lib/roles.tsx)
- [Supabase Architecture Decisions](SUPABASE-ARCHITECTURE-DECISIONS.md)
- [Development Workflow](DEVELOPMENT-WORKFLOW.md)
- [BRB-001](../product/BLUEPRINT-REQUIREMENT-BASELINE.md)
- [Phase 1B WS-0 Owner Decisions](../audit/PHASE-1B-WS-0-OWNER-DECISIONS.md)
- [Phase 1B WS-1 Owner Decision Record](../audit/PHASE-1B-WS-1-OWNER-DECISION-RECORD.md)
- [Phase 1B Owner Decision Register](../audit/PHASE-1B-OWNER-DECISION-REGISTER.md)
- [P1-01A Security & Access-Control Architecture Definition](../audit/PHASE-1B-P1-01A-SECURITY-ACCESS-CONTROL-ARCHITECTURE.md)
- [Repository instructions](../../AGENTS.md)

Repository searches found no `supabase/` tree, SQL schema/migration files, Supabase client imports, or Supabase environment-variable references. These are repository-scoped findings only; they do not prove external project state.

### Controlling records and discrepancy

**APPROVED DIRECTION** — WS-0 (2026-11-15) records B-03 as TanStack Start server functions within a modular monolith. WS-1 (2026-11-16) approves B-07 trusted authentication/default-deny authorization principles and B-09 shared-database logical tenant isolation principles, while keeping implementation and verification pending.

**DOCUMENTATION DISCREPANCY** — `SUPABASE-ARCHITECTURE-DECISIONS.md` still labels the API/service boundary as an architecture decision required, while the newer WS-0 owner decision records the initial TanStack Start boundary as approved. This proposal treats WS-0 as the controlling decision for the initial boundary. Scope-specific service contracts, authentication integration, authorization policy, and data access remain open. The architecture record should be reconciled through its normal review process before implementation; this B-13C document does not modify or supersede it.

## 3. Current B-13B Behavior and Limitations

### Confirmed behavior

- `sessions` currently contains three fixtures for U10, U8, and U13. They have team labels, display times, locations, coach labels, and plans; they do not have stable session IDs, actual dates, or an explicit timezone field.
- The current `roster` fixture contains eight entries, all tagged U10. The route matches roster entries by exact `team` value. U8 and U13 therefore show roster unavailable; the route does not substitute U10 players.
- Statuses are `Hadir`, `Izin`, and `Absen`. Unmarked is displayed separately and is not counted as Absen.
- The route requires all displayed players to be marked before its review step is enabled. That is existing demonstration behavior, not an approved attendance policy.
- Draft state is held in component memory. It is retained while switching sessions in the same page instance and is lost on reload or navigation away.
- “Konfirmasi demo lokal” only changes page state. It does not write to a server, create an audit record, notify a guardian, or update another role’s view.
- The visible role selector/context is local prototype state. The route does not establish the authenticated identity, SSB membership, coach assignment, or permission of the person using it.

### Operational limitations

- **IMPLEMENTATION PREREQUISITE** — Fixture provenance is not confirmed. WS-0 records that unknown-provenance fixtures are not verified synthetic data. Do not connect these entries to a live workflow or treat them as real people or memberships.
- **IMPLEMENTATION PREREQUISITE** — Team label is currently the route’s matching key, not a durable session identity. Repeated sessions for the same team cannot be distinguished reliably by this key.
- **IMPLEMENTATION PREREQUISITE** — A real session roster, player identity, team membership history, organization scope, authenticated actor, and assigned-coach relationship are not evidenced by these fixtures.
- **IMPLEMENTATION PREREQUISITE** — Current success copy is explicitly local-only. Any future connected UI must wait for a server-confirmed result before showing “submitted” or equivalent success.

## 4. Owner Decision Register

The Project Owner has approved D-13C-01 through D-13C-05 as the operational baseline stated below. These approvals do not establish verified identities, memberships, assignments, scanner/token implementation, configured services, or authorization controls. They authorize no implementation. Additional implementation details remain explicitly proposed or unresolved.

### D-13C-01 — Attendance Recording Authority

**APPROVED — PROJECT OWNER DECISION:** Assigned coaches may record attendance within verified scope. SSB administrators may review and correct attendance. Coach and administrator authority must not be implemented until membership and assignment relationships have been verified.

| Evaluated alternative | Operational consequence | Decision status |
| --- | --- | --- |
| SSB administrator only | Centralizes capture; may delay timely recording. | Not selected. The approved model also allows assigned coaches to record within verified scope. |
| Assigned coach only | Supports capture at the session; lacks the approved SSB administrator review/correction role. | Not selected. |
| Assigned coach records; SSB administrator reviews/corrects | Separates session capture from oversight; requires verified membership and assignment relationships. | **APPROVED — PROJECT OWNER DECISION** |
| Other delegated staff | Would require a separately defined delegation model and scope. | Not approved by this decision. |

For this proposal, **record** means enter an attendance status in the recoverable session draft within verified scope; **submit** means atomically finalize the complete roster under D-13C-04; **review** means read without changing it; **correct** means append a reasoned revision to submitted history; **reopen** means an explicit transition allowing further editing, which is excluded from the first slice. They are separate actions and must not be inferred from selecting a role in the client.

The current role catalog is not a permission matrix. Until the required membership and assignment relationships are verified by an authorized implementation, all attendance authority remains unavailable; local role selection grants no access. No additional delegated staff authority is approved.

### D-13C-02 — Attendance Status and Completion

**APPROVED — PROJECT OWNER DECISION:** Retain Hadir, Izin, and Absen. Unmarked participants remain distinct. All roster entries must be marked before submission; empty-roster submission is blocked.

| Topic | Approved decision | Boundary / remaining detail |
| --- | --- | --- |
| Status values | Hadir, Izin, and Absen remain the available statuses. | Do not add statuses through implementation. Meaning for partial/late participation is not specified here. |
| Unmarked participant | Remains distinct from all three statuses. | A roster entry must be explicitly marked before session submission. |
| Empty roster | Cannot be submitted. | Resolve the roster before allowing submission. |
| Roster cutoff | Roster membership must be valid for the selected session. | **PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED:** Determine the authoritative snapshot/cutoff and stale-roster behavior; do not infer it from fixture labels. |
| Partial attendance / late arrival | No additional status is approved. | **PROPOSED — OWNER APPROVAL REQUIRED:** Define a mapping or defer this case before representing it operationally. |

### D-13C-03 — Corrections and Reopening

**APPROVED — PROJECT OWNER DECISION:** Preserve submitted history through append-only revisions. Corrections require a reason. General reopening is excluded from the first implementation slice.

| Evaluated alternative | Operational consequence | Decision status |
| --- | --- | --- |
| Submitted values are immutable with no in-product correction | Preserves history but does not support correcting mistakes in the workflow. | Not selected. |
| Correct values in place and keep an audit log | Risks obscuring history and depends on complete before/after enforcement. | Not selected. |
| Append a new revision and retain the prior submission | Preserves historical values and correction attribution. | **APPROVED — PROJECT OWNER DECISION** |
| Reopen a submission for editing | Allows a broad edit path that risks changing a submitted record. | Excluded from the first implementation slice by the approved decision. |

**Approved correction rules and remaining implementation boundaries**

| Sub-decision | Approved decision | Remaining implementation boundary |
| --- | --- | --- |
| Correction reason | A reason is required for every correction. | Validate the reason server-side and retain it with the correction event/revision. |
| Reopen authority | General reopening is excluded from the first implementation slice. | No reopen action may be introduced in that slice. |
| Original and corrected values | Retain submitted history through append-only revisions. | Exact conceptual storage and audit implementation remain technical design work. |
| Correction authority | SSB administrators may correct attendance. | Do not implement until verified membership/organization relationships exist. |
| Duplicate and late correction | Corrections use the approved revision path; no silent overwrite. | A correction time window and detailed duplicate resolution are not established by this decision. |

### D-13C-04 — Submission and Finalization

**APPROVED — PROJECT OWNER DECISION:** Use recoverable drafts, atomic submission, idempotent retries, and server-confirmed success.

| State | Approved behavior | Remaining boundary |
| --- | --- | --- |
| Draft | Recoverable working state. | **PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED:** Choose server-side draft persistence details; the approved principle does not approve a save mechanism. |
| Submission in progress | No success is shown while the server transaction is pending. | Prevent accidental repeated confirmation for the same in-flight intent. |
| Submitted | Marked submitted only after server validation and atomic persistence succeed. | Return/retain a canonical server result; a client scan or local state is not submission. |
| Failed submission | Draft remains recoverable and no success is claimed. | Preserve user work and permit an idempotent retry or safe outcome lookup. |
| Corrected / reopened | Corrections append a reasoned revision; general reopening excluded from first slice. | Apply only under verified administrator authority; no general reopen path. |

The approved workflow requires recoverable drafts, atomic submission, idempotent retries, and server-confirmed success. **PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED:** Exact draft persistence, request contract, token scope/retention, and retry outcome lookup remain to be designed.

**ARCHITECTURE DECISION REQUIRED:** Choose the exact draft lifecycle, request contract, idempotency storage/expiry, concurrency mechanism, and correction transaction boundary. The states above are proposals, not existing production states.

### D-13C-05 — QR Player Passport Attendance

**APPROVED — PROJECT OWNER DECISION**

QR Player Passport Attendance uses **Option A: Scan → Staff Confirmation**. A successful scan identifies and validates a player but does not automatically record attendance. An authorized staff member must explicitly confirm the attendance action.

**Approved operational workflow**

1. Authorized staff selects an existing training session.
2. Staff opens the Player Passport QR scanner.
3. The scanner reads a QR payload containing a non-sensitive player identifier or opaque reference.
4. The system validates the identifier and retrieves the corresponding player record through a trusted server boundary.
5. The server validates that the player belongs to the selected session's valid roster.
6. The UI displays the verified player's identity and relevant session context.
7. Staff explicitly confirms the attendance action.
8. The server independently validates staff authorization, session scope, roster membership, and duplicate constraints.
9. The server records Hadir only after successful validation and persistence.
10. The UI reports success only after receiving server confirmation.

QR scanning alone must never create a submitted attendance record. The scan identifies a player; it does not authenticate the staff member or prove that the player is physically present.

**PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED:** Integrate the confirmed Hadir mark into the recoverable session draft. The scan/confirmation operation must not finalize a partially marked roster. Final session submission remains the separate atomic D-13C-04 operation and is permitted only after every roster entry has Hadir, Izin, or Absen under D-13C-02. The precise draft persistence contract and transaction split require technical validation.

**PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED:** Use a privacy-minimized opaque, non-guessable or securely verifiable reference in the QR, with server-side resolution. Do not encode personal/contact data, date of birth, guardian information, or other sensitive data. The QR is an identifier only, never a credential or permission claim. Define issuance, replacement, revocation, compromise handling, and any token expiry before implementation.

**Security and misuse considerations**

- A copied QR, screenshot, replayed payload, or successful scan does not prove physical presence. No biometric or additional identity check is approved by this decision.
- Server-side lookup must reject unknown, malformed, unsupported, revoked, or replaced references and must not expose cross-organization player existence.
- Repeated scans and repeated confirmation requests must be idempotent and must not create duplicate attendance marks.
- The server must bind QR resolution and confirmation to the selected authorized session and a current valid roster; client-supplied player/session/organization/role values are not authoritative.
- **PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED:** Define non-guessability/cryptographic properties, storage representation, token lifecycle and rotation, rate limiting, audit scope, and abuse response. No QR format or physical-presence assurance is approved here.

## 5. Conceptual Domain Model

All entities and relationships below are conceptual roles, **PROPOSED — OWNER APPROVAL REQUIRED**. They are not final table names, schema, IDs, SQL, or migrations. Existing repository evidence does not establish the production organization, team, membership, player, or session data model.

| Conceptual entity | Responsibility and relationships | Integrity requirements to validate |
| --- | --- | --- |
| Organization / SSB scope | Tenant boundary that owns teams and sessions. Attendance must resolve to one organization through a trusted session relationship. | Organization identity and membership model are unresolved. Do not accept an organization ID from the browser as authority. |
| Team | Organization-scoped grouping associated with scheduled training. | Team membership and lifecycle are not modeled by the current fixture key. A team label is not a stable identifier. |
| Player identity | Persistent person/player identity referenced by attendance; the identity must not be owned by an SSB, consistent with BR-01/BR-02. | Football ID issuance, identity matching, and correction rules remain unresolved. Do not duplicate player identity per team/session. |
| Player Passport QR reference | **PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED:** Opaque or securely verifiable reference resolved server-side to a player identity; separate from identity and authority. | Do not embed sensitive attributes. Define uniqueness, revocation/replacement, compromised-reference handling, and safe lookup. Possession of the QR grants no access. |
| QR reference lifecycle metadata | **PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED:** Issuance, replacement, revocation, and validity metadata associated with a QR reference. | Define who may issue/revoke, how a replaced reference is invalidated, retention, recovery, and audit scope. Exact fields and lifecycle are not approved. |
| Training session | A specific scheduled training occurrence, owned by an organization and associated with a team. | Requires a stable identity, schedule instant, local timezone context, availability/lifecycle, and owning organization. Current fixture data is insufficient for operations. |
| Team membership | Time-bounded relationship between a player and team/organization. | Preserve historical periods per BR-03; do not overwrite old affiliation when a player changes team. Membership authority and effective dates need owner definition. |
| Session roster snapshot / entry | Captures which players are eligible for a particular session at an approved cutoff; each entry references a player and the membership/source version used. | One participant entry per player/session unless an approved rule says otherwise. Snapshot must not silently change when current membership changes. |
| Attendance submission / revision | Session-scoped lifecycle and version metadata, submitting actor, server-confirmed submission timestamp, and effective revision. | Preserve submitted history through append-only revisions. A QR scan or draft mark is not a submitted session record. |
| Attendance mark | A mark for a roster entry in a submission revision, with Hadir/Izin/Absen and an unmarked draft state. | At most one effective mark per roster entry/revision. Do not silently overwrite an existing status from a scan. Validate participant set/status server-side and at the database boundary. |
| Attendance source/method | The conceptual model accounts for manual entry versus Player Passport QR staff confirmation and the confirming staff actor. | **PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED:** Define exact representation and validation. Method is not proof of physical presence and does not change authorization or status semantics. |
| Scan event | **PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED:** Optional operational/security event for a scan attempt, distinct from an attendance record. | A scan event is not a mark or submission. Minimize retained data; event coverage, access, and retention require validation. |
| Audit / correction event | Attributable record of submission, correction, or other approved attendance action. | Correction history is append-only and corrections require a reason. Other event coverage, access, retention, and deletion remain unresolved. Do not log unnecessary child data. |

### Relationship and history requirements

- **PROPOSED — OWNER APPROVAL REQUIRED:** A player attending multiple sessions has a separate roster entry and attendance mark in each session. The uniqueness boundary is the participant within a session/revision, not the player globally.
- **PROPOSED — OWNER APPROVAL REQUIRED:** A roster snapshot is tied to the selected session and approved membership cutoff. A later team change must not rewrite a past session’s roster or attendance. Any correction to the historical participant set is a traceable revision and needs an owner-defined policy.
- **PROPOSED — OWNER APPROVAL REQUIRED:** Submission records retain references to the session and player identity without cascading deletion of attendance history. Hard deletion, anonymization, retention, and legal-hold behavior remain `UNDEFINED — OWNER DECISION REQUIRED`; referential actions must follow the approved policy.
- **ARCHITECTURE DECISION REQUIRED:** Use server-generated UTC instants for creation/submission timestamps. Preserve the session’s approved IANA timezone and scheduled local time separately so display does not depend on the viewer’s device timezone. Current fixtures do not identify a real date or timezone.
- **PROPOSED — OWNER APPROVAL REQUIRED:** Concurrent updates use version checking or an equivalent compare-and-swap mechanism. Reject stale changes with a conflict response and require review/merge; never silently apply last-write-wins to submitted attendance.

## 6. Persistence and Transaction Design

### Persistence boundary

**APPROVED DIRECTION** — TanStack Start server functions are the initial server boundary (WS-0 B-03). Supabase PostgreSQL and Supabase Auth are approved directions/candidates, not verified or configured services. No client or service integration is specified by this document.

**PROPOSED — OWNER APPROVAL REQUIRED** — The browser should submit a session identifier and proposed attendance values to a server function. The server must derive the authenticated person and organization/assignment relationships from trusted server-validated context. It must not accept client role, organization ownership, actor identity, or permission claims as authority.

### Draft and submit sequence

**PROPOSED — OWNER APPROVAL REQUIRED:** The following sequence is recommended for the operational workflow; it does not describe existing production behavior.

1. Load a specific session and authorized roster through the future trusted server boundary; do not use fixture team-name matching in operational mode.
2. Create or retrieve the actor’s session draft, if server-side draft persistence is approved. Draft writes must be scoped to the same organization/session and report success only after acknowledgement.
3. Submit the full roster mark set with a request idempotency token and expected draft/session version.
4. In one database transaction, validate actor/session access, session state, roster snapshot, allowed status set, completeness, duplicate token, and expected version.
5. Insert the immutable submitted revision, participant marks, actor and server timestamp, and required audit event as one atomic unit. Any validation or write failure rolls back the complete submission.
6. Return the canonical committed record/version. The UI shows success only after receiving this response.
7. Corrections, if approved, use a separate authorized operation that appends a revision and audit event in one transaction. Reopening is not part of the default slice.

### QR confirmation and session finalization

**APPROVED — PROJECT OWNER DECISION:** Option A requires explicit staff confirmation after scan and server validation. The scan event and pending confirmation must never create a submitted attendance record.

**PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED:** The confirmation request carries the scanned opaque reference, selected session reference, current roster/session version, and an idempotency key to the trusted server boundary. The server resolves the identifier and independently validates its active state, the authenticated staff actor and verified authority, organization/session scope, current roster membership, existing attendance status, roster version, and duplicate constraints. In one server/database operation, persist Hadir into the recoverable session draft and its approved actor/method attribution; return an acknowledgement only after the write succeeds. The UI then displays confirmation. This draft mark is not final session submission.

Final session submission remains the separate D-13C-04 atomic operation: validate and commit the complete roster with Hadir/Izin/Absen marks, preserve the submitter and server timestamp, and show submitted success only after the canonical transaction succeeds. A QR confirmation retry with the same idempotency key returns its prior outcome and cannot create another mark.

The lifecycle must distinguish:

- **Scan event:** a QR reference was read; not an attendance record.
- **Pending confirmation:** player and selected session are verified and displayed; not an attendance record.
- **Confirmed attendance mark:** staff explicitly confirmed and the server persisted Hadir in the recoverable draft; not final session submission.
- **Submitted attendance:** the full roster passed validation and the atomic D-13C-04 submission succeeded.
- **Correction event:** an authorized, reasoned append-only revision under D-13C-03; a scan cannot perform a correction.

**PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED:** Decide whether scan attempts are logged at all and, if so, the minimum data, access, retention, and privacy controls. A scan log must never be treated as attendance evidence.

**PROPOSED — OWNER APPROVAL REQUIRED** — An idempotency token should identify a single submission intent. The server should return the prior result for a retried identical intent. A conflicting new intent against an already submitted session must not create another initial submission.

**ARCHITECTURE DECISION REQUIRED** — Decide whether audit events are stored transactionally with attendance or use a separately reviewed transactional-outbox pattern. A separate asynchronous log must not create a success response when the attendance transaction failed, or vice versa.

### Uniqueness and transaction boundaries

- **PROPOSED — OWNER APPROVAL REQUIRED:** One initial submitted attendance aggregate per stable session; one participant mark per roster entry per submission revision. Corrections are revisions, not duplicate initial submissions.
- **PROPOSED — OWNER APPROVAL REQUIRED:** Enforce uniqueness and referential constraints in the data layer as well as in server validation. Exact constraints depend on the owner-approved session, membership, and correction model.
- **PROPOSED — OWNER APPROVAL REQUIRED:** The transaction includes complete submission validation, revision and marks, actor/timestamp attribution, and the approved audit event. No partial attendance writes are visible as submitted.
- **ARCHITECTURE DECISION REQUIRED:** Select transaction isolation/locking or optimistic version strategy after the authoritative session and roster source is identified. Concurrent submissions or corrections must fail safely and require a fresh read.

## 7. Security and Authorization Architecture

### Approved principles that apply

- **APPROVED DIRECTION:** Trusted server-side authentication/session validation and default-deny, least-privilege authorization are mandatory for protected operations (WS-1 B-07).
- **APPROVED DIRECTION:** Shared database with logical tenant isolation is the baseline. Database grants and RLS or equivalent controls complement independent server-side authorization. Cross-tenant access is denied by default (WS-1 B-09).
- **APPROVED DIRECTION:** The browser cannot grant authority by supplying a role, organization ID, coach assignment, player relationship, ownership flag, or permission claim. Never expose service-role or privileged credentials in browser code.
- **STATUS:** B-07 and B-09 remain technical blockers until separately authorized implementation and security verification are complete.

### Proposed enforcement flow

1. **ARCHITECTURE DECISION REQUIRED:** Validate an authenticated session at the server boundary using the approved provider candidate only after its configuration and session design are approved and available.
2. **APPROVED — PROJECT OWNER DECISION; IMPLEMENTATION PREREQUISITE:** Resolve the actor’s identity and verified organization membership/assignment from trusted server-side relationships before granting coach recording or administrator review/correction authority. Do not infer authority from `RoleContext`, `localStorage`, route, or mock fixture.
3. **PROPOSED — OWNER APPROVAL REQUIRED:** Load the requested session within the actor’s authorized organization scope. A guessed or modified session ID must not reveal whether another organization’s session exists; deny access by default.
4. **APPROVED — PROJECT OWNER DECISION; IMPLEMENTATION PREREQUISITE:** Enforce the distinct D-13C-01 operations: verified assigned coaches may record; verified SSB administrators may review and correct. Do not implement either authority until its membership/assignment relationship is verified. General reopening remains excluded from the first slice.
5. **APPROVED DIRECTION:** Scope every database operation to the authorized organization/session. Apply reviewed object grants and table-specific RLS policies (or an owner-approved equivalent) to exposed application data, with independent server checks. Do not use a uniform policy without table-by-table analysis.
6. **PROPOSED — OWNER APPROVAL REQUIRED:** Keep audit access narrower than attendance access where possible; record attributable operations while minimizing child personal data.

**QR-specific enforcement — APPROVED WORKFLOW / IMPLEMENTATION PREREQUISITES**

- Resolve the scanned reference on the server. Never trust a browser-supplied player ID, session ID, organization ID, role, or authorization claim.
- Confirm the reference is active and maps to the player record; then independently validate the player against the current roster snapshot for the selected session.
- Validate the authenticated confirming staff actor and verified assignment/membership for the same organization/session. QR possession does not grant staff authority.
- On explicit confirmation, check current status and duplicate/idempotency constraints. Persist Hadir only after all checks pass; do not overwrite Izin or Absen through a scan.
- Return only the minimum identity/context required to let staff verify the correct player and session. A successful lookup is identification, not proof of physical presence.

### Required negative authorization tests before protected data use

- Unauthenticated requests cannot read sessions/rosters or submit attendance.
- An authenticated user without an approved organization relationship is denied.
- A coach cannot access or record for a session outside a verified assignment; the relationship must be verified before authority is implemented.
- An administrator cannot operate on another organization’s session.
- A user cannot alter actor, organization, roster, or permission values by editing the request.
- A scanned QR cannot authenticate staff, prove physical presence, or access a player outside the selected session roster.
- Revoked/replaced references, repeated scans, existing marks, and concurrent confirmations cannot create duplicate marks or bypass the explicit staff confirmation.
- Correction/reopen attempts by unauthorized actors are denied and cannot change the active revision.
- Cross-tenant read/write, ownership reassignment, stale session, and default-deny cases are tested at both server and database boundaries.

These are required future controls; no test, grant, or RLS policy is implemented or approved by this document.

## 8. Failure and Recovery Behavior

QR failure responses and UI details below are **PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED**. They do not alter the approved D-13C-01 through D-13C-05 decisions. A future UI must never report success before server confirmation.

| Scenario | Expected system behavior |
| --- | --- |
| No valid roster / empty roster | Do not render another team’s roster and do not permit submission. Explain that the session roster is unavailable; preserve any existing draft for authorized recovery. |
| Session unavailable or out of scope | Deny the operation without leaking cross-organization session details. Preserve the user’s editable draft where safe. |
| Unauthorized submission | Return a denial; do not mutate attendance. Avoid exposing player/session data in the error. Record a security event only under an approved audit policy. |
| Stale roster snapshot | Reject submission with a conflict requiring a fresh roster review. Do not silently add/remove participants or remap marks. Keep the prior draft intact. |
| Duplicate request / retry | Same idempotency token returns the original committed result. A distinct submit against an already submitted session routes to the approved correction path or is rejected. |
| Network interruption | Do not display success. Keep the draft and request token available in the active page; retry idempotently or query the request outcome before creating a new intent. If server draft persistence is approved, show its last acknowledged version separately from unsaved edits. |
| Server validation failure | Return field/session-specific safe feedback; leave the last acknowledged draft unchanged and retain client edits for correction/retry. |
| Concurrent edit or submit | Reject stale version with a conflict; reload the canonical state and require the user to reconcile rather than overwrite another actor’s work. |
| Correction rejected | Leave the effective submitted revision unchanged. Preserve the proposed correction draft and explain denial without leaking protected details. |
| Partial database failure | Transaction rollback prevents a partial submission. The UI reports failure, not success; the same intent can be retried safely. |
| Player not in selected roster | Do not offer confirmation or record a mark. Explain that the player is not on this session roster without exposing other organization/session data. |
| Unknown, invalid, or unsupported QR | Reject the scan result with a generic state; create no attendance mark and preserve unrelated draft entries. |
| Revoked or replaced QR | Reject the old reference. Require use of a current valid Player Passport reference through the approved lifecycle; do not resolve old references in the browser. |
| Player already marked Hadir | Show the existing status and return an idempotent already-marked result; do not add another attendance mark. |
| Player already marked Izin or Absen | Show the existing status and do not silently overwrite it. Keep manual Izin/Absen entry available; any correction follows D-13C-03. |
| Repeated scan before confirmation | Keep or dismiss the pending result without writing attendance. A staff confirmation is still required. |
| Session unavailable or no longer eligible | Reject confirmation, preserve unrelated drafts, and require a fresh session/roster load. |
| Roster changed after session opened | Reject the stale roster version; refresh and require staff to review the player and session context again. Do not auto-map a pending scan to the changed roster. |
| Multiple staff confirm the same player concurrently | Enforce server-side session/player uniqueness and version checks. One request may persist; the other receives an already-marked/conflict response and must refresh. |
| QR confirmation network/server failure | Show no success. Preserve the draft and request identity where safe; retry idempotently or query the outcome before creating a new intent. |

### QR interaction states

**PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED:** The future scanner interaction should expose the following distinct states; none are implemented by this document.

| State | Expected interaction |
| --- | --- |
| Scanner ready | Show the selected session and allow scanning only when that session is available. |
| Scan in progress | Indicate camera/scan activity; do not create an attendance mark. |
| QR recognized | A payload was read; treat it as untrusted input and send it for server validation. |
| Player validation in progress | Resolve the identifier and check validity, session scope, and roster membership server-side. |
| Player verified; awaiting staff confirmation | Display the verified player identity and selected session context, plus an explicit confirm action and cancel/scan-again path. No mark exists yet. |
| Player not found | Show a safe not-found state; do not reveal whether the identifier belongs to another organization. |
| Player not in session roster | Explain the roster mismatch; do not permit confirmation or change another session's roster. |
| Duplicate attendance detected | Show the existing mark and do not create another. If existing status is Izin/Absen, do not replace it through scanning. |
| QR invalid, revoked, or unsupported | Explain that the QR cannot be used and direct staff to the approved reference-replacement process without exposing token details. |
| Confirmation in progress | Disable repeat confirmation for the pending request; use the same idempotency key for safe retry/outcome lookup. |
| Attendance successfully recorded | Show success only after server confirmation that Hadir was persisted to the recoverable draft; distinguish this from final session submission. |
| Confirmation failed | Show a recoverable error, claim no attendance success, and preserve unrelated/current draft work. |
| Retry available | Permit a safe retry with the same intent after resolving unknown outcome; a fresh intent must re-check current roster and existing status. |

The confirmation screen must identify the verified player and selected session before staff confirms. A failed scan or confirmation must not discard unrelated attendance drafts. Scanner success must not be presented as proof of physical presence.

**PROPOSED — OWNER APPROVAL REQUIRED:** Distinguish “edited locally,” “draft saved,” “submitting,” “submitted,” and “failed.” A client-side pending state is not persistence evidence. If server draft saving is unavailable, state clearly that changes since the last acknowledged save may be lost on reload or navigation.

## 9. Implementation Readiness and Approval Gates

No implementation phase is authorized by this design. **PROPOSED — OWNER APPROVAL REQUIRED:** Recommended sequencing is:

| Phase | Work and exit evidence | Gate |
| --- | --- | --- |
| 1. Owner-approved rules | D-13C-01 through D-13C-05 are approved as recorded above; do not reopen or weaken them. Resolve only additional product questions such as partial/late attendance where required. | Preserve the approved rule record. No implementation authority follows from this approval. |
| 2. Domain/data ownership | Confirm organization/team/session ownership, player identity reference, membership history, roster snapshot source/cutoff, QR reference ownership/lifecycle, retention/deletion, and audit scope. | Product/data owners validate the model boundaries; no fixture is treated as real data. |
| 3. Backend/environment verification | Verify a permitted non-production environment, project ownership, environment isolation, supported tooling, and secret-management process without exposing secret values. | Platform owner evidence; do not assume project connectivity from architectural approval. |
| 4. Authentication/authorization design | Validate trusted sessions; verify SSB membership and coach assignment; enforce administrator review/correction scope and QR confirmation scope. | Security/platform review; B-07 remains open until implementation and negative tests. Do not infer authority from the client role or QR. |
| 5. Schema and migration review | Convert the conceptual model into a reviewed schema/migration only after ownership and QR lifecycle are validated. Include roster snapshots, attendance source/actor, reference lifecycle, grants, table-specific RLS, integrity, compatibility, rollback/forward-fix, and data minimization. | Required owner/engineering/security review under repository migration workflow; separate production release authorization remains mandatory. |
| 6. Service implementation | Through the approved TanStack Start boundary, implement trusted session/roster loading, QR resolution, staff confirmation, recoverable draft writes, atomic final submission, idempotency, corrections, and audit controls. | Separate authorized non-production implementation scope; security tests and database controls pass before protected data use. |
| 7. Frontend integration | Keep manual Izin/Absen workflow; add scanner ready/validation/confirmation/retry states. Show success only after server-confirmed draft mark or final submission, clearly distinguished. | Product acceptance against approved rules; no scan-only or optimistic success. |
| 8. Verification and operations | Test manual and QR workflows, invalid/revoked references, roster mismatch, duplicate/concurrent scans, auth and cross-tenant denials, retry, correction, accessibility, and recovery. Establish operational ownership as applicable. | Current owner-approved quality gate and separate deployment/production approval before any production use. |

## 10. Risks, Assumptions, and Unresolved Questions

- **Fixture provenance:** WS-0 states current fixture provenance is unknown unless separately verified. B-13B's sample names must not be treated as operational player identities or used in a protected-data integration.
- **Session identity:** Current fixture team labels are not stable session identifiers. A real repeated session requires a stable, server-owned identity and authoritative schedule data.
- **Roster integrity:** Current team matching works only for the existing U10 demo roster. Operational roster membership and its cutoff are not established.
- **Role/permission gap:** Eight client-selectable roles exist, but no persisted role grant, SSB membership, coach assignment, or permission matrix is established by the attendance route.
- **Provider/environment gap:** Supabase is an approved architectural direction, not evidence that a project exists, is configured, or is connected. No credentials, project IDs, runtime logs, or external dashboards were accessed for this proposal.
- **Security blockers:** B-07 and B-09 remain open pending implementation and verification. Owner approval of principles does not authorize protected-data use.
- **Operational policy gap:** The authority, statuses/completion, correction history, submission behavior, and QR scan-then-confirm choice are approved. Late/partial attendance and authoritative roster cutoff still need clarification where they affect implementation.
- **QR lifecycle gap:** QR format/security properties, issuance authority, expiry/rotation, replacement and revocation behavior, recovery, scanner device requirements, and scan-event logging/retention remain **PROPOSED — TECHNICAL / OWNER VALIDATION REQUIRED**.
- **Presence assurance:** A QR scan identifies a reference but does not establish that the player is physically present. No physical-presence method or biometric check is approved.
- **Deletion and retention:** BRB-001 leaves retention/deletion policy undefined. Referential behavior and audit retention require qualified owner/privacy/legal review before schema approval.
- **Timezone/schedule:** Existing fixtures provide display strings only. An operational session needs an authoritative schedule timestamp and timezone source.
- **Documentation discrepancy:** B-03 is approved in WS-0, but the Supabase architecture page still identifies the API boundary as unresolved. Reconcile this record before implementation; do not reopen the approved direction without owner review.
- **External services:** No notification delivery is in scope. Any UI copy elsewhere that suggests parent notifications is not evidence or authorization for a notification service; the current B-13B route does not send notifications.

## 11. Unresolved Questions

1. What authoritative server-side source defines a session's current roster snapshot and its cutoff, including stale-roster handling?
2. How should late arrival or partial-session attendance be represented without changing the approved Hadir/Izin/Absen set?
3. What opaque/securely verifiable QR reference format, issuance authority, expiry/rotation, replacement, revocation, and compromise recovery will be approved?
4. What scanner device/browser constraints and operational recovery process are supported? A device requirement must not be inferred from the current frontend.
5. Should scan attempts be logged, and what minimum event data, retention, access, and rate-limiting controls are justified?
6. What server-side persistence design makes drafts recoverable while preserving atomic final submission and idempotent QR retries?
7. Which non-production environment, project ownership, and secret-management process are available for separately authorized implementation?
8. How will verified identity, membership/assignment, server policy, database grants, and RLS be coordinated and negatively tested?
9. What retention/deletion and referential behavior applies to QR references, attendance revisions, roster snapshots, and audit history?

These are implementation details and remaining policy questions; listing them does not approve their answers. Questions 1-6 and 9 require the relevant owner/product/privacy decision and technical validation; questions 7-8 require platform/security architecture validation and separate implementation authorization.

## 12. Authorization Boundary

This document records the Project Owner-approved operational decisions D-13C-01 through D-13C-05 and proposes unapproved technical details. Approval of those decisions does not authorize implementation, project connection, credentials access, application source/test changes, Supabase configuration, authentication/authorization implementation, server function, database client, schema, migration, grant, RLS policy, SQL, database mutation, production access, deployment, staging, commit, or push.

The B-13B route remains a frontend demonstration until verified membership/assignment relationships, QR technical validation, implementation prerequisites, security blockers, and separate implementation approvals are satisfied. **No production persistence is authorized by this document.**
