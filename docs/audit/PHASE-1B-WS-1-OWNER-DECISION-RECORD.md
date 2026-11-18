# Phase 1B WS-1 Owner Decision Record

## 1. Document Control

- **Project:** APSI Platform (`apssi_platform`)
- **Decision record:** WS-1 — Owner Decision Record: B-07 and B-09
- **Decision date:** 2026-11-16
- **Status:** `B-07 AND B-09 OWNER PRINCIPLES APPROVED; IMPLEMENTATION AND VERIFICATION PENDING`
- **Scope:** Owner decisions for trusted authentication and authorization (B-07) and tenant isolation and data controls (B-09).
- **Authority:** Explicit owner approval dated 2026-11-16, recorded here without inventing a named approver, signature, meeting, or approval mechanism.
- **Related governance records:** PHASE-1B-OWNER-DECISION-REGISTER.md; PHASE-1B-WS-0-OWNER-DECISIONS.md; PHASE-1B-P1-01A-SECURITY-ACCESS-CONTROL-ARCHITECTURE.md.

## 2. Purpose and Scope

This record documents the owner's approval of specified security principles for B-07 and B-09. It supplements the 2026-11-15 WS-0 record and the Phase 1B Owner Decision Register for these two entries only. BRB-001 remains the sole initial product requirement baseline.

Approval establishes decision direction and does not define unresolved business or technical details. It is not architecture implementation, application implementation, or security verification.

## 3. Owner Approval Statement

On 2026-11-16, the owner explicitly approved the B-07 and B-09 principles and boundaries recorded below. This approval does not resolve the listed subordinate decisions, close either technical blocker, authorize a vertical slice, or authorize implementation or access to a Supabase project or database.

## 4. B-07 Decision Record

**B-07 — Trusted Authentication and Authorization**

- **Classification:** `BLOCKER` (technical prerequisite; remains open pending implementation and verification).
- **Owner approval:** `APPROVED 2026-11-16` for the principles and boundaries in this record.
- **Approved decision:** Trusted authentication and server-side authorization are mandatory security foundations. Supabase Auth is approved as the initial authentication provider candidate. Protected resources and operations require trusted server-side authorization, default-deny and least-privilege principles, session validation, and controlled privileged operations. Browser-supplied roles, permissions, ownership flags, and authorization claims are not authoritative.
- **Condition:** Supabase Auth provider configuration and implementation require separate authorized work. Approval of the candidate does not establish a configured or connected project.
- Approval of Supabase Auth as the initial provider candidate does not approve provider configuration, authentication methods, MFA policy, or session architecture. Those details remain subject to their applicable owner and architecture decisions and separately authorized work.
- **Implementation status:** `PENDING`; no authentication or authorization implementation is approved or evidenced by this record.
- **Security verification status:** `PENDING`; no tests or verification evidence are approved or represented as complete.

## 5. B-09 Decision Record

**B-09 — Tenant Isolation and Data Controls**

- **Classification:** `BLOCKER` (technical prerequisite; remains open pending implementation and verification).
- **Owner approval:** `APPROVED 2026-11-16` for the principles and baseline architecture in this record.
- **Approved decision:** A shared database with logical tenant isolation is the approved baseline architecture. Database grants and RLS or equivalent database controls are complementary security layers. Independent server-side authorization remains mandatory. Cross-tenant access is denied by default; least-privilege access and ownership validation are required; privileged database operations require separate controls.
- This approval does not approve a uniform RLS policy across all tables, any specific database grant or RLS policy, or any design in which RLS replaces independent server-side authorization.
- **Implementation status:** `PENDING`; the shared-database baseline is a direction, not an implemented tenant model or access-control system.
- **Security verification status:** `PENDING`; no tenant-isolation or database-control tests are approved or represented as complete.

## 6. Approved Security Principles

The owner-approved principles are:

- Trusted authentication and authoritative server-side authorization are mandatory for protected resources and operations.
- Default-deny and least privilege apply to protected access.
- Sessions must be validated; privileged operations must be controlled separately.
- Client-supplied roles, permissions, ownership flags, and authorization claims do not grant authority.
- Shared-database logical tenant isolation is the approved baseline direction; cross-tenant access is denied by default.
- Database grants and RLS or equivalent database controls are complementary layers, alongside independent server-side authorization.
- Ownership must be validated, and privileged database operations require separate controls.

These principles are approvals of direction only. They are not evidence of architecture completion, implementation completion, or security verification.

## 7. Conditions and Implementation Boundaries

- Provider configuration, authentication and authorization implementation, database access controls, and security verification require separately scoped and authorized work.
- Supabase Auth is an approved initial provider candidate only; no project creation, linking, configuration, or connection is established or authorized here.
- The shared-database logical-isolation decision does not define a schema, tenant model, grant matrix, RLS policy, or policy-evaluation implementation.
- The Entry Gate remains authoritative for readiness. Approval of these principles alone does not satisfy implementation prerequisites or change the Entry Gate outcome.
- B-07 and B-09 remain technical blockers until their applicable implementation and verification evidence is separately completed and reviewed.
- No production database operation, deployment, or protected-data access is authorized by this record.

## 8. Outstanding Owner Decisions

The following remain `UNDEFINED — OWNER DECISION REQUIRED` where applicable:

- Business roles and the permission matrix.
- Authentication policy details, including MFA requirements.
- Guardian, youth-player, consent, and privacy-related access rules.
- Exact tenant, organization, and membership model.
- Ownership and resource-relationship rules.
- Data classification, retention, and privacy requirements.
- The first protected vertical slice and its scope.

## 9. Outstanding Architecture Decisions

The following remain `ARCHITECTURE DECISION REQUIRED`:

- Session architecture and revocation implementation details.
- The exact database grant matrix.
- Specific RLS policies and the policy-evaluation strategy for approved data surfaces.
- How server-side authorization is coordinated with database grants and RLS while remaining an independent required enforcement layer.
- Whether authorization context is derived from JWT claims, database lookups, or both.
- Tenant-scoped query and ownership-validation implementation strategy.
- Access-control implementation for exposed views, functions, and privileged operations.

No grant or RLS policy is approved by listing these decisions.

## 10. Relationship to WS-0 and P1-01A

WS-0, dated 2026-11-15, records B-07 and B-09 as open technical blockers and states that approval of architectural direction is not evidence of implementation or verification. This WS-1 record adds the owner's 2026-11-16 approval of the principles and baseline direction above; it preserves the blockers and WS-0's other decisions.

P1-01A is a design-only architecture definition. It describes requirements and unresolved implementation decisions; it does not implement or approve a specific grant matrix or RLS policy set. WS-1 does not revise that document or convert its design into implementation evidence.

## 11. Phase 1B Governance Impact

The Owner Decision Register should record B-07 and B-09 as owner-approved on 2026-11-16 for the scope in this record, with implementation and verification still pending. Their original IDs and `BLOCKER` classifications remain unchanged. B-11 and all unrelated decisions are unchanged.

The Phase 1B Entry Gate outcome is not changed by this approval. Other readiness requirements and technical evidence remain outstanding; approval alone does not authorize implementation or protected-data use.

## 12. Explicit Exclusions

This record does not authorize or perform:

- Application, authentication, authorization, or database-security implementation.
- Supabase project creation, linking, configuration, CLI installation or execution, or project access.
- SQL, migrations, schemas, database grants, or RLS policy creation or application.
- Database or production access, production changes, or deployment.
- Definition or implementation of a business role/permission matrix or tenant/membership model.
- Environment, secret, or dependency changes; tests or builds; staging, commit, or push.

## 13. Final Decision Summary

The owner approved the stated B-07 trusted-authentication and authorization principles, including Supabase Auth as an initial provider candidate, and the B-09 shared-database logical-tenant-isolation baseline on 2026-11-16. Subordinate owner and architecture decisions remain open. B-07 and B-09 remain technical blockers pending separately authorized implementation and security verification. No implementation, project configuration, database operation, or vertical slice is authorized by this record.
