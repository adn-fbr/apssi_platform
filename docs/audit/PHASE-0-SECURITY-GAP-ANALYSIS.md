# Phase 0 Security Gap Analysis

**Scope note:** source-only review; no live deployment, cloud dashboard, provider configuration, penetration test, or external infrastructure was available. No vulnerability exploit test was performed. **NOT IMPLEMENTED** means not found in the checked-in application, not proof that no external control exists.

## Risk summary

The most important release blocker is the mismatch between sensitive child-data claims in the UI and the absence of an evidenced authenticated, server-authorized data path. Current sample data includes identifiable child-profile fields and scout profile records in frontend-imported constants. This is acceptable only as controlled synthetic demo data. Do not connect real child data until trusted access controls, guardian verification, consent enforcement, auditability, and data governance are verified.

## Blueprint security traceability

The accepted [BRB-001](../product/BLUEPRINT-REQUIREMENT-BASELINE.md#L22-L42) makes guardian linkage (BR-06) and consent, privacy, access control, audit trail, revocation and data minimization (BR-07) foundational. The current implementation is **PARTIAL** for both: it shows a parent/child UI, consent switches, a scout consent filter and seeded audit entries, but no server-authoritative relationship or consent policy was found. Other role/organization requirements (BR-04/BR-05) are also only represented as browser persona and organization labels; see [architecture assessment](PHASE-0-ARCHITECTURE-ASSESSMENT.md).

Detailed verification of actual authentication, server authorization, guardian relationship, consent persistence/revocation, cross-organization paths and server-side scout filtering is **BLOCKED** by the absence of those server/data paths in this checkout and the lack of access to external dashboard configuration. The source-level finding that the scout filter runs in the browser is **VERIFIED**; no live endpoint was available to test.

| ID / severity | Area | Finding and evidence | Status | Risk / required action |
|---|---|---|---|---|
| SG-01 / **Critical** | Authentication and authorization | No auth provider/client/session guard or server-side policy was found in route code. `RoleProvider` selects a hard-coded persona based on URL/localStorage. `src/start.ts` comments say auth middleware would be added if a cloud backend is connected. | **NOT IMPLEMENTED in checkout**; external auth **UNKNOWN** | A role name, route, or localStorage value cannot establish identity or permission. Before real data: authenticate server requests and make all access decisions using trusted claims and server-verified membership. |
| SG-02 / **Critical** | Child PII exposure | Frontend-imported player fixtures include name, Football ID, birth year, city, guardian name and sports statistics; scout fixture contains child age/region/performance and consent flags. | **VERIFIED** for mock fixtures; data provenance is **UNKNOWN** | Bundled mock data is readable by any browser receiving the module. Keep fixtures synthetic and scrub any production-derived values. Do not ship real child records as frontend constants. |
| SG-03 / **Critical** | Consent / scout gating | Consent is a local state object; scout consent is a client-side boolean filter. All scout records are in the imported client dataset before filtering. | **PARTIAL** | UI only; server enforcement was not found. A user can bypass presentation filters and inspect client payloads. Perform eligibility and consent checks on every server query and contact request; revocation must affect subsequent access. |
| SG-04 / **High** | Guardian verification | A `verified` Boolean and guardian display name are rendered; parent dashboard selects children from a fixed array. No proof, verification process or relationship authorization is evidenced. | **PARTIAL UI** | Do not infer legal authority from a label or profile match. Define trusted verification, delegated access, re-verification and dispute processes. |
| SG-05 / **High** | RBAC / ABAC / tenant isolation | Role-owned paths and tabs drive navigation only. No server/API policy exists in inspected code. SSB, coach, organizer, referee, scout and association are demo personas. | **PARTIAL UX / NOT IMPLEMENTED enforcement** | UI concealment is not access control. Enforce least privilege per person, active organization membership, team/competition scope, resource sensitivity, relationship, consent and purpose. Test cross-tenant access explicitly. |
| SG-06 / **High** | Sensitive document/file access | No storage integration or document access flow was found. | **NOT IMPLEMENTED in checkout / UNKNOWN externally** | If identity proof, photos, medical data, or documents are introduced, use private storage, server-issued short-lived access, access logging, malware/content validation as appropriate, and retention controls. |
| SG-07 / **High** | Business writes / integrity | Buttons simulate payment, assessment submission, attendance save, referee report submit, assignment, and consent/audit updates locally. | **PARTIAL UI** | No trusted validation, actor attribution, transaction/idempotency or durable audit exists. Never treat a client success toast as authoritative completion. |
| SG-08 / **High** | Audit logging | Parent screen renders a fixed `auditTrail`; client toasts claim changes were recorded. No durable security/audit write path was found. | **PARTIAL UI** | Implement server-generated audit events for sensitive reads/writes, with actor/resource/tenant/action/purpose/outcome/time/correlation and controlled retention. Avoid logging unnecessary child PII. |
| SG-09 / **Medium** | CSRF and server request handling | CSRF middleware is configured for Start server functions and an error middleware exists. No server function uses are found. | **PARTIAL infrastructure** | Preserve and test framework protections when server mutations are added. CSRF is not authentication/authorization or input validation. |
| SG-10 / **Medium** | Error handling / telemetry | SSR errors are logged via `console.error`; Lovable browser reporting hook is optional. | **PARTIAL** | Verify production sink, retention, access and redaction. Avoid placing identifiers, tokens, contact information or child data in exception messages/context. |
| SG-11 / **Medium** | Secrets and runtime config | No secrets are visible in inspected root/source, and Lovable instructions say secrets are externally managed. Dashboard state is inaccessible. | **UNKNOWN** | Do not infer secret hygiene from the checkout. Verify secret inventory/rotation, deployment bindings, least privilege and environment separation with the platform owner. |

Evidence: [src/lib/roles.tsx](../../src/lib/roles.tsx#L209-L250); [src/lib/mock-data.ts](../../src/lib/mock-data.ts#L1-L24), [src/lib/mock-data.ts](../../src/lib/mock-data.ts#L314-L326); [src/routes/scout.tsx](../../src/routes/scout.tsx#L50-L62); [src/routes/parent.tsx](../../src/routes/parent.tsx#L30-L33), [src/routes/parent.tsx](../../src/routes/parent.tsx#L176-L201); [src/start.ts](../../src/start.ts#L17-L33); [src/server.ts](../../src/server.ts#L1-L64); [src/lib/lovable-error-reporting.ts](../../src/lib/lovable-error-reporting.ts#L1-L47).

## Children's personal information and consent

### Data visible in sample content

The player fixture includes a child's name, unique-looking football ID, birth year/category, position/foot, organization, city, guardian name and performance counts. A synthetic flag is not present for each fixture, and the repository does not establish whether values are wholly fictitious. Treat all such data as sensitive until the data owner confirms provenance. Scout cards omit full names but display stable ID fragments, region, age group, matches and development scores; pseudonymization is not equivalent to anonymity.

### Required safeguards before using real records

- Establish a verified authenticated principal and verified guardian relationship before granting child-account or consent-management access.
- Represent consent as an auditable, versioned decision: subject, guardian/authority, purpose, scope, notice/version, action, timestamp, collection channel, expiration if applicable, and withdrawal/supersession state.
- Decide age thresholds, relationship delegation, custody disputes, re-verification, and handling when a player reaches adulthood with legal/privacy review.
- Enforce consent and access scope server-side on each search, result, detail, export, contact request, and downstream disclosure. Avoid fetching disallowed records into the browser.
- Separate identifying data from analytics where practical; minimize fields returned to each role and avoid stable public identifiers in search results.
- Provide guardian/player access, correction, export/deletion or retention handling as approved by policy and applicable law; specify exception/record-retention cases.
- Use explicit purpose limitation and access review for scouting, association aggregates, tournaments, and media/photo publication; one consent must not silently authorize another purpose.

These are recommendations pending legal/product owner decisions, not conclusions about statutory requirements. Obtain Indonesian privacy/legal review and confirm applicable rules before production.

## Authorization policy model

Use the following as a policy checklist, not an approved policy language:

`allow = authenticated AND active_role_grant AND organization_scope AND resource_relationship AND purpose_allowed AND consent_valid AND action_allowed`

The server must derive the actor and organization grant from trusted session/database state; never accept role, tenant, consent, ownership, or guardian claims from arbitrary client context without verification. Association-wide access should return approved aggregates and use privacy controls appropriate to small groups. Add negative tests for cross-organization reads and writes.

## Priority remediation gates

1. **Before ingesting real data:** confirm data provenance; remove real records from bundled fixtures; document data classes and privacy owner.
2. **Before any authenticated pilot:** select and connect auth, verify guardians and organization membership, design server-side RBAC/ABAC/tenant policies, deny by default, and test cross-scope access.
3. **Before consent-controlled scouting:** persist versioned consent and make server-side query/contact policy authoritative; test grant, deny, withdrawal, stale cache, and direct endpoint cases.
4. **Before payment use:** integrate provider-generated transaction and verified provider callback/reconciliation; never set paid from a browser event.
5. **Before official match data:** bind report to an authorized match/referee, validate event/state transitions, record attributable immutable changes, and define correction approval.
6. **Before production:** verify audit/log redaction, storage privacy, secret management, backups, incident response, and security monitoring with deployment owners.

## Unknowns / owner decisions

- Are any names, IDs, regions, dates, performance values or contact details derived from real children?
- Which auth, guardian verification, organizational identity, and account-recovery provider is approved?
- What do "consent" and "verified" mean in the product and who owns proof/review?
- What data may each role read/export, under which organization/competition scope, for which purpose and duration?
- What is the data retention/deletion policy for identity proofs, match events, assessments, consent history, payment evidence and audit logs?
- Who operates security logging, incident response, vulnerability intake, key rotation and privacy requests?
- Are cloud/server configuration and managed integrations enabled in the Lovable project dashboard? **Not verifiable from repository.**