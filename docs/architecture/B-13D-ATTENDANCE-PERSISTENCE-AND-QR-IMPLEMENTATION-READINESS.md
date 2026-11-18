# B-13D — Attendance Persistence & QR Implementation Readiness

- **Document status:** `READINESS SPECIFICATION — PROPOSED; IMPLEMENTATION NOT AUTHORIZED`
- **Work package:** B-13D — Attendance Persistence & QR Implementation Readiness
- **Prepared:** 2026-11-16
- **Authority:** [BRB-001](../product/BLUEPRINT-REQUIREMENT-BASELINE.md) and the approved decisions recorded in [B-13C](B-13C-SSB-TRAINING-ATTENDANCE-RULES-AND-PERSISTENCE-ARCHITECTURE.md).
- **Scope:** Readiness analysis and technical proposals only. No application, database, QR, authentication, or deployment implementation is authorized.

> D-13C-01 through D-13C-05 are binding owner-approved operational decisions and are reproduced below. Technical designs in this document are **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED**. They are not approved implementation choices.

## 1. Executive Summary

**APPROVED — PROJECT OWNER DECISIONS:** Assigned coaches may record attendance only within verified membership and assignment scope; SSB administrators may review and correct. Keep Hadir, Izin, and Absen; unmarked remains distinct; all roster entries must be marked and an empty roster cannot be submitted. Submitted history is append-only, corrections require a reason, and general reopening is excluded from the first slice. Drafts are recoverable, final submission is atomic, retries are idempotent, and success is reported only after server confirmation. QR Player Passport attendance uses **Scan → Validate → Display Player → Staff Confirmation**; scanning does not automatically record attendance and does not prove the presenter’s physical identity.

**VERIFIED REPOSITORY EVIDENCE:** The current checkout contains an in-memory B-13B attendance demonstration, fixture-only Player Passport UI, client-side prototype role selection, and component-level attendance tests. No business server function, Supabase client, database schema, migration, scanner implementation, QR package, or environment example was found in the inspected repository paths. `src/start.ts` configures error and CSRF middleware for server functions but no authentication middleware. External project, credentials, secret store, database, and deployment state were not accessed and cannot be inferred.

**READINESS CONCLUSION:** The B-13C workflow is not ready for protected data or operational use. The primary blockers are verified identity/session handling, organization and membership ownership, verified coach assignment, authoritative session/roster source, backend/environment ownership, and B-07/B-09 security implementation and verification. A B-13D proposal can describe the target contracts and gates, but no production-ready persistence or QR workflow is established.

**PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED:** Use a trusted TanStack Start server boundary, a server-resolved opaque QR reference, an immutable session-roster snapshot, recoverable session draft, atomic complete-roster submission, and append-only correction revisions. Supabase remains a provider candidate/direction, not a verified connected environment.

## 2. Approved B-13C Decision Baseline

These decisions are binding for this readiness design and must not be changed or weakened.

| Decision | Owner-approved rule | Implementation prerequisite |
| --- | --- | --- |
| D-13C-01 — Authority | Assigned coaches may record only within verified membership and assignment scope. SSB administrators may review and correct. Frontend role selection is not authorization. | Do not grant either authority until trusted identity, organization membership, and coach assignment relationships can be verified server-side. |
| D-13C-02 — Status/completion | Keep Hadir, Izin, and Absen. Unmarked is distinct. Every roster entry must be marked before final submission. Empty-roster submission is blocked. | Validate the entire authoritative session roster and approved states on the server. Late/partial participation semantics remain undefined; do not add a status. |
| D-13C-03 — Corrections | Preserve submitted history through append-only revisions. Corrections require a reason. General reopening is excluded from the first implementation slice. | Correction permission, reason validation, revision atomicity, and audit history must be server-enforced. |
| D-13C-04 — Submission | Drafts must be recoverable. Final submission must be atomic. Retries must be idempotent. UI success is shown only after server confirmation. | Draft persistence and request/idempotency contracts require validation. A local UI state is not a committed record. |
| D-13C-05 — QR | **Option A: Scan → Validate → Display Player → Staff Confirmation.** Scanning identifies the player but does not automatically record attendance. Staff explicitly confirms. QR does not authenticate staff or prove physical identity. | Resolve and validate the QR reference and roster on the server; separately validate staff authority at confirmation. |

## 3. Verified Current Implementation and Infrastructure Inventory

Classifications below describe repository evidence only. “Not present” does not prove that an external service or environment does not exist.

| Capability | Classification | Evidence and limitation |
| --- | --- | --- |
| SSB attendance UI | **Partially implemented** | [Training route](../../src/routes/ssb_.training.tsx) supports selecting fixture sessions, exact team-to-roster matching, local Hadir/Izin/Absen marks, review, reset, and local-only confirmation. State is component memory and disappears on reload. It is not authoritative. |
| Attendance test coverage | **Partially implemented** | [Attendance tests](../../src/test/ssb-training.test.tsx) cover six frontend component scenarios, including roster isolation and local-only behavior. No database, service, authorization, concurrency, or QR integration is tested. This document does not claim a new test execution. |
| Session/roster data | **Prototype only** | [`mock-data.ts`](../../src/lib/mock-data.ts) supplies three session fixtures and eight U10 roster entries. Fixtures lack stable session identifiers, authoritative schedule instances, roster snapshots, and verified provenance. |
| Player Passport | **Partially implemented prototype** | [`player.tsx`](../../src/routes/player.tsx) displays mock identity and sample history. [`football-id-card.tsx`](../../src/components/football-id-card.tsx) renders a deterministic decorative grid derived from the demo ID; it is not a QR encoder or scannable credential. “Tampilkan QR” is a toast, not a scanner/generator workflow. |
| QR scanning | **Not present** | Repository search found no camera/barcode scanner API or QR scanner dependency. A Lucide QR icon in the payment UI is not a scanner. |
| Role and membership authority | **Prototype only** | [`roles.tsx`](../../src/lib/roles.tsx), [`role-navigation.ts`](../../src/lib/role-navigation.ts), [`roles-data.ts`](../../src/lib/roles-data.ts), and [`account.tsx`](../../src/routes/account.tsx) select/navigate roles client-side; role ID is stored in `localStorage`. They do not prove an authenticated identity, SSB membership, coach assignment, or permission. |
| TanStack Start request middleware | **Partially implemented** | [`start.ts`](../../src/start.ts) installs error and CSRF middleware. No trusted authentication middleware or attendance business action was found. CSRF protection is not authentication or authorization. |
| Attendance server function/API | **Not present** | Source search found no `createServerFn`/domain server-function implementation for attendance. Runtime server entry code is not an attendance API. |
| Supabase project/configuration | **Configuration candidate only / external state unable to verify** | Owner records approve Supabase PostgreSQL and Supabase Auth direction/candidate. No `supabase/` project tree, connection, client, schema, migration, or project identifier was found in this checkout. No external dashboard/project was accessed. |
| Database connectivity | **Not present in inspected source / external state unable to verify** | No database client or attendance data-access path was found. This is not a claim about external services. |
| Authentication | **Approved candidate only; not implemented/configured in repository** | B-07 approves Supabase Auth as an initial provider candidate, but session policy/configuration is not evidenced. No authentication middleware is installed in `start.ts`. |
| Authorization and tenant isolation | **Approved principles; not implemented** | B-07/B-09 approve trusted server-side default-deny authorization and logical tenant isolation with database grants/RLS or equivalent. No enforcement, tenant relationship, grant, or policy implementation is evidenced. |
| Environment and secrets | **Unable to verify externally; no safe example found** | No `.env.example` or equivalent example was found in the inspected path search. No `.env`/secret values were opened or emitted. A production or non-production secret store and project topology are not established. |
| Migration workflow | **Ownership approved; implementation not present** | Migration source is repository/Git-owned and changes require reviewed migrations. No SQL, migration, or Supabase configuration file was found. No CLI/database operation was run. |
| Test database/isolated integration strategy | **Not present / unable to verify** | Only frontend test setup and route-level tests are evidenced; no database harness or isolated backend test environment was found. |
| Backup/recovery/operations | **Direction/documentation only** | Architecture records call for backup/recovery ownership and separate environment controls; no configured backup, restore, monitoring, or non-production environment was verified. |

### Evidence boundary and documentation consistency

- Supabase is an approved architecture direction/candidate, **not** evidence of a connected or configured project.
- WS-0 B-03 records TanStack Start server functions within a modular monolith as the initial server boundary. The older `SUPABASE-ARCHITECTURE-DECISIONS.md` still marks that boundary as unresolved. Reconcile this documentation discrepancy before implementation; this B-13D proposal treats WS-0 as the controlling owner decision but does not select endpoint contracts or implementations.
- The repository migration ownership rule is established, but no migration conventions/files or configured environment were found. No CLI use or database access was performed.
- The QR grid in the current Player Passport is decorative, deterministic demo output; it must not be treated as a credential or evidence of identity/presence.

## 4. Conceptual Domain Model

The model below is conceptual and implementation-neutral. It is **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED** and does not define schema names, identifiers, migrations, grants, or policies. “Required for first slice” means a domain concept must be available; it does not mean the repository currently has it.

| Concept | Responsibility and relationships | Ownership, integrity, lifecycle | Slice status |
| --- | --- | --- | --- |
| Organization / SSB | Organization scope owning training operations, teams, sessions, and membership relationships. | Derive scope from trusted persisted relationships. Cross-organization access is denied by default. Organization hierarchy and membership source are not in the current code. | Required; authoritative model missing. |
| Authenticated person / verified membership | Connects a trusted authenticated principal to a person and active organization membership. | Client role selection is not authority. Membership must be verified, scoped, revocable, and attributable. Person/account linkage and membership rules require approved implementation. | Required security foundation; not present. |
| Coach assignment / administrator authority | Connects verified staff membership to permitted session/team actions. | Assigned coach may record; SSB administrator may review/correct. Validate relationships at request time or from a trusted source; never accept browser claims. | Required before staff permissions; not present. |
| Player identity | Durable person/player identity referenced by Passport and session roster. | Identity is not owned by an SSB. Relationship to guardians and identity proofing follows existing owner decisions; this document adds no identity rules. | Required; fixtures are not authoritative. |
| Player Passport | Player-facing identity/history view and the presentation surface for a QR reference. | QR reference resolution belongs to a trusted server boundary; the Passport UI is not a source of attendance authorization. | Existing UI is fixture-only; QR identity linkage is missing. |
| QR identifier/reference | Opaque reference mapped server-side to one player; separate from player identity and staff authority. | Unique among active references; lifecycle must support issuance, replacement, revocation, compromise, and invalidation. Do not put sensitive data in payload. Exact uniqueness/lifecycle policy remains a decision. | Required for QR phase; not present. |
| Training session | Stable scheduled instance owned by an organization and associated with a team. | Must have an authoritative lifecycle (eligible/cancelled/closed), time and timezone, and organization scope. Current fixtures use team labels/display strings and are insufficient. | Required; authoritative model missing. |
| Team membership | Time-bounded relationship between player and organization/team. | Preserve history when a player changes team; a later membership change must not rewrite a prior session roster. Effective-date and transfer rules remain outside this package. | Required to build roster snapshot; not present. |
| Session roster snapshot/entry | Immutable list of eligible player identities for a particular session, created from the approved roster source and cutoff. | One entry per player/session unless an owner-approved exception exists. Snapshot version is checked on draft writes/submission. Exact snapshot cutoff remains **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED**. | Required; missing. |
| Attendance draft | Recoverable session-scoped working state with draft version and one mark per roster entry. | Bound to session/org and verified actor/authorized staff scope. Must survive refresh/network interruption under the approved recoverability requirement. Concurrent writes use version checks or another reviewed strategy. | Required; no persistence implementation. |
| Attendance mark | A Hadir/Izin/Absen value for one roster entry, plus method provenance for manual vs QR confirmation if adopted. | Unmarked is not Absen. QR creates Hadir only after explicit staff confirmation and server acknowledgement. Existing Izin/Absen cannot be silently overwritten by scanning. | Required; only local B-13B state exists. |
| Attendance submission/revision | Atomic finalized complete-roster submission and append-only correction history. | Preserve original values, actor, server timestamp, session and roster snapshot references. One effective submission per session/revision model; corrections require a reason; no general reopen in first slice. | Required; not present. |
| QR scan/pending confirmation | Temporary identification/validation workflow before explicit confirmation. | Distinct from attendance mark/submission. Do not persist raw QR payloads by default; any scan audit event requires approved minimization/retention. | QR phase; not present. |
| Audit/correction event | Attributable record of final submission, correction, and access/denial events as approved. | Append-oriented and access-restricted. Event scope, storage, retention, privacy, and scan-event logging are not finalized. | Required for correction accountability; no implementation. |

### Historical and roster-integrity cases

- **Player in multiple sessions:** Create a separate roster entry and mark for each stable session. A player-level uniqueness key must not prevent attendance at different sessions.
- **Player changes teams:** Keep historical team membership and the earlier session roster snapshot. Do not reassign old attendance to the new team.
- **Roster changes after session opens:** **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED:** Pin a roster snapshot/version before edits. If the source roster changes, return a stale-version conflict and require an authorized refresh/review; never silently add/remove participants or remap marks. Owner must approve the cutoff.
- **Player from another organization:** Deny lookup/roster/attendance by default unless an explicit valid relationship places the player on the selected session’s authorized roster. Whether guest/inter-organization participation is allowed is undefined; do not infer it from a QR or fixture.
- **Session cancelled/unavailable:** **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED:** Deny new draft writes, QR confirmations, and final submission once the server reports the session ineligible. Preserve prior drafts and any already-submitted history; cancellation/correction consequences need domain policy.
- **Player removed from current roster:** Do not delete the historical snapshot entry or its submitted marks. If removal occurs before final submission, use the approved snapshot/version conflict flow; do not silently shrink the required roster.
- **Historical integrity:** Final attendance references the original session and exact snapshot/version used, retains submitting actor and server timestamp, and preserves correction lineage. Retention, deletion, anonymization, and legal-hold policy remain unresolved.

## 5. Persistence, Transactions, Idempotency, and Concurrency

All design choices in this section are **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED** unless they restate D-13C-02 through D-13C-04.

### Draft lifecycle

- Create/recover a draft scoped to an eligible session, organization, roster snapshot/version, and trusted staff actor.
- Keep per-player draft status as Hadir/Izin/Absen or unmarked. QR confirmation may set Hadir only after staff confirmation; manual workflow remains available for Izin and Absen.
- Use server acknowledgement to distinguish last persisted draft version from unsaved client edits. On refresh/network failure, reload the last acknowledged draft and preserve pending edits where feasible; never claim an unacknowledged write is saved.
- **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED:** Use a session-level draft with a monotonically increasing version and optimistic concurrency. Each update supplies the expected version; stale edits receive a conflict and reload/review path rather than last-write-wins. Decide whether one shared draft or actor-specific drafts are appropriate before implementation.
- Draft authorization follows D-13C-01: an assigned coach in verified scope records. Admin review/correction does not imply draft entry or QR confirmation authority.

### Final submission

1. Revalidate session eligibility, organization scope, authenticated actor, verified assignment, roster snapshot/version, and that the roster is non-empty.
2. Require exactly one approved status for every roster entry; unmarked is distinct and blocks final submission.
3. Reject unknown, extra, duplicate, or out-of-snapshot participant references. Do not trust client-supplied org, actor, status-method authority, or roster membership.
4. In one transaction, compare expected draft/roster version; create the immutable submitted revision and all marks; record server-derived actor and timestamp; write required audit metadata. Any failure rolls back the full submission.
5. Enforce one final submission intent per stable session according to the approved model. Only return success after the canonical committed result is available.

### Correction

- Only a verified SSB administrator may correct within their verified organization scope, as approved by D-13C-01.
- Require a non-empty reason validated by the server, append a new revision, retain original values, identify the correcting actor and server timestamp, and link to the prior revision.
- No general reopening, in-place overwrite, or deletion of prior submitted values in the first slice.
- Concurrent corrections use an expected revision/version. A stale correction fails without changing the active revision and must be re-reviewed.

### Idempotency and concurrent operations

- **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED:** Scope an idempotency key to an authenticated intent, operation, and session; bind it to a request fingerprint. A retry of the same key and payload returns the original outcome. Reuse with a different payload is rejected.
- Final submission uniqueness should prevent two distinct requests from producing duplicate session submissions. A conflict returns the canonical existing state; it is not interpreted as a correction.
- Concurrent QR confirmations for the same session/player are serialized or protected by a uniqueness constraint. One succeeds; the other returns already-marked/conflict after re-reading current status. No duplicate mark is created.
- A QR confirmation is a draft mark operation, not a final session submission. Its idempotency key and draft-version check prevent repeated taps/retries from adding duplicate marks.
- Concurrent manual and QR changes to the same player use the same draft version/status conflict rules. A scan must not overwrite Izin/Absen; status correction follows D-13C-03.
- After uncertain network outcome, query/retry the same intent before issuing a new key. The frontend shows no success until server acknowledgement.

## 6. QR Passport Identifier and Scan-to-Confirm Architecture

This section’s implementation design is **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED**. D-13C-05’s scan-then-confirm behavior is approved and binding.

### QR identifier design

- **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED:** Encode only an opaque, non-sensitive, high-entropy reference (or a securely verifiable equivalent) that resolves server-side to a player identity. Do not encode name, date of birth, contact/guardian data, organization permissions, role, roster status, attendance, or secrets.
- Generate references using a cryptographically secure source and enforce uniqueness among active references. Prefer storing a verifier/digest rather than reusable plaintext if the selected token design permits; select exact cryptographic construction only after security review.
- QR reference issuance is a separate authorized operation linked to a verified player identity. The QR does not authenticate its presenter, authorize staff, or prove physical presence.
- **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED:** Reissue by creating a new active reference and revoking the old reference atomically. A revoked/replaced reference is not silently redirected to the new one. Recovery and notification of replacement require an approved policy.
- Validate token shape, active state, association, and organization/session roster on the server. Return generic invalid/unavailable responses to prevent enumeration; rate-limit lookup/confirmation and never log raw QR payloads.
- A static QR is copyable and can be screenshotted, shared, replayed, or presented by another person. Server-side duplicate rules prevent duplicate marks but do not prevent someone else presenting a copied QR before the player. A successful scan is not physical-presence evidence.
- **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED:** A rotating, short-lived, session-bound QR can reduce replay windows but introduces issuance, clock, device, connectivity, and recovery dependencies; it still cannot prove who physically presents it. Any stronger mechanism requires separate approval. No biometric/facial recognition requirement is proposed or approved.

### Logical scan-to-confirm contract

1. Staff selects an eligible session; server provides current session and roster version.
2. Client scanner reads the QR payload and treats it as untrusted input.
3. Client sends the payload and selected session reference to the trusted server boundary over the authenticated session.
4. Server validates the QR reference, resolves the player, and checks session eligibility and roster membership.
5. Server checks the current draft/status and returns only minimal display data plus an expiring, single-use confirmation handle bound server-side to actor, session, player, QR reference, and roster/draft version.
6. UI displays verified player and selected session; no attendance mark exists yet. Staff can cancel or scan again.
7. On explicit confirmation, server revalidates the authenticated staff actor, verified membership/assignment, organization/session scope, QR reference still active, roster membership/version, current attendance status, and duplicate/idempotency constraints.
8. If valid and unmarked, server records Hadir in the recoverable draft with QR source and confirming staff actor. It then returns an acknowledged result.
9. Final roster submission remains the separate D-13C-02/D-13C-04 action and only succeeds atomically when every entry is marked.
10. If the QR was revoked/replaced or the roster/session changed between validation and confirmation, reject confirmation and require a fresh scan/session/roster review. Do not use stale display data.

The confirmation handle is only a proposed anti-tampering/expiry mechanism; it is not staff authentication. The server must derive actor identity from its validated session and must not trust a client-supplied handle as permission.

### Existing attendance status outcomes

| Player/session state | QR confirmation outcome |
| --- | --- |
| Player is in selected roster and unmarked | Display player/session and await explicit staff confirmation; after server confirmation, persist Hadir to draft. |
| Already Hadir | Return already-marked/idempotent outcome; do not create a duplicate. |
| Already Izin | Show existing status; do not overwrite. Any change requires an authorized reasoned correction under D-13C-03. |
| Already Absen | Show existing status; do not overwrite. Any change requires an authorized reasoned correction under D-13C-03. |
| Unknown/invalid identifier | Reject generically; no player data or mark is returned/created. |
| Revoked/replaced identifier | Reject old reference; require current valid Passport reference through the approved lifecycle. |
| Not in selected roster | Deny confirmation without revealing other organization rosters. |
| Player belongs to another organization | Deny by default unless an explicit, verified relationship authorizes inclusion in this session’s roster; no guest rule is assumed. |
| Session cancelled/unavailable | Deny validation/confirmation; preserve unrelated draft work. |
| Stale roster or concurrent confirmation | Reject with safe conflict/already-marked response; refresh current context; never auto-overwrite. |

Manual entry remains available for Izin and Absen. A QR scan never automatically creates attendance or changes an existing status.

### Scan events versus attendance data

- **Scan attempt:** the scanner read a token; not an attendance record.
- **Validation result:** server says whether a reference is valid for this session; not an attendance record.
- **Pending confirmation:** a minimal player/session display is awaiting an explicit staff action; not an attendance record.
- **Confirmed draft mark:** server persisted a Hadir draft mark after staff confirmation; not a finalized session submission.
- **Final submission:** atomic complete-roster transaction under D-13C-02/D-13C-04.
- **Correction event:** append-only reasoned revision under D-13C-03.

**PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED:** Do not persist every raw scan by default. If abuse/security needs justify scan audit, store only minimal result category, session scope, actor (when authenticated), and timestamp; never store raw QR payload or unnecessary child data. Approve access, retention, and audit purpose before enabling such logging.

## 7. API / Server-Action Contracts (Conceptual)

These are logical contracts only, **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED**. They do not name final endpoints, server functions, schemas, or packages. The server derives actor identity and organization scope from a trusted validated session; client input never grants authority.

Conceptual shared values:

```ts
type AttendanceStatus = "Hadir" | "Izin" | "Absen";
type OpaqueSessionRef = string;
type OpaquePlayerRef = string;
type OpaqueDraftRef = string;
type Version = number;
```

The strings above are notation for a contract discussion, not approved field names or identifiers.

| Operation | Input / output (conceptual) | Authorization and validation | Errors, retry, and audit |
| --- | --- | --- | --- |
| Load eligible sessions | Input: filters/date range as approved. Output: minimal session reference, organization/team context, time/timezone, lifecycle, roster version. | Authenticated actor; filter by verified organization membership and assigned coach scope. | Deny by default; avoid cross-tenant existence leaks. Read audit policy unresolved. |
| Load session roster | Input: opaque session reference and expected version. Output: roster snapshot/version and minimum player display data. | Verified org/session scope; exact session-to-roster relation; no browser role claim. | Not found/unavailable/denied; stale version returns refresh requirement. Minimize player data. |
| Create/recover draft | Input: session reference and roster version. Output: draft reference/version and persisted marks. | Assigned coach within verified scope. Admin draft-entry authority is not approved by D-13C-01. | Idempotent create/recover; stale roster/session rejected. Audit scope to approve. |
| Update manual draft mark | Input: session/draft references, roster entry reference, Hadir/Izin/Absen, expected version, idempotency key. Output: canonical draft version/status. | Assigned coach only in verified scope; server checks participant belongs to snapshot and status is allowed. | Invalid mark, not rostered, stale version, duplicate intent; retain draft and provide retry/conflict handling. |
| Validate Passport QR | Input: raw QR payload and selected session reference/version. Output: minimal verified player/session display, existing status, and short-lived confirmation handle. | Authenticated session plus verified scope before returning player data; active QR and session roster validated server-side. | Generic invalid/revoked/not-rostered response; rate limiting; never log/echo raw token. No attendance mutation. |
| Confirm QR attendance | Input: confirmation handle, session/draft reference, expected version, idempotency key. Output: acknowledged Hadir draft mark and new draft version. | Revalidate actor, membership/assignment, organization/session, QR active state, roster membership/version, and existing status. | Existing Izin/Absen not overwritten; Hadir duplicate returns current result; concurrent requests conflict/idempotent; audit actor/method according to approved policy. |
| Submit complete attendance | Input: session/draft reference, roster version, draft version, idempotency key. Output: canonical submission revision, server actor/time, statuses. | Assigned coach verified; non-empty snapshot; every participant marked; exact participant set/status; session eligible. | Atomic transaction; duplicate key returns original result; stale roster/version conflict; no success until committed. |
| Review submitted attendance | Input: session/submission reference. Output: authorized current revision and required history. | Verified SSB administrator within organization; coach visibility beyond own submit receipt requires explicit permission. | Deny by default outside scope; restrict audit/history fields. |
| Correct attendance | Input: submission/revision reference, affected roster marks, required reason, expected revision, idempotency key. Output: appended revision with prior revision linkage. | Verified SSB administrator; organization/session and record scope revalidated. | Reason required; stale revision conflict; append-only transaction; preserve original values; no general reopen. |
| Retrieve revision/audit history | Input: scoped session/submission reference and pagination. Output: minimum authorized revisions/events. | Access policy beyond administrator review/correction is not specified; deny by default until the audit read scope is approved. | Redact unnecessary child/token data; record access only under approved audit policy. |

**PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED:** The pending confirmation handle should be unguessable, short-lived, single-use, and bound server-side to one actor/session/player/QR/roster version. Revalidate all underlying relationships at confirmation. It is not authentication and must not be accepted as a substitute for a valid staff session.

## 8. Authorization Matrix and Tenant Isolation

Approved B-07/B-09 principles apply: trusted server-side authentication/session validation, default deny, least privilege, verified relationship checks, shared-database logical tenant isolation, and database grants/RLS or equivalent complementary to independent server authorization. B-07 and B-09 remain blockers until implementation and negative tests pass.

Legend: **Allow*** means only after trusted identity plus verified scope/relationship; **Deny** means default-deny under this attendance slice; **Receipt only** means the actor may receive the server result for their own confirmed submit but has no general review grant; `N/A` is not a permitted attendance operation.

| Action | SSB administrator | Assigned coach | Unassigned coach | Unauthenticated | Player / guardian | User belonging to another organization |
| --- | --- | --- | --- | --- | --- | --- |
| View eligible session | Allow* within verified SSB scope | Allow* for verified assignments | Deny | Deny | Deny for attendance workflow; personal schedule policy is separate | Deny unless independently verified as a member/assignee for this session’s organization |
| View session roster | Allow* within verified SSB scope | Allow* for assigned session only | Deny | Deny | Deny; no guardian/player roster visibility is established here | Deny by default; never reveal another tenant’s roster |
| Record draft attendance | Deny by default; admin record authority not approved | Allow* within verified coach assignment | Deny | Deny | Deny | Deny unless verified membership/assignment grants the same scoped role |
| Confirm QR attendance | Deny by default; only if also independently authorized as assigned coach under verified relationships | Allow* only for assigned session after explicit confirmation | Deny | Deny | Deny | Deny unless verified assignment in the selected session’s organization |
| Submit complete attendance | Deny by default; correction/review does not imply submit authority | Allow* for verified assigned session and complete roster | Deny | Deny | Deny | Deny unless verified scoped assignment exists |
| Review submitted attendance | Allow* within SSB organization | Deny general review; may receive own submission receipt only | Deny | Deny | Deny pending separate visibility/guardian policy | Deny by default |
| Correct attendance | Allow* within verified organization; reason required | Deny unless separately granted administrator authority; no such grant is approved here | Deny | Deny | Deny | Deny by default |
| Read audit/revision history | Deny pending explicit audit-history read scope; allow only minimum history necessary for an authorized review/correction after scope validation | Deny by default | Deny | Deny | Deny | Deny |

The matrix does not create membership or permission rules beyond D-13C-01. A “user belonging to another organization” is denied unless an independently verified relationship qualifies that user for this session; a QR reference does not create that relationship. A user with multiple roles must satisfy the specific trusted permission for the operation; UI role switching is irrelevant.

### Enforcement requirements

- Resolve authenticated principal and session state on the server; reject missing/invalid/expired session by default.
- Load organization/session/player relations from trusted persisted data, not caller-provided IDs or role values alone.
- Check current membership and coach assignment before the request’s read/write. Assignment changes or revocation must affect subsequent requests according to approved session policy.
- Scope every query and mutation by the authorized organization/session. Validate player membership in the exact session roster snapshot.
- Apply reviewed object grants and table-specific RLS or equivalent database controls as a second boundary; RLS does not replace server policy or constrain privileged credentials that bypass it.
- For a guessed cross-tenant session/player/QR reference, return a safe denial without confirming the other organization’s data exists.
- Audit/correction history has separately restricted scope; raw QR references are never placed in audit logs.

No authentication, grant, RLS policy, tenant model, permission implementation, or database endpoint is authorized or present as a result of this document.

## 9. Backend and Environment Readiness

| Area | Classification | Readiness evidence / limitation |
| --- | --- | --- |
| Supabase project | **Unable to verify externally; not present in inspected repository** | No `supabase/` configuration/project tree, project ID, link, client, or connection evidence. Do not infer existence or connectivity. |
| Provider direction | **Configuration candidate only** | Supabase PostgreSQL/Auth are approved direction/candidate in owner documents; approval is not configuration. |
| Authentication/session | **Not present in application** | No auth client/middleware or validated user session was found. `start.ts` has error/CSRF middleware; it does not authenticate. |
| Database connectivity | **Not present in inspected source; external state unable to verify** | No database client or attendance data-access function found. No database was accessed. |
| Server-side secrets | **Unable to verify environment; no example configuration found** | No `.env.example` was found. No `.env`, secret values, tokens, or credentials were read or exposed. Secret owner/provider and environment mapping remain unresolved. |
| Migration source ownership | **Approved governance; no migration implementation present** | Migrations are repository/Git-owned and require review. No SQL/TOML/migration file or Supabase migration tree was found. No CLI command or SQL was run. |
| Non-production environment | **Unable to verify** | No non-production project/environment identifiers or connectivity evidence. Platform ownership/topology and secret process require evidence. |
| Request validation | **Partially implemented at framework middleware only** | CSRF/error middleware exists. No attendance schema validation, authenticated principal validation, organization/roster checks, or business server action exists. |
| Authorization enforcement | **Approved principles; not implemented** | No server-side membership/assignment enforcement or database grant/RLS implementation was found. |
| Test database / isolation | **Not present or unable to verify** | Six route/component tests cover the B-13B frontend behavior; no integration database harness or isolated backend environment was found. Do not call these persistence/security tests. |
| Passport QR | **Decorative demo only; scanner not present** | Football ID card renders a deterministic faux grid. The “show QR” action is a toast. No QR generator, camera scanner, or QR resolution service was found. |
| Backup/recovery/monitoring | **Direction only; configuration unable to verify** | Architecture records call for controlled environment and backup/recovery ownership, but no service configuration or operational evidence was inspected/verified. |

**Readiness decision:** Repository-only planning can proceed. Protected-data development cannot proceed until project/environment availability is evidenced, B-07 authentication/session and B-09 tenant/database controls are implemented and tested under separately authorized scope, and membership/assignment and roster sources are authoritative. Do not connect real youth-player data based on the current fixtures.

## 10. Security and Test Readiness Matrix

All test cases below are **required future evidence**, not tests implemented or passed in B-13D. Test implementation and any database/environment setup require a separate authorized package. Use synthetic data only after fixture provenance is verified.

### Attendance and persistence

| Case | Test class | Expected assertion |
| --- | --- | --- |
| Correct session/roster matching; U8/U13 do not reuse U10 | Unit + integration | Only the selected session snapshot is returned and marked. |
| Empty roster submission | Unit + integration | Server rejects; no submission or success response. |
| Unmarked participant at final submission | Unit + integration | Final submit rejected; unmarked is not converted to Absen. |
| Status validation | Unit + integration | Only Hadir/Izin/Absen accepted; no new status appears through client payload. |
| Draft recovery after refresh/network interruption | Integration + E2E | Last acknowledged draft restored; unsaved UI state is not represented as saved. |
| Atomic submission failure | Integration | Any write/audit failure leaves no partial finalized roster and no success response. |
| Duplicate final submit / retry after uncertain response | Integration | Same key returns same outcome; second submission is not duplicated. |
| Concurrent final submissions | Integration + security | One valid commit or deterministic conflict; no duplicate aggregate/marks. |
| Correction reason and append-only history | Unit + integration | Missing reason rejected; prior values/revision retained; new revision attributed. |
| General reopen excluded | Unit + security | No reopen operation is available to first-slice roles. |
| Concurrent correction/stale revision | Integration + security | Stale correction fails without overwriting active revision. |

### QR workflow

| Case | Test class | Expected assertion |
| --- | --- | --- |
| Valid QR, roster match, explicit confirmation | Integration + E2E | Scan only displays pending confirmation; Hadir draft mark appears only after server-confirmed staff action. |
| Invalid/unknown identifier | Unit + integration + security | Generic rejection; no player disclosure or attendance mark. |
| Revoked/replaced identifier | Integration + security | Old reference rejected, including when revoked after scan but before confirmation. |
| Player not in selected roster | Integration + security | Confirmation denied; no cross-tenant/session disclosure or mark. |
| Player belongs to another organization | Security + integration | Deny by default unless a separately verified relationship authorizes roster inclusion. |
| Repeated scan / repeated confirmation | Unit + integration | Scan is non-mutating; retries are idempotent; no duplicate mark. |
| Already Hadir | Integration | Existing status returned; no duplicate attendance. |
| Already Izin / Absen | Integration + security | Scan does not overwrite; correction rules required for changes. |
| Confirmation cancelled | E2E | No mark is written; unrelated draft entries remain. |
| Unauthorized confirmation | Security + integration | Unassigned coach/admin without recording grant, unauthenticated actor, player, guardian, or other tenant is denied. |
| Concurrent confirmation by two staff | Integration + security | One mark at most; loser receives a conflict/already-marked response. |
| Session/roster changed after scan | Integration + E2E | Stale confirmation rejected; user must refresh and review again. |
| Scanner/device failure and network interruption | E2E | No success is shown; draft remains recoverable and retry uses the original intent safely. |
| QR copied/screenshot/replay limitations | Security review + E2E | Duplicate/replay controls are exercised; tests do not claim physical identity/presence proof. |

### Authorization and tenant isolation

| Case | Test class | Expected assertion |
| --- | --- | --- |
| Unauthenticated access | Security + integration | Protected session/roster/draft/submission denied. |
| Assigned coach in verified scope | Security + integration | May record/confirm/submit only assigned session. |
| Unassigned coach | Security + integration | No roster or write access for unassigned session. |
| Verified SSB administrator | Security + integration | Can review/correct only same-organization records; cannot record/confirm/submit unless separately approved. |
| Invalid/revoked membership or assignment | Security + integration | Denied, default-closed. |
| Forged browser role/organization/player/session values | Security + integration | Server uses trusted context and persisted relationships; forged claims have no effect. |
| Cross-tenant reads/writes | Security + integration | Denied at server and database boundary; no existence leakage. |
| Unauthorized correction / missing reason | Security + integration | Denied; no new revision. |
| Audit history access | Security + integration | Only approved scope can read; no raw QR payload or excess child data. |

### Test classification and current coverage

- **Unit:** state transitions, roster matching, status/completeness validation, idempotency mapping, and safe QR lifecycle logic.
- **Integration:** real server boundary, isolated test database, transaction rollback, uniqueness, version conflicts, draft recovery, and QR resolution.
- **Security:** default-deny, forged-client-context, membership/assignment, cross-tenant, correction, and QR abuse cases.
- **End-to-end:** browser scanner permissions/device failure, explicit confirmation, cancellation, stale roster refresh, success/error feedback, and accessible keyboard/screen-reader behavior.
- **Current evidence:** The B-13B frontend tests do not cover the above server, database, QR, or security behaviors. No B-13D tests were implemented or executed.

## 11. Proposed Implementation Phases and Approval Gates

Every phase is **PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED**. No phase begins under this readiness document.

| Phase | Prerequisites and deliverables | Acceptance / approval gate | Risks |
| --- | --- | --- | --- |
| 1 — Backend foundation | Verify a permitted non-production environment and accountable owner; resolve server-boundary documentation discrepancy; implement trusted authentication/session validation, verified organization membership/coach assignment, default-deny authorization, tenant scope, and test harness. | Explicit implementation authorization; platform/security approval; negative auth and cross-tenant tests pass before protected data use. | Supabase project, secret owner, environments, and B-07/B-09 controls are not verified/implemented. |
| 2 — Attendance persistence | Confirm authoritative session/roster source and cutoff; design snapshot, draft, status, submission, correction/audit model; review migration; implement recoverable drafts, manual Izin/Absen, atomic submit, idempotency, revision history. | Product/owner confirms rules; reviewed migration and service contract; transaction, duplicate, conflict, recovery and correction tests pass. Separate production approval remains required. | Roster/session ownership, cutoff, retention, draft sharing and operational services remain unresolved. |
| 3 — QR Passport | Approve opaque reference lifecycle, issuance/revocation ownership, scanner/device support and privacy; implement secure QR issue/resolve, server validation, minimal player display, explicit staff confirmation and idempotent Hadir draft mark. | QR threat review and explicit scope authorization; invalid/revoked/out-of-roster, replay/duplicate, concurrency, confirmation and privacy tests pass. | Static QR is copyable and cannot prove presence; provider/crypto/device approach is unselected. |
| 4 — Hardening and operations | Add full authorization/security tests, concurrency and failure drills, audit review, monitoring, backup/restore and support/incident process. | Owner-approved operational acceptance, current quality gates, security sign-off, non-production verification, and separate deployment/production authorization. | Operational owners, retention, recovery objectives, environment topology and release gates are incomplete. |

### Required approvals before implementation

1. Project Owner separately authorizes a bounded implementation work package, files, environments, acceptance criteria, and exclusions.
2. Platform owner verifies the non-production project/environment, ownership, access, and secret-management process without exposing secret values.
3. Security/platform owners approve session validation, membership/assignment source, authorization implementation plan, tenant isolation, grants/RLS strategy, and negative tests.
4. Product/data owners validate session/roster source, roster cutoff, session cancellation behavior, cross-organization membership cases, and retention/deletion rules.
5. QR issuance/replacement/revocation, static-vs-dynamic reference design, rate limits, audit scope, and scanner device/browser constraints are reviewed and approved before QR implementation.
6. Migration work follows the repository-owned reviewed migration process. Production schema changes and deployment need separate explicit authorization.

## 12. Risks and Unresolved Decisions

- **B-07/B-09 blockers:** Trusted authentication, authorization, tenant isolation, database grants/RLS or equivalent, and negative security verification are approved principles but not implemented.
- **Membership/assignment:** Verified actor, organization membership, and coach assignment sources are absent; no attendance authority can be safely granted before their verification.
- **Roster/session source:** Current fixture uses team strings, lacks stable session instances and roster history, and cannot support authoritative eligibility or stale-roster logic.
- **Draft semantics:** “Recoverable” is approved, but shared versus actor-specific draft, save acknowledgement, expiry, conflict resolution, and offline behavior require technical/product validation.
- **QR reference lifecycle:** Payload format, identifier entropy/protection, issuance/replacement/revocation, compromised passport recovery, rotation, and enumeration/rate-limit design remain open.
- **Physical presence:** QR scanning cannot prove who is holding the passport. No physical-presence assurance is approved; do not imply otherwise or add biometric controls.
- **Session lifecycle:** Cancellation, closure, late roster changes, removal of players, and correction consequences require domain rules.
- **Audit/privacy:** Keep raw QR payloads out of logs; scan event logging, actor attribution, retention, access, and deletion require review.
- **Infrastructure:** Supabase/provider direction is not configured evidence. Non-production project, secret ownership, migration CLI/version, test database, backup/recovery, and deployment operations remain to be verified.
- **Documentation discrepancy:** B-03 in WS-0 approves TanStack Start server functions as the initial boundary, while the older Supabase architecture page still marks this boundary unresolved. Reconcile records before service implementation.
- **Fixture provenance:** Current player/session examples are not verified production or synthetic identities. Do not connect them to protected data.

## 13. Authorization Boundary

This document is a technical readiness proposal only. D-13C-01 through D-13C-05 remain the approved operational baseline, but their approval does not authorize implementation. Technical proposals here are not owner-approved schema/API/cryptography decisions.

This document authorizes no application code or test changes, Player Passport/QR UI, scanner/generator, server function/API, authentication or authorization implementation, Supabase configuration or project connection, database client, schema, migration, grant, RLS policy, SQL, database mutation, secret access, production access, deployment, staging, commit, or push. No production persistence or QR attendance implementation is authorized.
