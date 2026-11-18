# P1-01A Security & Access-Control Architecture Definition

- **Document status:** DESIGN-ONLY ARCHITECTURE REQUIREMENTS
- **Work package:** P1-01A — Security & Access-Control Architecture Definition
- **Approved work type:** DESIGN-ONLY
- **Prepared:** 2026-11-16
- **Scope:** Architecture requirements for B-07 and B-09 only, in preparation for a future, explicitly selected vertical slice.
- **Blocker status:** B-07 and B-09 remain open blockers; this design does not resolve them.
- **Authorization boundary:** This document does not resolve either blocker, does not approve implementation, and does not authorize project connection, SQL, migration work, CLI execution, database access, or production activity.

## 1. Executive Summary

**VERIFIED CURRENT STATE**

- P1-00A recorded repository evidence at branch `chore/phase-1a-governance-reconciliation`, HEAD `6da46b5058d38ebff302b7934ce576d149573a08`; that evidence review identified no Supabase project configuration or migration directory in the inspected checkout.
- No implementation was identified in the repository evidence reviewed for P1-00A. A configured or connected Supabase project was not verified within that approved review scope; external project and runtime state remain unknown.
- Governance records explicitly classify B-07 and B-09 as blockers, and they remain unresolved. The project may continue with design-only analysis, but not with implementation or protected-data access.
- [BRB-001 — Blueprint Requirement Baseline](../product/BLUEPRINT-REQUIREMENT-BASELINE.md) remains the sole product baseline. It leaves authentication-provider details, guardian verification, consent lifecycle, retention, and detailed role/permission rules undefined.

**DEFINED AS DESIGN REQUIREMENT**

This document defines security architecture requirements for a future authorized implementation. They are not owner-approved policies or implemented controls. The design is limited to control boundaries, policy intent, and verification requirements; it does not select an identity provider, define business roles, or approve any RLS policy set.

**REQUIRED FUTURE CONTROL**

Any future implementation must enforce a trusted server boundary, default-deny authorization, and explicit server-side data access control. The architecture must separate authentication from authorization, treat user session claims as untrusted until validated, and enforce tenant or ownership boundaries at both the server and database layers.

**UNDEFINED — OWNER DECISION REQUIRED**

- The identity provider and authentication model.
- The user, guardian, organization, tenant, and membership model.
- Roles, permissions, and approval chains.
- Youth privacy, guardian verification, consent lifecycle, and retention rules.
- The first vertical slice and its protected data scope.

## 2. Scope and Explicit Exclusions

### In scope

- Security architecture context for the repository and current governance status.
- Secure trust boundaries for browser/client, server/API, identity provider, and data layer.
- B-07 authentication and authorization architecture requirements.
- B-09 tenant isolation and data-access control requirements.
- Threat and misuse-case analysis.
- Future negative-test verification requirements.
- Unresolved decisions and traceability to BRB-001.

### Explicit exclusions

- Application implementation.
- Identity-provider selection or configuration.
- Business-role definition.
- Guardian/consent/privacy policy approval.
- RLS policy creation or approval.
- SQL, migration creation, execution, or database mutation.
- CLI installation, project linking, project access, or external configuration inquiry.
- Code, package, schema, dependency, environment, or source-file changes.
- Tests or build execution in this work package.
- Production deployment or operational rollout.

## 3. Evidence Reviewed and Limitations

### Repository evidence reviewed

- [BRB-001 — Blueprint Requirement Baseline](../product/BLUEPRINT-REQUIREMENT-BASELINE.md)
- [docs/audit/PHASE-1B-ENTRY-GATE.md](PHASE-1B-ENTRY-GATE.md)
- [docs/audit/PHASE-1B-OWNER-DECISION-REGISTER.md](PHASE-1B-OWNER-DECISION-REGISTER.md)
- [docs/audit/PHASE-1B-WS-0-OWNER-DECISIONS.md](PHASE-1B-WS-0-OWNER-DECISIONS.md)
- [docs/audit/PHASE-1B-P1-00A-REPOSITORY-TOOLING-EVIDENCE-REPORT.md](PHASE-1B-P1-00A-REPOSITORY-TOOLING-EVIDENCE-REPORT.md)
- Relevant repository governance and architecture records referenced by those documents.

### Official public documentation reviewed

- Supabase Auth: https://supabase.com/docs/guides/auth — accessed 2026-11-15.
- Supabase Product Security: https://supabase.com/docs/guides/security/product-security — accessed 2026-11-15.
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security — accessed 2026-11-15.
- Supabase Securing your API: https://supabase.com/docs/guides/api/securing-your-api — accessed 2026-11-15.

### Limitations

**VERIFIED CURRENT STATE**

- A configured or connected Supabase project, environment, schema, or operational configuration was not verified within the approved repository review scope; external state is unknown.
- No database or external service was accessed as part of this work.
- Public documentation provides platform guidance and architectural patterns, not repository-specific authorization or implementation status.
- The architecture in this document is design-only and remains subject to explicit owner decisions for product, privacy, and tenant rules.

## 4. Current-State Security Assessment

### Verified repository context

**VERIFIED CURRENT STATE — REPOSITORY EVIDENCE ONLY**

- P1-00A identified no Supabase project configuration or migration directory in the inspected checkout. No implementation was identified in the repository evidence reviewed for P1-00A.
- A configured or connected Supabase project was not verified within the approved review scope. This is not a claim about external environments or runtime behavior.
- Current governance records explicitly record B-07 and B-09 as blockers; this document does not reinterpret them as resolved.

### Current security posture

**VERIFIED CURRENT STATE — REPOSITORY EVIDENCE ONLY**

- The repository audits cited by the Entry Gate did not identify a trusted server boundary, server-side session validation, or database-level tenant-isolation enforcement in the checked-in application.
- The Entry Gate and Security Gap Analysis identify an absent or incomplete server authorization boundary, lack of server-side filtering, and unknown fixture provenance.
- The cited repository audits characterize the checked-in application as a prototype with mock/static data; no production-grade server-side security implementation was identified in the reviewed repository evidence.

**DEFINED AS DESIGN REQUIREMENT**

The future system must treat all client-side state as untrusted and must move authorization decisions to a trusted server boundary and database enforcement layer. Client routing or UI logic cannot be accepted as authorization evidence.

## 5. Proposed Logical Security Architecture

**DEFINED AS DESIGN REQUIREMENT**

### Trust boundaries

1. Browser / client boundary
   - Client requests and UI state are untrusted.
   - No direct authority to grant access to protected data.
   - All authorization decisions must be server-validated.

2. Server / API boundary
   - The trusted enforcement boundary for authentication, authorization, and business validation.
   - Must reject unauthenticated or unqualified requests by default.
   - Must evaluate tenant ownership, role, and operation scope before data access.

3. Identity provider boundary
   - Produces trusted identity facts or tokens only after owner-approved provider selection.
   - Must not be treated as authorization by itself.
   - Session validation and expiry/revocation must be enforced server-side.

4. Database and data-access boundary
   - Database privileges/grants determine which database roles can access objects; RLS policies constrain which rows those roles can access or modify. Both must be considered for exposed data surfaces.
   - Must reject cross-tenant access even when the caller has a valid identity.
   - RLS does not replace grants and must not be treated as protecting roles or credentials that bypass RLS. Privileged operations remain separate from user-facing data access.

### Required architecture properties

**REQUIRED FUTURE CONTROL**

- Default-deny for all protected resources.
- Trusted authentication and session validation on the server.
- Authorization evaluation using validated identity, approved policy, and request context.
- Distinct handling for authenticated identity, user roles, tenant membership, and protected object ownership.
- Data-access enforcement at both the API layer and the database layer.
- Separation of privileged operational roles from end-user roles.
- No silent trust of client-provided IDs, role claims, ownership flags, or UI state.

## 6. B-07 — Trusted Authentication and Authorization Requirements

### B-07 objective

Define the architecture requirements for trusted authentication and authorization without approving an identity provider or claim source.

### Architecture requirements

**REQUIRED FUTURE CONTROL**

1. Authentication and authorization are separate responsibilities.
   - Authentication proves identity of the caller.
   - Authorization decides whether that caller may perform a given action on a given resource.
   - The system must not conflate the two.

2. Trusted identity validation must occur in the server boundary.
   - Session tokens or JWTs must be validated at the trusted server boundary.
   - Expired, invalid, tampered, or untrusted tokens must result in denial, not partial access.

3. Default-deny authorization must be enforced.
   - No protected operation is permitted unless explicitly authorized.
   - If identity, session context, tenant context, or role context is missing or invalid, the request fails closed.

4. Server-side authorization must be authoritative.
   - The server must evaluate user identity, relationship claims, role checks, ownership checks, and tenant scope using trusted data.
   - Client-supplied role or object ownership values must not determine access.

5. Protected operation boundaries must be explicit.
   - Read, write, update, delete, approval, and administrative operations must be separated by permission declarations and route-level checks.
   - Privileged operations must be isolated from ordinary user flows.

6. Session lifecycle controls must be defined.
   - Expiration, refresh, idle timeout, force logout, session revocation, and revalidation must be explicit controls.
   - If a session is invalid or stale, the server must deny access and require reauthentication or revalidation.

7. Failure behavior must be closed and auditable.
   - When identity or authorization cannot be established, the response must deny access and log or store the event according to approved policy.

### B-07 design constraints

**UNDEFINED — OWNER DECISION REQUIRED**

- Identity provider model.
- User authentication methods and MFA policy.
- Role model and permission matrix.
- Guardian and youth account rules.
- Session lifetime, refresh interval, and revocation policy.

**ARCHITECTURE DECISION REQUIRED**

- Whether JWT claims, database lookups, or both are used to determine authorization context.
- Whether claims are used for direct authorization or only as identity and relationship evidence.
- How role resolution and token refresh are integrated into the server boundary.

## 7. B-09 — Tenant Isolation and Data-Access Requirements

### B-09 objective

Define the architecture requirements for tenant and ownership boundaries, server-side data enforcement, and database-level isolation without approving one tenant model or a specific policy set.

### Architecture requirements

**REQUIRED FUTURE CONTROL**

1. Ownership and tenant boundaries must be explicit.
   - Every protected resource must define its owning subject, tenant, or organization boundary.
   - Access decisions must be checked against both the resource owner and the caller context.

2. Data access must be enforced server-side.
   - The server must authorize every read, insert, update, and delete operation before data is returned or mutated.
   - Access control must not rely on client-side filtering alone.

3. Database-level enforcement is required for exposed data.
   - Database privileges/grants determine which database roles can access objects; RLS policies constrain which rows those roles can access or modify. These are complementary controls, and both must be considered for each exposed data surface.
   - RLS is a defense-in-depth layer, not a substitute for grants and not a control over privileged roles or credentials that bypass it. The exact grants and policy set are not approved or implemented by this document and must be designed and tested later.

4. Cross-tenant access must be denied by default.
   - A user may not read or modify another user’s records, another club member’s records, or another tenant's data.
   - All queries must be scoped by approved ownership or tenant context.

5. BOLA and IDOR protections must be designed in.
   - Resource IDs and object references must not be used as authorization evidence.
   - The server must verify access using server-side authorization logic, not by trusting an ID supplied by the client.

6. Separate handling for privileged operations.
   - Service roles and privileged administrative credentials must have narrowly scoped usage and must never be exposed to browser code. RLS must not be treated as limiting a role that bypasses it.
   - Privileged operations must be intentionally restricted and separately reviewed.

7. Views and functions must be treated as data surfaces.
   - Views can bypass RLS by default unless configured correctly.
   - Security definer functions and exposed functions require careful scoping and policy review.
   - A function or view that exposes data must be treated as part of the trusted access boundary.

### B-09 design constraints

**UNDEFINED — OWNER DECISION REQUIRED**

- Tenant model and ownership graph.
- Organization membership rules.
- User-to-organization and guardian relationship model.
- Data classification and retention policy.
- Which tables/functions/views are exposed to which roles.

**ARCHITECTURE DECISION REQUIRED**

- How the required server-side authorization boundary will be coordinated with complementary database grants and RLS.
- How multi-tenant queries, role membership joins, and ownership checks are defined and indexed.
- Whether any functions or views are permitted as exposed data surfaces.

## 8. Trust Boundaries and Threat Matrix

### Trust boundaries summary

**VERIFIED CURRENT STATE — REPOSITORY EVIDENCE ONLY**

No server or database trust-boundary implementation was identified in the repository evidence reviewed for P1-00A. A configured or connected project and its runtime controls were not verified within that review scope.

| Boundary | Current evidence | Required control |
| --- | --- | --- |
| Browser / client | Prototype and UI state only; no verified auth boundary | Treat as untrusted |
| Server / API | Not evidenced as a trusted enforcement boundary | Must validate and authorize every request |
| Identity provider | Not selected or verified | Must be approved before use |
| Database | No verified RLS or tenant layering | Must enforce grants and row/tenant restrictions |

### Threat and misuse-case matrix

| Threat | Affected boundary | Required mitigation | Verification evidence needed |
| --- | --- | --- | --- |
| Unauthenticated access to protected resources | Server / API / Database | Default-deny, server-side validation, explicit grants | Negative test: unauthenticated request denied |
| Authenticated user accessing another user's resources | Server / API / Database | Ownership and tenant checks, RLS or equivalent enforcement | Negative tests for cross-user read/update/delete denial |
| Cross-tenant data access | Database / API | Tenant-scoped queries and explicit tenant policy checks | Negative tests for tenant isolation |
| Forged or stale identity/role claims | Identity provider / Server | Validate token, session state, expiry, and issuer claims | Session invalidation and revalidation tests |
| Client-side authorization bypass | Browser / API | Server authoritative checks; no trust in UI state | Negative tests using forged request context |
| Privileged credential exposure | Server / Secrets / Database | No secret in browser code; least privilege; service-role separation | Secret-handling design review and access boundaries |
| Unauthorized updates or ownership reassignment | API / Database | `using` and `with check` style semantics for update; ownership validation | Negative update and ownership-reassignment tests |
| Access through alternate data surfaces | Views / Functions / Database | Treat views and functions like protected surfaces; explicit grants and review | Negative tests for function/view access controls |

## 9. Future Negative-Test and Verification Requirements

**REQUIRED FUTURE CONTROL**

The following tests must exist before protected data is used. This section defines requirements and expected outcomes only; no tests are written or executed in this work package.

- Unauthenticated request denied.
- Authenticated but unauthorized request denied.
- Cross-tenant read denied.
- Cross-tenant update denied.
- Cross-tenant delete denied.
- Ownership reassignment denied.
- Privileged operation denied to ordinary users.
- Session invalidation or revocation behavior verified.
- Default-deny when authorization context is missing or invalid.

### Expected negative-test design patterns

**DEFINED AS DESIGN REQUIREMENT**

- Use explicit allow/deny assertions for every exposed table, function, and view.
- Test missing database grants and row-policy-denied access separately; they are complementary controls.
- Confirm that a policy that filters rows out returns no rows rather than silently performing a write.
- Pair every denied write with a check that the target row remains unchanged.
- Include test cases for stale JWTs and expired sessions.
- Include cases for mismatched tenant membership, invalid object ownership, and privileged operations attempted by ordinary users.

## 10. Unresolved Owner and Architecture Decisions

### UNDEFINED — OWNER DECISION REQUIRED

- Identity provider and authentication model.
- User, guardian, tenant, organization, and membership model.
- Role and permission model.
- Guardian verification and consent lifecycle.
- Youth privacy and data-retention policy.
- Data classification and approved retention/deletion model.
- First selected vertical slice and its protected data scope.
- Operational ownership for secrets, hosting, and incident response.

### ARCHITECTURE DECISION REQUIRED

- Server trust boundary and request validation approach.
- Whether authorization is derived from JWT claims only or validated against database state.
- The database grant matrix and the specific RLS policies for each approved data surface.
- How server-side authorization relates to database grants and RLS as independent, complementary enforcement layers; RLS does not substitute for grants or protect against privileged roles and credentials that bypass it.
- Tenant-scoped query and ownership-validation strategy.
- Access control for exposed views, functions, and privileged operations.
- How privileged operations and security definer functions are isolated and reviewed.
- How views, functions, and alternate data surfaces are exposed or kept private.

## 11. BRB-001 Traceability Matrix

| B-07 / B-09 topic | Relevant BRB-001 theme | Architecture requirement | Future implementation responsibility | Verification required | Status |
| --- | --- | --- | --- | --- | --- |
| Trusted identity and session validation | BR-07 (access-control principle; provider and session specifics are not stated) | Validate identity before authorization | Future server session validation and token checking | Negative session/expired-token tests | `DEFINED AS DESIGN REQUIREMENT; NOT IMPLEMENTED / NOT VERIFIED` |
| Authentication vs authorization separation | BR-07 (access-control principle; this distinction is a design requirement, not specified by the baseline) | Separate identity proof from allowed actions | Future server policy evaluation and permission routing | Unauthenticated/unauthorized denial tests | `DEFINED AS DESIGN REQUIREMENT; NOT IMPLEMENTED / NOT VERIFIED` |
| Default-deny behavior | BR-07 (access-control principle; default-deny is not specified by the baseline) | Deny when no trusted authorization context exists | Future server gateway and API enforcement | Missing-context denial tests | `DEFINED AS DESIGN REQUIREMENT; NOT IMPLEMENTED / NOT VERIFIED` |
| Authorization boundaries | BR-07 (access control); BR-12 covers MVP focus only and does not define authorization | Explicit controls for protected operations | Future server-side authorization checks | Cross-user and cross-tenant denial tests | `DEFINED AS DESIGN REQUIREMENT; NOT IMPLEMENTED / NOT VERIFIED` |
| Guardian relationship and youth protections | BR-06 (connectable guardian relationship only); BR-07 (privacy and access-control principles) | Apply only owner-approved guardian, consent, and privacy rules | Future product-policy and server-layer implementation | Consent/privacy verification and negative tests | `UNDEFINED IN BRB-001; OWNER DECISION REQUIRED; PENDING — NO APPROVED VERTICAL SLICE` |
| Tenant or ownership isolation | BR-07 (access-control principle); BR-03 (historical membership periods) and BR-05 (organization types) are contextual only and do not define tenant isolation | Enforce approved resource ownership and tenant boundaries before access | Future database and API enforcement | Cross-tenant deny tests | `DEFINED AS DESIGN REQUIREMENT; UNVERIFIED — BASELINE MAPPING REQUIRED; TENANT MODEL UNDEFINED IN BRB-001; NOT IMPLEMENTED / NOT VERIFIED` |
| Data access through database layer | BR-07 (access-control principle; database controls and RLS are technical design choices) | Consider database grants and RLS as complementary controls for exposed data | Future schema/access design and migration review, if separately authorized | Row access and privilege tests | `DEFINED AS DESIGN REQUIREMENT; SPECIFIC GRANTS/RLS NOT APPROVED, NOT IMPLEMENTED / NOT VERIFIED` |
| Protected operation separation | BR-04 (one person may hold multiple roles; permissions are not specified); BR-07 (access-control principle) | Separate privileged operations from ordinary-user operations under an approved permission model | Future security model and privileged-path design | Privileged-operation denial tests | `DEFINED AS DESIGN REQUIREMENT; ROLE/PERMISSION MODEL UNDEFINED IN BRB-001; NOT IMPLEMENTED / NOT VERIFIED` |
| Data classification and retention | BR-07 (privacy and data minimization; classification and retention details are not specified) | Require approved classification and retention decisions before implementation | Owner decision and future implementation | Policy evidence and applicable access/retention verification | `UNDEFINED IN BRB-001; OWNER DECISION REQUIRED` |
| Vertical-slice-specific access model | BR-12 (MVP focus only; it does not define slice-specific access requirements) | Define access requirements only for an owner-selected slice | Future slice-specific implementation decisions | Slice-specific acceptance criteria | `UNVERIFIED — BASELINE MAPPING REQUIRED; PENDING — NO APPROVED VERTICAL SLICE` |

## 12. Implementation Prerequisites and Sequencing

**PROPOSED SEQUENCE — NOT APPROVED; NOT IMPLEMENTED / NOT VERIFIED**

Implementation should proceed only after the following are approved and evidenced:

1. A bounded vertical slice is selected and accepted by the owner.
2. Identity provider, authentication model, and session policy are approved.
3. User/tenant/guardian/role model is approved.
4. Server trust boundary, API contract, and data model are approved.
5. Data classification, consent, and retention policy are approved.
6. Environment and secret ownership are approved.
7. Required negative tests are defined for protected data access.

### Suggested ordering

1. Owner selects a bounded vertical slice and acceptance criteria.
2. Approve identity, session, and authorization model.
3. Approve tenant and ownership model.
4. Define data exposure and security model for each table, view, and function.
5. Define required policy tests and negative-case evidence.
6. Only then implement the selected slice under controlled authorization and verification.

## 13. Official References and Access Dates

- [Supabase Auth](https://supabase.com/docs/guides/auth), accessed 2026-11-15.
- [Secure configuration of Supabase products](https://supabase.com/docs/guides/security/product-security), accessed 2026-11-15.
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), accessed 2026-11-15.
- [Supabase Securing your API](https://supabase.com/docs/guides/api/securing-your-api), accessed 2026-11-15.
- [BRB-001 — Blueprint Requirement Baseline](../product/BLUEPRINT-REQUIREMENT-BASELINE.md)
- [docs/audit/PHASE-1B-ENTRY-GATE.md](PHASE-1B-ENTRY-GATE.md)
- [docs/audit/PHASE-1B-OWNER-DECISION-REGISTER.md](PHASE-1B-OWNER-DECISION-REGISTER.md)
- [docs/audit/PHASE-1B-WS-0-OWNER-DECISIONS.md](PHASE-1B-WS-0-OWNER-DECISIONS.md)
- [docs/audit/PHASE-1B-P1-00A-REPOSITORY-TOOLING-EVIDENCE-REPORT.md](PHASE-1B-P1-00A-REPOSITORY-TOOLING-EVIDENCE-REPORT.md)

## 14. Final Status and Limitations

**FINAL STATUS**

This architecture definition is a design-only artifact that defines required controls and unresolved decisions for B-07 and B-09. It does not claim either blocker is resolved and does not authorize implementation, database access, project connection, SQL, migration work, or production deployment.

**LIMITATIONS**

- A configured or connected Supabase project and its runtime environment were not verified within the approved review scope; external state remains unknown.
- No external platform, database, or secret access was performed.
- No implementation or test execution was performed in this package.
- The document remains subject to explicit owner decisions for vertical-slice scope, identity, guardian, consent, privacy, and data classifications.

P1-01A STATUS: DESIGN DOCUMENT COMPLETED — PENDING OWNER REVIEW
