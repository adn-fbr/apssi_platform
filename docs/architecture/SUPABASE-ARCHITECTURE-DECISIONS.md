# Supabase Architecture Decisions

**Purpose:** Record approved technical direction and outstanding architecture choices for APSI Platform. This is governance documentation only. It defines no schema, SQL, table names, RLS policies, authentication flows, or new business rules.

## Authority and status vocabulary

- Product behavior is governed only by [BRB-001](../product/BLUEPRINT-REQUIREMENT-BASELINE.md). Missing product rules remain `UNDEFINED`.
- Owner-approved technical direction is recorded in [PHASE-0-OWNER-DECISION-RECORD.md](../audit/PHASE-0-OWNER-DECISION-RECORD.md), especially OD-03 through OD-11.
- `APPROVED` means an owner has selected a direction. It does not mean implemented, configured, connected, tested, or production-ready.
- `PROPOSED` means a recommendation for review, not an owner decision.
- `UNDEFINED` means product behavior/policy is not specified in the approved baseline or an explicit owner decision.
- `ARCHITECTURE DECISION REQUIRED` means a technical choice has not been approved.

## Approved direction and current evidence

| Area | Status | Decision / evidence |
| --- | --- | --- |
| Primary database | APPROVED | Supabase PostgreSQL is the intended primary database (OD-03/04). No project connection, schema, client, or migration is evidenced in this checkout. |
| Authentication | APPROVED | Supabase Auth is the sole approved authentication service (OD-05). Session, recovery, enrollment, and identity-proofing flows remain `UNDEFINED`; configuration is not verified. |
| Row Level Security | APPROVED | Shared multi-tenant PostgreSQL with RLS as the primary database isolation control is approved (OD-08). Consider and verify RLS for every exposed application-data table. No policies or schemas are defined by this document. |
| Server authorization | APPROVED | Server-side, default-deny RBAC plus resource, relationship, attribute, and purpose checks are approved (OD-09). The exact permission matrix and policy implementation remain `UNDEFINED`; client role state is never authorization. |
| Repository and migrations | APPROVED | Schema and migration source belongs in GitHub and is managed through VS Code/repository workflow (OD-04/11). Every schema change requires a reviewed migration and compatibility/security review. |
| Supabase CLI | APPROVED INTENT / VERIFICATION REQUIRED | CLI is the intended database development tool (OD-11), subject to checking supported version and current official documentation before use. Installed version and CI workflow are not verified; no CLI operation was run in Phase 1A. |
| Secret boundary | APPROVED PRINCIPLE / OWNER UNRESOLVED | Never commit secrets; never expose `service_role` or other privileged credentials to browser code. Use public client configuration only where appropriate. Secret provider, owner, rotation, and environment mapping require an architecture decision. |
| Environments | PROPOSED | Keep local development, staging, and production isolated, with explicit project/config ownership and controlled promotion. Actual project topology and approval gates are not verified. |
| Backups and recovery | PROPOSED | Define backup/restore ownership and test restoration before production reliance. Retention, recovery objectives, schedule, and provider settings are not approved or verified here. |
| Audit logging | APPROVED DIRECTION | Centralized, append-oriented audit logging with restricted access and documented retention is approved (OD-10). Event coverage, implementation, retention periods, and operations remain unresolved. |
| Organization isolation | APPROVED | Shared multi-tenant PostgreSQL with RLS as primary isolation is approved (OD-08). Tenant model details, administrative access, tests, and policy coverage remain to be designed and verified. |
| Guardian and child data | APPROVED PRINCIPLES | Many-to-many guardian/player relationship and independently verifiable relationships are approved (OD-06). Verification authority, evidence, delegation, disputes, and permissions remain `UNDEFINED`. |
| Consent and privacy | APPROVED PRINCIPLES | Consent must be purpose-specific, recorded, reviewable, and revocable (OD-07), with privacy/access control/audit/data minimization foundational under BR-07. Purposes, granularity, duration, age transition, withdrawal effects, and evidence remain `UNDEFINED`. |
| Initial server execution boundary | APPROVED DIRECTION (WS-0 B-03, 2026-11-15) | Use TanStack Start server functions within a modular monolith as the initial server boundary. This approves a direction only, not implementation or slice-specific contracts. |
| Service/API contracts and data-access boundary | ARCHITECTURE DECISION REQUIRED | Define slice-specific server-function contracts, domain/application service responsibilities, validation, transaction boundaries, and any external API protocol/versioning. B-03 does not select the database client/connection method, detailed service contracts, or external integration protocol. |
| Domain modularity | APPROVED GOAL; IMPLEMENTATION DESIGN OPEN | Domains should evolve independently without unnecessary coupling (OD-11). WS-0 B-03 approves an initial modular-monolith server boundary; module structure, dependency rules, and deployment topology remain to be designed and do not define a schema. |
| Supabase Storage | APPROVED CAPABILITY; USE CONDITIONAL | Supabase Storage is included in the platform direction (OD-03), but enable/use only when a documented product use case justifies it (OD-11). No bucket, object policy, or file workflow is defined. |

**B-03 reconciliation — approved direction, not implementation:** The owner-approved WS-0 decision dated 2026-11-15 selects TanStack Start server functions within a modular monolith as the initial application server execution boundary. It does not imply that server functions exist, authenticate requests, authorize operations, enforce tenant isolation, select a database access method, or define slice-specific contracts. Supabase PostgreSQL/Auth remain approved provider directions/candidates, not evidence of a configured or connected project. B-07 authentication/authorization and B-09 tenant/database controls remain independent blockers. See [WS-0](../audit/PHASE-1B-WS-0-OWNER-DECISIONS.md), [WS-1](../audit/PHASE-1B-WS-1-OWNER-DECISION-RECORD.md), and the [B-13D readiness proposal](B-13D-ATTENDANCE-PERSISTENCE-AND-QR-IMPLEMENTATION-READINESS.md).

## Security and data boundaries

- Supabase client/public configuration is not a secret when intentionally designed for browser use, but it does not authorize access. Restrict its capabilities with RLS and server-side policy. Do not put service-role keys, database credentials, signing secrets, or other privileged values in browser bundles.
- Derive authenticated identity and organization/resource scope from trusted server-validated state. Do not trust role, tenant, guardian, consent, or ownership claims supplied only by the browser.
- Apply server authorization and business validation to every protected read, search, export, and write; RLS is a complementary database layer, not a substitute for application policy.
- Enforce approved consent purpose and guardian/player relationship rules at the data boundary. Do not fetch restricted child records to the browser and hide them with client-side filters.
- Keep audit events attributable and access-controlled while minimizing sensitive values. Do not log credentials or unnecessary child data.
- Use synthetic data for development and tests. The provenance of existing prototype fixtures has not been confirmed; do not treat them as production-safe.

## Migration and environment governance

- Migration source and review history live in this repository. A migration must be reviewed for backward compatibility, data safety, security/RLS implications, and deploy/rollback sequencing.
- Supabase CLI is the intended tool only after its version and official documentation are verified. No CLI installation, project link, SQL execution, migration creation, or database push is authorized by Phase 1A.
- Separate development, staging, and production credentials/projects where the approved topology requires them. Never copy production secrets into local files or commit them.
- Production database changes require an explicit release plan and owner approval. Do not execute production SQL or apply migrations without explicit authorization.
- Environment-specific secret storage and ownership are not established by the repository or by this document.

## UNRESOLVED DECISIONS

The following require owner/platform/product/security review before their respective implementation. No option below is selected by this document.

1. **Project and environment topology — ARCHITECTURE DECISION REQUIRED:** Supabase project identities, environment separation, regions, owners, configuration, and whether staging/production are distinct projects. No project is verified as connected.
2. **CLI/tooling — ARCHITECTURE DECISION REQUIRED:** Supported Supabase CLI version, installation policy, generated migration workflow, CI integration, and how version drift is controlled. Verify current official Supabase documentation before selecting details.
3. **Migration release process — ARCHITECTURE DECISION REQUIRED:** Review roles, automated checks, staging application, production deployment approvals, rollback/forward-fix practice, and compatibility requirements. OD-11 requires reviewed migrations and explicit production approval but does not define the process.
4. **Secret management — ARCHITECTURE DECISION REQUIRED:** Provider and operational owner for local, staging, and production secrets; variable mapping, access, rotation, revocation, and incident handling. Lovable is not the production infrastructure authority.
5. **Authentication behavior — UNDEFINED:** Enrollment, identity proofing, OTP/password rules, recovery, sessions, revocation, and account lifecycle. Supabase Auth as provider is approved; behavior is not specified.
6. **Authorization matrix — UNDEFINED:** Roles, actions, resources, organization/competition scope, administrative access, and policy ownership. Default-deny layered server authorization is approved as a direction.
7. **Guardian verification — UNDEFINED:** Accepted proof, verification authority, invitation/acceptance, delegation, revocation, contested relationships, and relationship-level permissions. Many-to-many linkage is approved.
8. **Consent lifecycle — UNDEFINED:** Purposes, field scope, notice/version, duration, renewal, age/status transition, withdrawal propagation, evidence, and effects on prior disclosures. Purpose-specific recorded/reviewable/revocable direction is approved.
9. **RLS/data classification — ARCHITECTURE DECISION REQUIRED:** Data classification, exposed-data inventory, table-by-table policy design, privileged access path, and negative-test ownership. No SQL, schema, or policies are specified here.
10. **Service/API contracts and data access — ARCHITECTURE DECISION REQUIRED:** Define slice-specific server-function contracts, request/response validation, transaction boundaries, domain-service responsibilities, database client/connection method, and external integration protocol/versioning/authentication. The initial TanStack Start server-function boundary within a modular monolith is approved by WS-0 B-03; these details are not selected by that decision.
11. **Domain structure — ARCHITECTURE DECISION REQUIRED:** Define exact modules, interface contracts, dependency rules, and deployment topology. Domain evolution is an approved goal; B-03 approves only the initial server boundary and does not settle these design details.
12. **Audit — UNDEFINED / ARCHITECTURE DECISION REQUIRED:** Event coverage, access roles, storage/immutability controls, retention periods, deletion/legal-hold process, and operational response. Append-oriented restricted audit direction is approved.
13. **Backup and recovery — UNDEFINED / ARCHITECTURE DECISION REQUIRED:** Backup schedule, retention, recovery objectives, restore testing, ownership, and production evidence.
14. **Storage — UNDEFINED until a use case exists:** Whether documents/media are required, storage access boundaries, validation, retention, and delivery. Supabase Storage use is conditional on a documented and approved need.
15. **Hosting and operations — ARCHITECTURE DECISION REQUIRED:** Production hosting, network/security headers, monitoring, availability targets, incident ownership, data residency, and controlled environment promotion.
16. **External services — ARCHITECTURE DECISION REQUIRED:** Payment, notification, analytics, and partner integration providers and data-sharing boundaries. Do not infer these from UI copy or dependencies.
17. **Privacy/legal interpretation — UNDEFINED:** Applicable policy language, retention/deletion/export rules, and legal requirements require qualified owner/legal review; no legal interpretation is made here.

## Scope guard

This document records approved direction and open questions only. It creates no tables, fields, SQL, RLS policies, API endpoints, auth flows, product requirements, or legal rules. It does not claim that Supabase is configured, connected, or deployed. Follow [DEVELOPMENT-WORKFLOW.md](DEVELOPMENT-WORKFLOW.md) and [AGENTS.md](../../AGENTS.md) for controlled repository workflow.
