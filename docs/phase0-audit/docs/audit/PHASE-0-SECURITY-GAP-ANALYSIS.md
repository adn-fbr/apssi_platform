# Phase 0 — Security Gap Analysis

**Scope:** static source inspection only. This is not a penetration test, privacy impact assessment, or legal compliance opinion.

## 1. High-priority findings

| ID | Severity | Finding | Evidence | Required control |
|---|---|---|---|---|
| SEC-01 | CRITICAL | Role switching is client-side UI state and cannot establish identity or authority. | `src/lib/roles.tsx` stores `bolaid.role` in localStorage; `app-shell.tsx` exposes role switcher. | Real authentication plus server-side role assignments and authorization checks. |
| SEC-02 | CRITICAL | Scout consent filtering is performed against static demo data in the browser. | `src/routes/scout.tsx` filters `scoutPool` using `p.consent`; sample consent values live in `mock-data.ts`. | Server-side consent evaluation before returning any discoverable player data; default deny; audit disclosure and contact requests. |
| SEC-03 | CRITICAL | Parent consent controls are transient component state; no durable consent evidence or server enforcement is shown. | `src/routes/parent.tsx` initializes consent with `useState` and updates local state/toast. | Consent record with guardian authority, purpose, version, timestamp, status, revocation, and enforcement at every data access. |
| SEC-04 | HIGH | Parent/child ownership and guardian verification are not authenticated or enforced. | Parent page selects children from static mock data. No auth/guardian service found. | Verified guardian relationships and authorization based on relationship, not selected child ID from client. |
| SEC-05 | HIGH | Financial UI can mark invoices as paid through local state. | `src/routes/payments.tsx` local `paid` state; parent page also locally changes paid state. | Server-authoritative payment state, provider callbacks/webhook verification, idempotency, reconciliation, and audit. |
| SEC-06 | HIGH | Match report UI can claim submission without a persisted authoritative report. | `src/routes/referee_.report.tsx` submits via toast; event state is local. | Authenticated official assignment, match state machine, server validation, immutable/correctable event audit. |
| SEC-07 | HIGH | No domain authorization middleware/service or authenticated API is evidenced in the archive. | No auth SDK/service, domain server functions, database client, or API modules identified. | Establish authorization policy and test it before exposing protected data. |
| SEC-08 | MEDIUM | `localStorage` role value is cast to `RoleId`; runtime value validation exists against known roles, but it remains a presentation preference, not trusted security context. | `src/lib/roles.tsx`. | Keep as UI preference only; never send it as authority. Validate all server-side identifiers and claims. |

## 2. Security requirements from the Blueprint

The implementation must account for:
- Guardian relationship and consent.
- Access control and data minimization.
- Audit trail.
- Revocation.
- Distinct sensitivity levels for identity, football, performance, sensitive, and aggregate analytics data.
- Parent access limited to their own child/children.
- Coach access limited to players in assigned teams/organizations.
- SSB access limited to authorized organization scope.
- Scout access limited to explicitly consented discoverable data.
- Association/federation access limited to authorized geography and aggregation scope.

## 3. Minimum security acceptance gates before real child data

1. No real child data in production until authentication and server-side authorization are active.
2. No scout search response may include a player unless an active, purpose-matched permission allows that disclosure.
3. Consent revocation must take effect for subsequent requests and prevent new disclosures; previously disclosed data handling must follow an owner-approved policy.
4. Parent/guardian access must be proven by a verified relationship, not a client-provided child ID alone.
5. Every access to restricted player data and every consent change must produce an auditable event.
6. Sensitive documents/media must be private by default and delivered only through short-lived authorized access.
7. Cross-tenant tests must prove that one SSB cannot read another SSB's private roster, invoices, or internal records.
8. Test fixtures must use synthetic data, not real children.

## 4. Unknowns requiring owner/legal review

- Guardian verification evidence and dispute process.
- Consent purposes, minimum age/guardian rules, duration, renewal, and revocation effects.
- Public vs private player profile fields.
- Retention/deletion/export rules.
- Medical data scope (Blueprint mentions medical/official identity and sensitive data but does not define a medical-record feature).
- Applicable legal obligations and required notices. Do not infer legal compliance from technical implementation alone.
