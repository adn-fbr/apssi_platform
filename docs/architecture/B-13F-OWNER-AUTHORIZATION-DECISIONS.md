# B-13F — Owner Authorization Decisions

- **Document status:** `ALL SIX RECOMMENDATIONS APPROVED`
- **Work package:** B-13F — Attendance Backend Foundation & Authorization Design
- **Prepared:** 2026-11-17
- **Authority:** [BRB-001](../product/BLUEPRINT-REQUIREMENT-BASELINE.md), [WS-0](../audit/PHASE-1B-WS-0-OWNER-DECISIONS.md), [WS-1](../audit/PHASE-1B-WS-1-OWNER-DECISION-RECORD.md), and the approved attendance rules in [B-13C](B-13C-SSB-TRAINING-ATTENDANCE-RULES-AND-PERSISTENCE-ARCHITECTURE.md).
- **Scope:** Formal proposals for owner decisions needed before attendance authorization can be implemented.

> The Project Owner approved all six recommendations below on 2026-11-17, as formulated in this document. Approval does not authorize implementation, project connection, database access, migrations, or production activity.

## 1. Executive Summary

WS-0 B-03 approves TanStack Start server functions within a modular monolith as the initial server boundary. WS-1 approves B-07 trusted authentication/default-deny authorization principles and B-09 shared-database logical tenant isolation principles. These decisions do not define the organization, membership, coach assignment, administrator scope, player/guardian relationships, permission matrix, or database policy implementation.

B-13C already approves the attendance rules that this register must preserve: assigned coaches record only within verified membership and assignment scope; SSB administrators review and correct within verified scope; statuses are Hadir/Izin/Absen; unmarked is distinct; all roster entries must be marked; empty-roster submission is blocked; corrections are reasoned append-only revisions; no general reopening in the first slice; drafts recover, final submission is atomic/idempotent, and success is server-confirmed; QR requires explicit staff confirmation.

This document asks the Project Owner to decide the six subordinate policy areas below. Until each relevant decision is recorded and the required relationships are verified, the corresponding attendance operation remains denied or blocked. Frontend role selection, localStorage, route ownership, mock IDs, fixture organization names, and QR possession are not proof of identity, membership, assignment, or permission.

## 2. Verified Evidence and Boundaries

### Owner decision evidence

- **WS-0 B-03:** Decision date 2026-11-15; status `WS-0: OWNER DECISIONS APPROVED WITH DEFERRED DETAILS`. The B-03 owner-approved wording is: “Use TanStack Start server functions within a modular monolith as the initial server boundary.” It approves direction, not implementation or slice-specific contracts.
- **WS-1 B-07:** Owner approval dated 2026-11-16. Trusted authentication/session validation and independent server-side authorization are mandatory; default deny and least privilege apply; browser-supplied role/permission/ownership values are not authoritative. Supabase Auth is an initial provider candidate, not verified configured. B-07 remains a blocker pending implementation and verification.
- **WS-1 B-09:** Owner approval dated 2026-11-16. Shared-database logical tenant isolation is the baseline; grants and RLS or equivalent controls complement independent server authorization; cross-tenant access is denied by default. No tenant schema, grant matrix, or RLS policy is approved. B-09 remains a blocker pending implementation and verification.
- **B-13C D-13C-01 through D-13C-05:** Project Owner-approved attendance authority, statuses/completion, corrections, submission behavior, and QR Scan → Staff Confirmation. These are binding and are not reopened by this register.
- **B-13D/B-13E:** Readiness documents describe proposals and implementation prerequisites; they do not approve additional organization, membership, assignment, guardian, or platform-operator policies.

### Relevant repository evidence

| Evidence | Verified fact | What it does not establish |
| --- | --- | --- |
| [`roles-data.ts`](../../src/lib/roles-data.ts) | Defines eight client role labels, navigation tabs, and `owns` route lists. | Authenticated identities, organization membership, team/session assignment, or permission grants. |
| [`roles.tsx`](../../src/lib/roles.tsx), [`role-navigation.ts`](../../src/lib/role-navigation.ts), [`account.tsx`](../../src/routes/account.tsx) | Select and resolve a display role; the role is stored in browser `localStorage`. | Authentication, membership verification, authorization, or tenant scope. |
| [`mock-data.ts`](../../src/lib/mock-data.ts) | Contains sample player, guardian-like, SSB, team, roster, and session values. | Real or verified player identities, SSBs, memberships, assignments, relationship proofs, or data provenance. |
| [`ssb_.training.tsx`](../../src/routes/ssb_.training.tsx) and [`ssb-training.test.tsx`](../../src/test/ssb-training.test.tsx) | B-13B attendance marks are component-local demo state; roster matching uses fixture team labels; tests are frontend component tests. | Server writes, authorization, durable membership, tenant boundaries, or persistence/security test evidence. |
| [`start.ts`](../../src/start.ts) | Error and CSRF middleware are configured for server functions. | Authentication or authorization middleware, business validation, or database access. |
| [Supabase Architecture Decisions](SUPABASE-ARCHITECTURE-DECISIONS.md) | Supabase PostgreSQL/Auth and shared RLS are approved directions; the initial server boundary is reconciled to WS-0 B-03. | A configured/connected project, schema, client, policy, environment, or deployment. |

B-13C and B-13D explicitly state that no connected Supabase project, schema, migrations, or attendance service is evidenced in this checkout. No external project was accessed for this register.

## 3. Decision Principles

- The recommendations below must not override B-07, B-09, or D-13C-01 through D-13C-05.
- Each access decision is operation-specific and resource-scoped. A global role label never grants attendance authority.
- Membership and assignment must be independently verified from a trusted source before allowing the associated operation.
- Deny by default when actor, relationship, organization, session, roster version, or permission cannot be established.
- Approval of a policy does not itself implement or verify it. Each protected operation also requires separately authorized server/database implementation and negative security tests.
- Approval evidence and scope are recorded for each decision in the approval register. Approval of a recommendation does not itself implement or verify it.

## 4. Owner Decision Register

### D-13F-01 — Organization Identity and Tenant Ownership

- **Status:** `APPROVED`
- **Decision question:** What is the authoritative SSB/organization identity, who may create and verify it, what is its lifecycle, and how are its locations, teams, sessions, players, memberships, rosters, attendance, and operational records owned and isolated?
- **Why it matters:** Every protected read/write needs a stable server-resolved tenant scope. A client-supplied organization ID, fixture `orgId`, team label, or route cannot prove ownership. Incorrect ownership risks cross-organization disclosure or mutation.
- **Current verified evidence:** Role and mock data include an SSB label and sample organization ID; there is no verified organization registry, tenant model, membership source, or database schema in the inspected repository. WS-1 B-09 approves shared-database logical tenant isolation but explicitly does not approve a tenant schema/model.
- **Alternatives:**
  - **A.** An organization identity is issued/verified through an owner-designated registry; one organization can own multiple locations, teams, sessions, and scoped records.
  - **B.** External federation/association identifiers are canonical, with a verified mapping to internal organization records.
  - **C.** Client-submitted organization IDs or display names define scope. This is inconsistent with B-07/B-09 and is not recommended.
- **Recommendation — PROPOSED — OWNER APPROVAL REQUIRED:** Use a stable server-issued internal organization reference; store any external identifier as a separately verified mapping. Model one SSB organization as capable of owning multiple locations, teams, sessions, rosters, attendance, and SSB operational records; keep persistent player identity separate from SSB ownership. Require each protected operational record to resolve to its organization through trusted server-side relationships. Do not accept client-supplied identifiers as authority.
- **Lifecycle proposal — PROPOSED — OWNER APPROVAL REQUIRED:** Consider `pending verification → active → suspended / closed`, with explicit transitions, transition authority, and reactivation rules. These states are a proposed vocabulary, not approved policy. Define who may create/verify an organization before enabling access.
- **Cross-organization/player consequence:** Player-to-SSB relationships should be separately represented and historically preserved; the organization identifier must not become the player’s global identity. Whether simultaneous memberships or cross-organization transfers require approval is part of D-13F-05 and remains unresolved until decided.
- **Operational consequences:** Verified organization scope is a prerequisite for session listing, roster reads, draft creation, submission, review, correction, and organization administration. Cross-organization access stays denied by default.
- **Alternatives’ risks:** A single-org-per-person/account assumption conflicts with BR-04’s multiple roles and creates awkward transfers; display names are mutable/non-unique; client IDs enable IDOR/BOLA. External IDs can be missing or ambiguous and require a verified mapping process.
- **Exact proposed approval statement:** “I approve a stable, server-resolved organization identity and organization-owned operational scope, with no authority derived from client-supplied organization values. Organization creation/verification authority and lifecycle transitions are: [owner-defined rules]. Player-to-organization membership and transfer behavior are decided under D-13F-05.”
- **Dependencies:** D-13F-02, D-13F-03, D-13F-04, D-13F-05, B-09.
- **Implementation gate:** No tenant-scoped protected data access until the identity source, organization lifecycle, membership relationship, and database isolation design are approved, implemented, and negatively tested.

### D-13F-02 — Membership Approval and Lifecycle

- **Status:** `APPROVED`
- **Decision question:** Who may request, verify, approve, reject, suspend, revoke, and reactivate a person’s membership in an SSB; what states/transitions are authoritative; and how are changes applied to existing records?
- **Why it matters:** D-13C-01 conditions coach/admin authority on verified membership. Without lifecycle and approval authority, a former, suspended, or unverified member might retain access.
- **Current verified evidence:** Client role switching is local UI state. No persisted person/org membership or lifecycle is implemented. BR-06/BR-07 and WS-1 state that guardian and membership models/details remain undefined.
- **Alternatives:**
  - **A.** Membership is requested and approved by a separately verified organization authority; status transitions are recorded and revalidated for sensitive operations.
  - **B.** Membership is assigned only by a central platform/association authority; this may centralize trust but requires a defined authority and operational capacity.
  - **C.** Self-selection, invitation acceptance, or a frontend role switch immediately grants membership. This is not sufficient verification and is not recommended.
- **Recommendation — PROPOSED — OWNER APPROVAL REQUIRED:** Define a server-verified, organization-specific membership relationship with explicit lifecycle states such as pending, active, suspended, revoked/ended, and rejected. Treat this state vocabulary as a proposal, not approved policy. Require approval by an owner-designated authority whose own scope is independently verified. Re-activation should require a defined authorization event rather than silently restoring old access. Recheck active status during every protected operation.
- **Existing attendance consequence:** A membership change must not delete or rewrite historical attendance. Whether loss of membership affects access to historical records is a separate access/retention question; deny history access unless an approved role/scope permits it.
- **Alternatives’ risks:** Self-asserted membership defeats tenant boundaries; central-only approval can bottleneck local operations; undefined suspension/reactivation permits stale access. Invitation acceptance alone does not prove authority or relationship.
- **Exact proposed approval statement:** “I approve the following SSB membership request, verification, approval, status-transition, suspension/revocation, and reactivation rules: [owner-defined rules]. Active membership is verified server-side and client role selection or invitation acceptance alone does not grant attendance authority.”
- **Dependencies:** D-13F-01, D-13F-03, D-13F-04, D-13F-05, B-07, B-09.
- **Implementation gate:** No coach/admin permission or protected session/roster data until membership proof/source, approver authority, transitions, revocation effect, and tests are approved.

### D-13F-03 — Coach Assignment Authority and Lifecycle

- **Status:** `APPROVED`
- **Decision question:** Who assigns coaches, what resource is assigned (organization, team, or session), what is assignment validity, who may inspect assignment history, and how do expiry/revocation affect drafts, QR confirmation, and final submission?
- **Why it matters:** D-13C-01 permits a coach to record only after verified membership and assignment. A global “Pelatih” role is not a session/team assignment.
- **Current verified evidence:** `roles-data.ts` lists a coach role and sample teams; fixtures label sessions with coach names. No persisted assignment relationship or lifecycle is present.
- **Alternatives:**
  - **A.** Organization-level coach assignment grants access to all sessions/teams in that organization.
  - **B.** Team-level assignment grants access to sessions belonging to an explicitly assigned team.
  - **C.** Session-level assignment grants access only to named session occurrences.
  - **D.** Delegated or temporary substitute assignment; requires an explicit delegator, scope, and expiry.
  - **Assignment-history readers:** Coach self-view, same-organization administrator, or a separately scoped audit reader; current source does not establish any of these grants.
- **Recommendation — PROPOSED — OWNER APPROVAL REQUIRED:** Require active verified SSB membership plus an explicit assignment tied to a team or session. Choose assignment granularity and the assigning authority only after D-13F-04 establishes a verified administrator/organization authority. Store effective start/end and revocation history. Revalidate assignment at draft create/recovery, every mark, QR confirmation, and final submission. Revocation blocks future writes; it does not rewrite already submitted history. Restrict assignment-history reads to the coach’s own assignment and a verified same-scope administrator unless the owner approves another audit role.
- **Alternatives’ risks:** Organization-wide grants are broad; session-only assignments may be operationally burdensome; self-assignment is self-authorizing; undefined substitute handling can expose rosters beyond intended scope.
- **Exact proposed approval statement:** “I approve coach assignments as [team/session] scoped, created/revoked by [verified authority], effective [lifecycle], with expired or revoked assignments denied at draft update, QR confirmation, and final submission. Assignment history may be inspected by [approved actors/scope].”
- **Dependencies:** D-13F-01, D-13F-02, D-13F-04, D-13C-01, B-07, B-09.
- **Implementation gate:** No coach attendance reads/writes before verified active membership and assignment source, lifecycle, scope, and revocation checks are implemented and negative-tested.

### D-13F-04 — SSB Administrator Authorization Scope

- **Status:** `APPROVED`
- **Decision question:** Is SSB administrator authority organization-wide, team-scoped, session-scoped, or explicitly delegated; which attendance, membership, and assignment-management actions are allowed at each scope; and who may inspect the resulting history?
- **Why it matters:** D-13C-01 permits administrators to review and correct within verified scope but does not define whether that scope is the whole SSB or a subset. Assuming organization-wide access could expose unrelated teams/player attendance.
- **Current verified evidence:** The `ssb` role has routes and a demo SSB label but no persisted administrator grant or scope. The role definition is not authorization.
- **Alternatives:**
  - **A. Organization-wide administrator:** Review/correct all records in one verified organization; may manage membership/assignment only if separately approved.
  - **B. Team-scoped administrator:** Review/correct assigned teams; narrows exposure but needs team-scope lifecycle.
  - **C. Session-scoped administrator:** Access only explicitly assigned sessions; least exposure but increases assignment operations.
  - **D. Delegated administration:** Specific actions and time-bounded resources are delegated; requires audit and revocation.
- **Recommendation — PROPOSED — OWNER APPROVAL REQUIRED:** Start with least privilege: an administrator has only the explicitly approved scope and actions. Until the owner selects scope, do not implement admin attendance access. D-13C-01 permits review/correction but does not grant recording, QR confirmation, or final submission. Membership approval, coach assignment, and assignment-history access are separate grants and must not be inferred from “SSB administrator.”
- **Correction review options:** Permit one verified administrator to correct with mandatory reason and append-only revision (existing D-13C rule), or require a second reviewer for defined sensitive corrections. The second-review rule is not approved; only add it if the owner identifies a concrete risk and approves the process.
- **Alternatives’ risks:** Organization-wide administration increases data exposure; team/session scope requires reliable assignments; broad delegated permissions are hard to audit if scope/expiry is unclear.
- **Exact proposed approval statement:** “I approve SSB administrator scope as [organization/team/session/delegated], with permission to review and correct attendance only within that verified scope. Membership approval, coach assignment, assignment-history access, recording, QR confirmation, and submission are [separately approved or denied] as follows: [scope].”
- **Dependencies:** D-13F-01, D-13F-02, D-13F-03, D-13F-06, D-13C-01, D-13C-03.
- **Implementation gate:** Admin read/correction actions stay denied until the exact scope, verified grant source, correction audit, and any second-review requirement are approved.

### D-13F-05 — Player and Parent/Guardian Relationships

- **Status:** `APPROVED`
- **Decision question:** How is a durable player identity related to one or more SSBs over time, how are guardian relationships verified, and what attendance/passport information may a verified guardian view or act on?
- **Why it matters:** BR-01/BR-02 preserve player-owned identity across organizations; BR-03 requires historical relationships; BR-06/BR-07 make guardian relationship, privacy, consent, and access foundational. These principles do not define proof, concurrent membership, or attendance visibility.
- **Current verified evidence:** Player and parent UI use mock objects and names. `children` and `player.guardian` fixtures do not prove a real identity, guardian link, membership, consent, or access grant. The Passport QR-like grid is decorative.
- **Alternatives:**
  - **A.** One current SSB membership per player; transfer ends the former relationship but preserves history.
  - **B.** Time-bounded many-to-many player/SSB relationships; concurrent memberships may be allowed only if explicitly decided.
  - **C.** SSB owns a separate player identity/profile; conflicts with the approved persistent player-owned journey direction and is not recommended.
  - For guardians: separately verify a relationship and then apply explicit purpose/record visibility; do not equate role label with relationship.
- **Recommendation — PROPOSED — OWNER APPROVAL REQUIRED:** Maintain a durable player identity separate from SSB membership; represent organization affiliations as time-bounded relationships and preserve historical attendance when a player transfers. Whether multiple current SSB memberships are permitted remains an owner choice. Require an independently verified guardian-player relationship before any guardian access. Do not authorize guardians to initiate, approve, record, confirm QR, submit, or correct attendance in this package. Guardian read access to attendance, consent scope, multiple guardians, disputes, and concurrent SSB memberships remain owner decisions. Do not introduce biometric identity verification or facial recognition through this decision.
- **Alternatives’ risks:** Single-current-membership can erase legitimate concurrent relationships; unverified guardian links expose youth data; SSB-owned player identity undermines BR-01/BR-02; broad guardian read access can exceed purpose/consent.
- **Exact proposed approval statement:** “I approve a player-owned persistent identity with [owner-defined] time-bounded SSB membership/transfer behavior, and require verified guardian-player relationships plus [owner-defined] attendance visibility and consent rules. Guardians may initiate or approve only these operational actions: [none or owner-specified actions]. Guardian role labels alone grant no access and do not permit attendance changes.”
- **Dependencies:** D-13F-01, D-13F-02, D-13F-03, D-13F-06, BR-01 through BR-07.
- **Implementation gate:** No real player/guardian data or attendance visibility until identity, membership/transfer, guardian verification, consent/visibility, retention, and negative-access rules are approved and implemented.

### D-13F-06 — Platform-Level Privileged Operators

- **Status:** `APPROVED`
- **Decision question:** Is exceptional platform support/incident access to SSB attendance/player data permitted, for which purposes, under whose approval, for how long, and with what audit/review?
- **Why it matters:** A platform/database operator may technically bypass ordinary application roles or database row controls. B-07 requires privileged operations to be separately controlled; B-09 requires cross-tenant denial by default.
- **Current verified evidence:** No platform operator role, break-glass workflow, privileged database credential boundary, or operational access log is evidenced in the attendance implementation. No production service was accessed.
- **Alternatives:**
  - **A. No platform-level access to identifiable attendance/player data:** support is limited to minimized diagnostics and customer-admin initiated actions.
  - **B. Exceptional break-glass access:** case-specific purpose, independent approval, least data/scope, time limit, strong attribution, append-only audit, notification/review, and post-incident review.
  - **C. Standing broad operator access:** not recommended; conflicts with least privilege and creates high-impact insider/credential risk.
- **Recommendation — PROPOSED — OWNER APPROVAL REQUIRED:** Deny implicit platform-operator access. Prefer no access to identifiable child/attendance records. If a necessary exceptional path is approved, require a separately defined break-glass policy with named accountable roles, case/purpose, independent approval, time-bounded scope, minimum necessary access, comprehensive audit, and after-action review. No such mechanism is approved or implemented here.
- **Alternatives’ risks:** No-access can constrain incident support; break-glass adds insider and credential risk that requires strong controls; standing access creates broad cross-tenant exposure.
- **Exact proposed approval statement:** “I approve [no platform operator access / the following narrowly scoped break-glass policy: purpose, approver, scope, duration, audit and review]. No platform-level role receives implicit attendance or player-data access.”
- **Dependencies:** D-13F-01, D-13F-04, B-07, B-09, audit/operations ownership.
- **Implementation gate:** Any exceptional access stays disabled until the owner-approved policy and independent technical controls/tests exist.

## 5. Cross-Decision Consistency

| Dependency | Required order / unresolved consequence |
| --- | --- |
| D-13F-01 organization identity → D-13F-02 membership | Membership cannot be verified without a canonical organization scope. No tenant-scoped session/roster access until both are established. |
| D-13F-02 membership → D-13F-03 coach assignment | Assignment is valid only for a currently verified member; role labels or invitation acceptance alone are insufficient. |
| D-13F-02 + D-13F-03 → D-13C-01 coach recording | The approved recording permission remains unusable until both active membership and current assignment are verified at each write. |
| D-13F-01 + D-13F-04 → D-13C-01 administrator review/correction | “Within verified scope” is not assumed to be organization-wide. Review/correction remain blocked until admin scope is selected and verified. |
| D-13F-05 player/org relationship → session roster | QR/player validation must resolve the selected session’s roster snapshot; a player’s other SSB membership cannot establish eligibility. |
| D-13F-05 guardian relationship/consent → guardian attendance visibility | Parent/guardian role does not grant attendance or history access; visibility stays denied until relationship, purpose, and consent policy are approved. |
| D-13F-06 privileged access → B-09 | Platform operations do not bypass tenant isolation by default. Exceptional access requires separate approval and controls. |
| B-07 + B-09 → all protected operations | Server session validation, default-deny policy, tenant-scoped data access, complementary grants/RLS, and negative tests are prerequisites; neither B-03 server functions nor Supabase provider direction supplies these automatically. |

### Attendance operation consequences

The status below is a proposed authorization effect consistent with the approved B-13C authority boundary. Any `OWNER DECISION REQUIRED` item remains denied until explicitly decided; no matrix entry grants access based on a client role label.

| Actor | View org sessions | View session roster | Create/recover draft | Mark Hadir manually | Confirm QR Hadir | Mark Izin/Absen manually | Submit complete roster |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Unauthenticated visitor | Deny | Deny | Deny | Deny | Deny | Deny | Deny |
| Authenticated user without SSB membership | Deny | Deny | Deny | Deny | Deny | Deny | Deny |
| Active SSB administrator with verified scope | Allow only in verified scope | Allow only in verified scope | Deny; draft recording authority not granted | Deny; recording authority not granted | Deny; recording authority not granted | Deny; recording authority not granted | Deny; submit authority not granted |
| Assigned coach with verified membership/assignment | Allow for assigned scope | Allow for assigned scope | Allow for own authorized session draft; shared draft policy is `OWNER DECISION REQUIRED` | Allow within assigned scope | Allow after explicit confirmation and server revalidation | Allow within assigned scope | Allow for eligible assigned session only when roster is complete |
| Coach without assignment | Deny for unassigned session | Deny | Deny | Deny | Deny | Deny | Deny |
| Suspended/revoked member or assignment | Deny | Deny | Deny | Deny | Deny | Deny | Deny |
| Player | Deny in attendance workflow; personal-session visibility is separate policy | Deny | Deny | Deny | Deny | Deny | Deny |
| Parent/guardian | Deny in attendance workflow; viewing policy is separate | Deny pending verified relationship and policy | Deny | Deny | Deny | Deny | Deny |
| Member of another SSB | Deny unless independently verified in this scope | Deny unless independently verified in this scope | Deny unless assignment is verified for this session | Deny unless assignment is verified for this session | Deny unless assignment is verified for this session | Deny unless assignment is verified for this session | Deny unless assignment is verified for this session |
| Platform-level privileged operator | Deny by default | Deny by default | Deny | Deny | Deny | Deny | Deny |

| Actor | Review submitted attendance | Correct with reason | Read revision history | Access another organization |
| --- | --- | --- | --- | --- |
| Unauthenticated visitor | Deny | Deny | Deny | Deny |
| Authenticated user without SSB membership | Deny | Deny | Deny | Deny |
| Active SSB administrator with verified scope | Allow* within owner-approved scope | Allow* within owner-approved scope | `OWNER DECISION REQUIRED` beyond minimum history needed for review/correction | Deny |
| Assigned coach with verified membership/assignment | Own submission receipt only; broader review is `OWNER DECISION REQUIRED` | Deny; correction authority is not granted | Deny by default; own-history scope is `OWNER DECISION REQUIRED` | Deny |
| Coach without assignment | Deny | Deny | Deny | Deny |
| Suspended/revoked member or assignment | Deny | Deny | Deny | Deny |
| Player | Deny pending separate visibility policy | Deny | Deny pending separate visibility policy | Deny |
| Parent/guardian | Deny pending verified relationship, consent and visibility policy | Deny | Deny pending verified relationship and policy | Deny |
| Member of another SSB | Deny unless independently verified in this scope | Deny | Deny | Deny by default |
| Platform-level privileged operator | Deny absent separate approved break-glass scope | Deny absent separate approved break-glass scope | Deny absent separate approved break-glass scope | Deny by default |

`Allow*` means the actor and exact organization/team/session resource are independently verified on the server. Review/correction scope is approved only as “within verified scope”; whether that is organization-wide, team-scoped, or session-scoped remains `OWNER DECISION REQUIRED` under D-13F-04. Administrator membership/assignment management is a separate permission and is not included in attendance review/correction authority.

**Dependencies by operation:** Session listing and roster visibility depend on D-13F-01/D-13F-02 and applicable coach assignment (D-13F-03) or administrator scope (D-13F-04). Drafts, all manual marks, QR confirmation, and final submission depend on D-13F-01 through D-13F-03 and the B-13C completeness/status rules. QR additionally depends on D-13F-05 and a verified player/session roster relationship. Review/correction depend on D-13F-01/D-13F-02/D-13F-04; correction also depends on D-13C-03. Revision history and guardian visibility require D-13F-05/D-13F-06 as applicable and an approved audit-read scope. Cross-organization access remains denied by default under B-09.

These consequences do not resolve one decision using another unresolved decision. Every operation must independently enforce its prerequisites.

### Per-operation enforcement and audit requirements

All enforcement points below are design requirements, not implemented controls. Audit events must be minimized and must not include raw QR payloads; exact audit coverage/retention remains unresolved unless stated by D-13C-03.

| Operation | Required verified relationship and resource scope | Server enforcement point | Audit requirement/status |
| --- | --- | --- | --- |
| View organization sessions | Authenticated active organization member; coach additionally needs current assignment; admin scope follows D-13F-04. Scope query to one verified organization. | Server session validation and policy check before scoped session query; no client organization filter is authoritative. | Read logging/retention `OWNER DECISION REQUIRED`; no excess player data in logs. |
| View session roster | Verified membership and applicable assignment/admin scope; session belongs to same organization; roster snapshot is authoritative for the session. | Authorize session first, then load only that session’s snapshot through tenant-scoped data access. | Roster read audit scope/retention unresolved; log only if approved. |
| Create/recover draft | Assigned active coach for the selected session; draft bound to organization/session/snapshot and authorized actor(s). | Revalidate session/assignment and draft ownership before repository create/recovery. | Draft actor/time attribution required by the proposed model; event coverage is `PROPOSED — VALIDATION / OWNER APPROVAL REQUIRED`. |
| Mark Hadir manually | Assigned active coach; player is an entry in the selected session snapshot. | Attendance application service checks status, membership, assignment, session, roster version, and draft version before write. | Preserve actor and method in draft/submission provenance; exact per-mark event logging is `OWNER DECISION REQUIRED`. |
| Confirm QR Hadir | Assigned active coach; QR resolves to an active player reference in the selected session snapshot. | Resolve QR and authorize at scan validation, then revalidate actor/reference/session/roster/current status at explicit confirmation. | Confirming actor and QR method are part of the conceptual attendance provenance; scan-attempt logging/retention is `OWNER DECISION REQUIRED`. |
| Mark Izin/Absen manually | Assigned active coach; player is in the selected snapshot; only D-13C statuses accepted. | Same server policy and version checks as Hadir; reject unmarked-to-Absen inference or unsupported statuses. | Actor/method attribution at draft/submission; detailed audit event policy unresolved. |
| Submit complete roster | Assigned active coach; active membership/assignment; eligible session and exact current non-empty roster snapshot. | Reauthorize immediately before atomic transaction; verify every roster entry/status, expected version, uniqueness and idempotency. | Server-derived submitter and timestamp; atomic submission event/revision. |
| Review submitted attendance | Active SSB administrator within owner-approved organization/team/session scope. | Authorize before loading submission/revisions; limit data to approved scope. Coach general review remains `OWNER DECISION REQUIRED`. | Audit read event only if approved policy defines it; restrict history fields. |
| Correct attendance with reason | Active SSB administrator within verified scope; submitted revision/session and target player are linked; mandatory reason. | Reauthorize at correction; transaction appends a new revision and preserves original values; no reopening. | Append-only correction event with actor, server time, reason, prior revision link and changed values, per D-13C-03. |
| Read revision history | Verified same-scope administrator; any coach/player/guardian access requires separate approval. | Reauthorize scoped history query; default deny unknown role/scope. | History-read audit coverage is `OWNER DECISION REQUIRED`; never expose raw QR or unnecessary child data. |
| Access another organization | No relationship is assumed from known identifiers, QR, roles, or client claims. | Deny at server policy and database grant/RLS or equivalent; avoid confirming resource existence. | Denial/security logging follows approved minimum-data audit policy; retention remains unresolved. |

## 6. Approval Register

The Project Owner approved all six recommendations on 2026-11-17. For each entry, approval applies to the recommendation as formulated in this B-13F document.

| Decision ID | Recommendation for owner review | Owner approval status | Approver | Approval date | Approval evidence/reference | Approval scope | Dependencies | Implementation gate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D-13F-01 | Stable server-resolved organization identity; explicit creation/verification authority and lifecycle; organization-owned operational scope with player identity separate. | `APPROVED` | Project Owner | 2026-11-17 | Explicit approval of all six recommendations in the ChatGPT conversation | The recommendation as formulated in the existing B-13F document | B-09, D-13F-02/04/05 | Do not access protected org-scoped data until approved and implemented. |
| D-13F-02 | Verified organization-specific membership with explicit request/approval/status lifecycle and fail-closed suspension/revocation. | `APPROVED` | Project Owner | 2026-11-17 | Explicit approval of all six recommendations in the ChatGPT conversation | The recommendation as formulated in the existing B-13F document | D-13F-01/03/04/05, B-07/B-09 | No staff authority until lifecycle and verifier are implemented/tested. |
| D-13F-03 | Active membership plus explicit team/session assignment, verified and rechecked for every write. | `APPROVED` | Project Owner | 2026-11-17 | Explicit approval of all six recommendations in the ChatGPT conversation | The recommendation as formulated in the existing B-13F document | D-13F-01/02/04, D-13C-01 | No coach draft/mark/QR/submit access until verified assignment exists. |
| D-13F-04 | Least-privilege SSB administrator scope; review/correction only, separate from recording/submission. | `APPROVED` | Project Owner | 2026-11-17 | Explicit approval of all six recommendations in the ChatGPT conversation | The recommendation as formulated in the existing B-13F document | D-13F-01/02/03/06, D-13C-01/03 | No admin review/correction implementation until exact scope is approved. |
| D-13F-05 | Player-owned persistent identity with historical organization relationships; verified guardian link and separately approved visibility/consent. | `APPROVED` | Project Owner | 2026-11-17 | Explicit approval of all six recommendations in the ChatGPT conversation | The recommendation as formulated in the existing B-13F document | D-13F-01/02/03, BR-01/03/06/07 | No real player/guardian data or attendance visibility until approved. |
| D-13F-06 | No implicit platform access; prefer no identifiable-data access, or explicitly approve a narrowly scoped audited break-glass policy. | `APPROVED` | Project Owner | 2026-11-17 | Explicit approval of all six recommendations in the ChatGPT conversation | The recommendation as formulated in the existing B-13F document | D-13F-01/04, B-07/B-09, audit/operations | Exceptional access remains disabled until policy and controls pass review. |

### Recommendation formulations recorded for approval

The statements below preserve how the recommendations were formulated for owner review. Approval recorded above applies to each recommendation as formulated; bracketed details left owner-defined remain unresolved and implementation still requires separate authorization.

- **D-13F-01:** “I approve a stable, server-resolved organization identity and organization-owned operational scope, with no authority derived from client-supplied organization values. The designated creation/verification authority and lifecycle are: [owner-defined rules].”
- **D-13F-02:** “I approve the following SSB membership request, verification, approval, status-transition, suspension/revocation, and reactivation rules: [owner-defined rules]. Active membership is verified server-side; client role selection or invitation acceptance alone does not grant attendance authority.”
- **D-13F-03:** “I approve coach assignments as [organization/team/session] scoped, created/revoked by [verified authority], effective [lifecycle], with expired or revoked assignments denied at draft update, QR confirmation, and final submission.”
- **D-13F-04:** “I approve SSB administrator scope as [organization/team/session/delegated], with permission to review and correct attendance only within that verified scope; administrators do not record, confirm QR, or submit attendance unless separately approved.”
- **D-13F-05:** “I approve a player-owned persistent identity with [owner-defined] time-bounded SSB membership/transfer behavior, and require verified guardian-player relationships plus [owner-defined] attendance visibility and consent rules. Guardians may initiate or approve only these operational actions: [none or owner-specified actions]. Guardian role labels alone grant no access and do not permit attendance changes.”
- **D-13F-06:** “I approve [no platform operator access / the following narrowly scoped break-glass policy: purpose, approver, scope, duration, audit and review]. No platform-level role receives implicit attendance or player-data access.”

## 7. Explicit Implementation Boundary

This document asks for owner decisions only. It does not approve any of the six recommendations. B-03, B-07, B-09, and D-13C-01 through D-13C-05 remain unchanged. No schema, grant, RLS policy, server function, authentication flow, membership/assignment workflow, QR implementation, attendance persistence, project connection, or deployment is authorized.
