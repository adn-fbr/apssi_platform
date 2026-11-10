# Phase 0 — Architecture Assessment

## 1. Current architecture (observed)

The application is a React + TypeScript + TanStack Start web application with file-based routing. It has a responsive app shell, a local role context, static mock data, shared UI primitives, a QueryClient, and basic server/SSR middleware.

The repository is currently best classified as a **frontend prototype with a server-capable framework scaffold**, not as a complete full-stack football platform.

## 2. Target architecture direction from Blueprint

The Blueprint calls for an API-first platform, relational system of record, PostgreSQL, authentication, role-based access, storage, and a modular early architecture rather than immediate microservices.

Proposed direction for owner review:

- Keep the existing React/TanStack UI unless audit evidence justifies a change.
- Use a modular monolith for the first backend implementation.
- Use PostgreSQL as the authoritative relational store.
- Define explicit modules around Identity, Guardians/Consent, Organizations, Memberships, Teams, Training, Competition, Match, Finance, and Development.
- Expose versioned REST APIs for client and future partner integrations.
- Use object storage for documents/media; do not store private documents as public static assets.
- Introduce cache/Redis only when a measurable use case requires it; the Blueprint lists Redis as an architectural possibility, not a mandatory MVP requirement.
- Enforce authorization on the server and at the data-access boundary. UI hiding is not security.
- Keep audit records for security-sensitive and lifecycle-changing actions.

## 3. Critical domain model constraints

The data model must preserve the following invariants:

1. `Person` is distinct from login `User` and can hold multiple role assignments.
2. `Player` is a football identity/profile associated with a `Person`; it is not owned by an SSB.
3. `FootballId` must be globally unique and stable, but issuance/merge/correction rules are still undefined.
4. Player-to-organization affiliation is a time-bounded relationship with status and history; moving organizations must not erase past affiliations.
5. Guardian-to-player relationship is explicit and verifiable; a guardian can relate to more than one child.
6. Organization membership is distinct from player registration/roster membership.
7. Team membership and competition roster membership have their own effective periods and eligibility rules.
8. Consent is purpose-specific, attributable to an authorized guardian where required, revocable, auditable, and checked at the server before disclosure.
9. Match events and results require an authoritative lifecycle and correction policy; UI event entry is not itself an official result.
10. Development assessments need assessor, period, criteria/template version, evidence/notes policy, and access scope. Exact scoring methodology remains undefined.

## 4. Proposed module boundaries

| Module | Owns | Depends on |
|---|---|---|
| Identity | User, Person, RoleAssignment, FootballId | Auth provider |
| Guardian & Consent | GuardianRelationship, Verification, Consent, SharingGrant | Identity, audit |
| Organization | Organization, OrganizationMembership, OrganizationType | Identity |
| Player & Team | PlayerProfile, PlayerOrganizationAffiliation, Team, TeamMembership | Identity, Organization |
| Training | TrainingSession, Attendance | Player & Team, Organization |
| Competition | Competition, Category, Registration, Roster, Draw, Fixture | Organization, Player & Team |
| Match | Match, Officials, MatchEvent, Result, Report | Competition, Team, Identity |
| Finance | Invoice, Payment, PaymentAllocation, Refund | Organization, Competition; provider integration |
| Development | AssessmentTemplate, Assessment, DevelopmentPeriod | Player, Coach identity |
| Notifications | Notification, DeliveryAttempt | Identity and domain events |
| Audit | AuditEvent, Actor, Target, Action, Timestamp | All protected modules |

## 5. Architecture decisions still required

- Authentication and identity provider, OTP delivery, OAuth, account recovery.
- Backend runtime and API implementation strategy within TanStack Start or separate service.
- Database hosting/provider, migration tool, backup and recovery.
- Whether a managed platform (e.g. Supabase) satisfies required control and governance.
- Object storage provider and signed URL policy.
- API versioning and partner integration authentication.
- Event/notification delivery architecture.
- Payment gateway and financial ledger design.
- Deployment environments and CI/CD.

No vendor choice is made by this audit.
