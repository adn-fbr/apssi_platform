# Proposed Phase 1 Backlog — Platform Foundation

**Status:** PROPOSED — requires owner approval after Phase 0 exit.  
**Source:** Blueprint v0.1 only. Undefined business rules remain open.

| Epic | Feature | Vertical slice / outcome | Dependencies | Initial acceptance direction |
|---|---|---|---|---|
| P1-E01 Identity Foundation | User and Person separation | Create account principal and linked Person record | Auth provider decision | One Person can hold multiple role assignments without duplicate person records. |
| P1-E01 | Role assignments | Assign multiple roles to one Person | Person model | Role assignments are persisted and are not inferred from localStorage. |
| P1-E02 Football Identity | Football ID issuance | Issue stable unique Football ID for a Player | Person, Player model; issuance policy decision | ID is unique, stable, and not scoped to an SSB. |
| P1-E02 | Player profile | Create and retrieve player football profile | Football ID | Profile has explicit field classification and access policy. |
| P1-E03 Guardian & Consent | Guardian relationship | Link guardian to one or more youth players | Person, Player; verification policy decision | Guardian access requires verified relationship and server-side authorization. |
| P1-E03 | Consent lifecycle | Record purpose-specific consent and revocation | Guardian relationship; consent policy decision | Consent is auditable, revocable, and enforced before disclosure. |
| P1-E04 Organization Foundation | Organization registry | Create organization with supported organization type | Person, auth | Organization has stable ID, type, and status. |
| P1-E04 | Organization membership | Add people to organization with role and validity period | Organization, role assignments | Membership is scoped and auditable; one Person may belong to multiple organizations. |
| P1-E05 Player Affiliation | Player-organization relationship | Register player with organization and preserve history | Player, Organization, Guardian consent where required | Leaving an organization closes relationship; historical affiliation remains queryable. |
| P1-E06 Authorization | RBAC/ABAC policy baseline | Enforce access on server/data layer | Identity, organization, guardian/consent | Negative tests prove parent, coach, SSB, scout, and association cannot cross scopes. |
| P1-E07 Platform Quality | API/error/observability baseline | Standard response, validation, audit and error handling | Backend/runtime decision | All endpoints validate input and produce traceable errors without leaking sensitive data. |

## Explicitly deferred

- Advanced scouting search and player marketplace.
- AI and national intelligence dashboards.
- Full finance/payment provider integration.
- Advanced development scoring methodology.
- Federation integrations.

These are deferred as implementation sequencing recommendations, not removed from the long-term Blueprint.
