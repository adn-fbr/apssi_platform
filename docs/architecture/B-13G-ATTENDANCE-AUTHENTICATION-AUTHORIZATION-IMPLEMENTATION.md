# B-13G — Attendance Authentication & Authorization Foundation

- **Status:** Local Supabase configuration validated and Auth JWKS endpoint reachable; real application identity and authoritative attendance data sources remain unverified/unconfigured.
- **Baseline:** B-13C, B-13D, B-13E, B-13F, and the approved Supabase architecture direction.
- **Scope:** Repository implementation only. No project provisioning, production access, schema changes, deployment, or secret handling.

## 1. Implementation Summary

TanStack Start server-only helper modules provide a request-scoped Supabase Auth provider and a separate attendance authorization boundary. Required public project configuration is present in ignored `.env.local`; no values are recorded here. The provider never creates a mock identity. The default authorization data source remains unconfigured and fails closed. Invalid or missing sessions are denied with `401`; an authenticated but unauthorized identity is denied with `403`.

No attendance server function currently exists, and the SSB training route remains the documented local-only prototype. The new policy helper is not wired to or presented as protecting that UI. Any future server function that reads or mutates protected attendance data must call the boundary with a validated server request and authoritative adapters before accessing data.

## 2. Capability Status

| Capability                                                   | Status                                                          | Evidence and limitation                                                                                                                                                                                                                                                |
| ------------------------------------------------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication adapter contract and consistent failures      | `IMPLEMENTED — CONFIG_VALID / AUTHENTICATION NOT TESTED`        | [authentication.server.ts](../../src/lib/authentication.server.ts) defaults to a Supabase provider, returns only a verified `sub`, maps missing/invalid sessions to `401`, and maps missing configuration or verification failures to `503`.                           |
| Request-scoped Supabase Auth client                          | `IMPLEMENTED — CONFIG_VALID`                                    | [supabase.server.ts](../../src/lib/supabase.server.ts) creates a fresh `@supabase/ssr` client per provider call, reads `getAll` cookies through TanStack Start, writes cookies through `setCookie`, and propagates Supabase cache headers through `setResponseHeader`. |
| Supabase Auth endpoint and session verification              | `ENDPOINT_REACHABLE / AUTHENTICATION_NOT_TESTED`                | `getClaims()` verifies JWTs; `getSession()` is not used as identity proof. The read-only JWKS endpoint returned HTTP 200. No application session flow/test session exists, so no real identity was verified.                                                           |
| Organization resolution and membership verification contract | `IMPLEMENTED — FAIL-CLOSED / AUTHORITATIVE SOURCE UNCONFIGURED` | [authorization.server.ts](../../src/lib/authorization.server.ts) resolves resource scope through the server-side data-source contract and requires active staff membership in that resolved organization. No organization or membership repository/schema exists.      |
| Coach assignment enforcement                                 | `IMPLEMENTED — FAIL-CLOSED / AUTHORITATIVE SOURCE UNCONFIGURED` | Coach operations require a current active team/session assignment matching the resolved target and organization. No assignment source exists.                                                                                                                          |
| SSB administrator permission enforcement                     | `IMPLEMENTED — FAIL-CLOSED / AUTHORITATIVE SOURCE UNCONFIGURED` | Review, correction, membership management, and assignment management each require a distinct, current, scope-matching permission grant. No generic administrator role grants these operations.                                                                         |
| Player, guardian, and platform-operator access               | `IMPLEMENTED — FAIL-CLOSED`                                     | Only active staff membership can proceed. Player/guardian relationships do not grant attendance administration; no operator bypass or break-glass path exists.                                                                                                         |
| Attendance operation integration                             | `NOT IMPLEMENTED`                                               | There are no attendance server functions or persistence operations to protect. The client route remains a local-only demonstration and is not server-authorized.                                                                                                       |
| Supabase schema, RLS/grants, and database isolation          | `BLOCKED — DEPENDENCY REQUIRED`                                 | No schema, migration, membership/assignment source, or database authorization policy exists in this checkout. The endpoint was reachable, but project ownership/environment was not independently verified. No database or production mutation was attempted.          |

## 3. Authentication and Trust Boundary

The provider contract accepts the incoming server `Request` and returns only the `sub` from Supabase `getClaims()`. The request-scoped SSR client reads and updates cookies using TanStack Start server utilities and propagates Supabase's response cache headers. Required environment configuration is validated before client creation; no credentials are substituted. Browser role values, user IDs, organization IDs, membership state, grants, user metadata, app metadata, and localStorage state are not authentication or authorization inputs. There is no fallback identity.

The helper is named `.server.ts` and follows TanStack Start's documented split between server-function wrappers and server-only helpers. Current TanStack Start documentation describes server functions as independently reachable RPC endpoints and requires authorization at the function/data boundary; route guards are not security controls. Existing `src/start.ts` retains its error and CSRF middleware. CSRF is not authentication, and no global auth middleware was added because there is no configured provider and no protected server function to attach it to.

Documentation checked on 2026-11-17:

- [Supabase changelog](https://supabase.com/changelog.md): no new breaking change affecting the selected `@supabase/ssr` cookie integration was identified. The deprecation of framework adapters in `@supabase/server` is not applicable; this implementation uses `@supabase/ssr` for cookie-based TanStack sessions.
- [Supabase TanStack quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/tanstack) and [SSR client guide](https://supabase.com/docs/guides/auth/server-side/creating-a-client): request-specific clients, `getAll`/`setAll`, TanStack `getCookies`/`setCookie`/`setResponseHeader`, and response cache-header propagation.
- [Supabase server-side Auth guide](https://supabase.com/docs/guides/auth/server-side) and [server package choice](https://supabase.com/docs/guides/auth/choosing-a-server-package): cookie sessions use `@supabase/ssr`; the package remains beta and its API may change.
- [Supabase `getClaims()` reference](https://supabase.com/docs/reference/javascript/auth-getclaims): `getClaims()` verifies JWT claims; `getSession()` alone does not establish trusted identity.
- [TanStack Start server functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions), [middleware/request context](https://tanstack.com/start/latest/docs/framework/react/guide/middleware), and [environment functions](https://tanstack.com/start/latest/docs/framework/react/guide/environment-functions): server boundary, request-scoped handling, and server-only module patterns.

Installed package APIs were checked against `@supabase/supabase-js@2.119.0`, `@supabase/ssr@0.12.7`, and the repository's TanStack Start `1.168.60`. These versions are exactly pinned in `package.json` and `package-lock.json`.

## 4. Authorization Design

The boundary performs these checks in order:

1. Require a provider-validated principal; missing provider is unavailable, missing/invalid identity is unauthenticated.
2. Resolve the requested organization/team/session reference through the trusted server-side data source. The client reference selects a resource; it does not establish its organization.
3. Require an active staff membership for the resolved organization. Pending, suspended, revoked, ended, rejected, player, and guardian relationships are denied.
4. For coach session operations, require an active, in-period assignment for the exact team or session in the same organization. Re-invoke the boundary for every write, QR confirmation, and submission.
5. For SSB administration, require an active scoped grant for the requested operation. Review, correction, membership management, and assignment management use separate permission values. Recording, QR confirmation, and submission are not granted to administrators by this policy.
6. Deny history reads until a separately approved audit/history scope exists. Deny cross-organization requests when the resolved organization has no matching verified relationship.

The data-source adapter is authoritative and server-owned. It must not be implemented using frontend role context, localStorage, mock fixtures, user metadata, or unvalidated client context. Adapter failures become safe `503` responses; missing or non-matching relationships become `403`.

## 5. Operation Coverage

The authorization API models `viewSessions`, `viewRoster`, `createDraft`, `markAttendance`, `confirmQr`, `submitAttendance`, `reviewAttendance`, `correctAttendance`, `readAttendanceHistory`, `manageMembership`, and `manageAssignments`.

These are policy checks only. They are not endpoints, persistence operations, or proof that a workflow is protected. No operation is wired because the repository has no attendance server-function boundary or authoritative data adapters. The local attendance UI continues to identify its actions as local-only.

## 6. Tests and Verification

Unit tests in [supabase-authentication.test.ts](../../src/test/supabase-authentication.test.ts) use controlled client factories and Auth responses; they cover valid verified `sub`, missing/invalid/expired session, malformed claims, each missing configuration variable, malformed and non-local HTTP URLs, permitted local HTTP URLs, provider/network failures, no fallback identity, user metadata non-escalation, and fail-closed organization/assignment lookups. The [server-authorization.test.ts](../../src/test/server-authorization.test.ts) suite continues to cover inactive membership lifecycle states, browser role/org claims, absent/mismatched/expired assignments, cross-organization access, ungranted admin operations, player/guardian/operator denial, and operation-specific grants.

## 7. B-13G-R1A Local Verification

Environment files present at repository root: `.env.local` and `.env.example`. The required variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are both present in `.env.local`; values are intentionally omitted. `.env.local` matches the `.env.*` ignore rule. `.env.example` is not ignored and contains empty placeholders only. No service-role or secret key is used.

Configuration validation now rejects malformed URLs and non-HTTPS remote URLs. HTTP is accepted only for `localhost`, `.localhost`, IPv4 loopback, and IPv6 loopback development endpoints. URL validation and missing-variable handling are unit-tested. Server client construction stays request-scoped and uses TanStack Start cookie APIs.

Smoke-test results:

- `CONFIG_VALID`
- `ENDPOINT_REACHABLE http_status=200` via a read-only GET to `/auth/v1/.well-known/jwks.json`.
- `AUTHENTICATION_NOT_TESTED reason=no-supported-session-flow`; repository search found no login, callback, or existing session flow. No identity or session was fabricated.
- `node --experimental-strip-types scripts/supabase-smoke-test.mjs --without-local-env` produced `CONFIG_MISSING` for both required variable names and `AUTHENTICATION_NOT_TESTED`, without probing the endpoint.

No sign-in, user, session, remote settings, or database operation was performed.

Final verification:

- `npm test -- src/test/supabase-authentication.test.ts src/test/server-authorization.test.ts src/test/ssb-training.test.tsx`: 50 tests passed across 3 files.
- ESLint passed on changed TypeScript and smoke-script files.
- `npm run build` passed; Vite path-plugin and Nitro emitted non-blocking warnings.
- `npx tsc --noEmit` remains blocked only by the known pre-existing `src/test/ssb-training.test.tsx:82` tuple mismatch. No R1A TypeScript diagnostics remain.

Dependency advisory review (`npm audit --json`): **9 advisories total (7 moderate, 2 high)**.

- Direct dev dependency `vite@8.1.5`: aggregated high severity with multiple Vite/launch-editor advisories. npm reports non-major remediation at `vite@8.3.8`.
- Direct dependency `zod@3.25.76`: high severity (oversized constrained collection validation can exhaust memory). npm reports `zod@4.6.7`, a major-version remediation; no non-breaking fix was reported.
- Direct dev dependency `typescript-eslint` and transitive `@typescript-eslint/eslint-plugin`, `parser`, `type-utils`, `typescript-estree`, `utils`, and nested `minimatch`: moderate severity. npm reports a fix is available within the package's current major range.
- Neither newly installed Supabase package appears in the audit vulnerability list.

No audit remediation or unrelated dependency upgrade was run.

## 8. Missing Prerequisites and Limitations

Authentication verification in unit tests uses controlled test doubles. The endpoint smoke test establishes connectivity only; it is not a real authentication test.

- A safe, supported login/session flow for a real test user; no login, callback, or session-establishment flow exists in this repository, so real identity verification was not attempted.
- An authoritative organization, membership, coach-assignment, and administrator-grant data source.
- An approved session lifetime, refresh, revocation, and cookie policy.
- A trusted identity-to-person mapping and canonical organization ownership source.
- Authoritative organization membership lifecycle, coach assignment lifecycle, and separate administrator grant data sources.
- Reviewed schema, server-owned database access path, table-specific grants/RLS, and negative cross-tenant tests.
- An authoritative session/team/roster source before attendance operations can be exposed.
- Explicit audit/history access scope before revision-history reads; no break-glass path is implemented.

## 7A. B-13G-R3 Live Verification Completion

### Git preflight

- Repository path: `D:/APSSI/PROYEK WEB/apssi_platform`
- Branch: PASS — `chore/phase-1a-governance-reconciliation`
- HEAD: PASS — `6da46b5058d38ebff302b7934ce576d149573a08`
- Full staged, unstaged tracked, and untracked inventories were captured before and after the live checks. The branch and HEAD matched the expected values at both points; no reset, checkout, stage, commit, or destructive git command was used.

### Local environment inspection

- `.env.local` was inspected without printing values or secrets.
- Only the public project config keys were present: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- No owner-approved login credential variables, e.g. email/password or `SUPABASE_AUTH_*` test-user variables, were present in the secure local mechanism used by this checkout.
- Result: `BLOCKED` for live authenticated checks because no approved account was available through an existing secure local mechanism.

### Live verification results

- Supabase Auth endpoint reachability: `PASS`
  - Evidence: `node --experimental-strip-types scripts/supabase-smoke-test.mjs` produced `CONFIG_VALID`, `ENDPOINT_REACHABLE http_status=200`, and `AUTHENTICATION_NOT_TESTED reason=no-supported-session-flow`.
- Unauthenticated protected-route denial: `PASS`
  - Evidence: `curl.exe -sS -D - -o NUL http://127.0.0.1:3100/account` returned `HTTP/1.1 307` with `location: /login`.
- Email + password login: `BLOCKED`
  - Reason: no approved test account or secure credential path was available locally.
- Server-side identity / claims validation: `BLOCKED`
  - Reason: no authenticated live session was available to validate against the configured Supabase Auth project.
- Session cookie establishment and security attributes: `BLOCKED`
  - Reason: no live login was performed, therefore no session cookie was established.
- Session refresh: `BLOCKED`
  - Reason: no live authenticated session existed to refresh.
- Logout: `BLOCKED`
  - Reason: no real user session existed to terminate.
- Protected-route denial after logout: `BLOCKED`
  - Reason: no live session existed to log out and re-check.
- Authentication/authorization separation: `NOT TESTED` in live operation
  - The server-only auth provider and policy boundary remain separate in code, but no live session or live authorization context was available to verify the end-to-end boundary under real credentials.

### Live-check conclusion

No successful login or session was fabricated. This repository did not provide an owner-approved account through a secure local mechanism, so all identity-bearing live checks remain `BLOCKED` and the safe, unauthenticated checks above remain the only live evidence available.

No Supabase dashboard settings, users, database schema, policies, production data, or deployment state were changed. No user was created, modified, or logged in by the verification process. No remote Supabase mutation was attempted.

No secret values were printed or included in the live output. `.env.local` was inspected only by key name and value masking, and it was not modified. The smoke test made a read-only GET request to the documented Supabase Auth JWKS endpoint. No Supabase dashboard settings, users, database schema, production data, or deployment were changed.

### Resume live verification results (authenticated browser flow)

- Approved credential variables: `PASS` — the local `.env.local` keys were loaded through the supported env-file mechanism and the repository used the actual names `SUPABASE_AUTH_TEST_EMAIL` and `SUPABASE_AUTH_TEST_PASSWORD` without printing the values.
- Email + password login through the app flow: `PASS`
  - Evidence: the browser session completed the form login and the app navigated to the home route without falling back to `/login`.
- Server-side identity and claims validation: `PASS`
  - Evidence: once authenticated, the protected route `/account` loaded with the page title `Akun & Peran · BolaID` and no redirect back to `/login` occurred.
- Session cookie establishment and security attributes: `PASS` (observed as server-managed, browser-hidden session state)
  - Evidence: `document.cookie` was empty in the browser while the authenticated page continued to render, which is consistent with `httpOnly` session cookies managed by the server.
- Protected-route access while authenticated: `PASS`
  - Evidence: direct navigation to `/account` remained on `/account` with status `200` and the page heading `Akun & Peran`.
- Session refresh / subsequent server-side validation: `PASS`
  - Evidence: a reload of the authenticated `/account` page kept the session alive and the page remained at `/account` with status `200`.
- Logout through the existing app flow: `PASS`
  - Evidence: the `Keluar` action returned the browser to `/login`.
- Cookie invalidation / protected-route denial after logout: `PASS`
  - Evidence: a subsequent navigation to `/account` redirected back to `/login` and the login form was visible again.
- Authentication vs. SSB organization membership / coach assignment / admin permissions: `PARTIAL` in live verification
  - Evidence: the authenticated session did not automatically confer real backend authorization; the application still presents demo role switching and prototype-only label text in the live UI. No authoritative org membership or admin grant data source was available to perform a real live authorization assertion beyond the browser login state.

### Overall R3 status

`PARTIAL — SOME LIVE CHECKS BLOCKED`.

The live authentication boundary was verified successfully through the real app flow using the approved test account. However, the repository does not currently provide an authoritative SSB membership, assignment, or administrator-grant data source for end-to-end live authorization verification beyond the logged-in session state. Therefore, live authentication is verified, but production-style authorization enforcement remains unproven in this checkout.

## B-13H — Authoritative APSI Organization Membership & Assignment Data Foundation

### Scope and objective

B-13H establishes the first canonical server-side data foundation for APSI organization identity, organization-scoped membership, explicit coach assignment, and distinct SSB administrator grants. This repository already contains an authentication boundary and a server authorization contract, but it does not yet contain an authoritative organizational data source. The work therefore defines a normalized foundation without implying any remote Supabase deployment or live database migration.

### Existing schema and repository discovery

- The repository contains no authoritative `supabase/migrations` history, no already-backed organizational membership tables, and no live server-owned organization or assignment repository.
- The current application still uses mock data in [src/lib/mock-data.ts](../../src/lib/mock-data.ts) and a fail-closed policy contract in [src/lib/authorization.server.ts](../../src/lib/authorization.server.ts).
- The B-13G implementation remains configuration-checked and server-authenticated but not backed by an authoritative organization data source.
- No remote Supabase project was modified, no remote schema was changed, and no production data was touched.

### Canonical entities

The B-13H migration defines the following six authoritative tables without duplicating an existing canonical entity:

- `apsi_organizations` — canonical organization identity.
- `apsi_organization_memberships` — organization-specific membership with explicit actor type and life cycle status.
- `apsi_teams` — team identity within an organization.
- `apsi_training_sessions` — session identity within an organization and optional team.
- `apsi_coach_assignments` — explicit staff assignment to a team or session with lifecycle validation.
- `apsi_administrative_grants` — distinct organization-scoped permissions for review, correction, membership management, and assignment management.

Player-profile and guardian-relationship tables are not part of this migration. D-13F-05 approves a durable player identity and separately verified guardian relationship, but B-13H does not implement those entities or authorize real player/guardian data access.

### Migration candidate

The migration candidate is located at [supabase/migrations/20261118_120000_b13h_authoritative_apsi_organization_data.sql](../../supabase/migrations/20261118_120000_b13h_authoritative_apsi_organization_data.sql).

This file is a local SQL candidate only. It is designed to satisfy the B-13H requirements for normalized organizations, explicit membership, exact assignment scope, distinct grants, and RLS defaults. It is not a remote deployment and was not applied to any live project.

### Server-side authoritative lookup model

The corresponding TypeScript foundation is implemented at [src/lib/apsi-organization-authority.ts](../../src/lib/apsi-organization-authority.ts). It enforces:

- organization identity is checked against the server-resolved scope, not browser-provided role state;
- only an `active` staff membership is eligible for protected staff operations;
- coach assignment must match the exact organization, team, or session scope;
- admin grants are distinct and require the appropriate permission value and matching organization scope;
- player and guardian identities remain separate from staff membership and do not imply staff privilege.

The B-13H-R2 server-only repository at [apsi-authorization-data-source.server.ts](../../src/lib/apsi-authorization-data-source.server.ts) now reads resource, membership, assignment, and grant records through the request-scoped Supabase client. [authorization.server.ts](../../src/lib/authorization.server.ts) uses this repository by default; tests may still inject controlled data sources. The repository resolves team/session relations from stored rows, restricts membership lookup to the authenticated subject's active staff membership, prefers an exact session assignment before a team assignment for the resolved team, and treats malformed, mismatched, duplicate, or failed lookups as denial/unavailable. No client role, organization, team, or session relationship is used as authority.

### Test coverage and local verification

The focused B-13H tests are in [src/test/apsi-organization-authority.test.ts](../../src/test/apsi-organization-authority.test.ts).

Verified local implementation scope:

- The server boundary in [src/lib/authorization.server.ts](../../src/lib/authorization.server.ts) remains fail-closed and throws `AuthorizationUnavailableError` when no authoritative data source is configured, rather than silently authorizing.
- The authoritative helper in [src/lib/apsi-organization-authority.ts](../../src/lib/apsi-organization-authority.ts) enforces the six approved B-13F decisions:
  - staff eligibility requires an active organization membership in the exact organization;
  - coach assignment is exact and scoped to the matching team or session;
  - admin grants require the correct permission and exact matching organization scope;
  - player and guardian identities remain distinct from staff access;
  - organization scope mismatches are rejected; and
  - no platform/operator or browser-provided role state is treated as authoritative.
- The dedicated B-13H test file validates those exact boundaries and rejects cross-organization, wrong-scope, and actor-type mismatches.

They cover:

- active membership validation and organization isolation;
- inactive/suspended/revoked membership denial;
- exact team/session assignment checks;
- distinct admin grant checks;
- identity separation for player and guardian actors;
- authoritative organization scope enforcement.

Local verification status:

- `IMPLEMENTED` — canonical data model and validation helper layer.
- `VERIFIED` — the focused B-13H helper tests confirm the exact organization, assignment, grant, and actor-separation rules in the repository.
- `VERIFIED LOCALLY IN B-13H-R2` — the migration applies to disposable PostgreSQL 15.1 and the pgTAP/RLS suite passes 39 assertions under `anon` and `authenticated` roles.
- `NOT VERIFIED` — Supabase CLI migration history, a local Supabase API/PostgREST stack, and a linked/remote project's schema state. No Supabase CLI or `supabase/config.toml` is present in this checkout.
- `NOT IMPLEMENTED` — attendance persistence, QR enforcement, player profiles, and guardian relationships. The repository adapter is read-only and no attendance operation is wired to it.

This scope is intentionally limited to local validation of the authorizer contract and rule enforcement. It does not claim production authorization readiness or a live database-backed deployment.

### Determinations and blockers

- The repository now has a migration candidate, local RLS evidence, and a server-only read repository, but no verified live Supabase database or production-backed authority source.
- The B-13H foundation remains a local schema and repository implementation; it is not a deployed database or production authorization service.
- The implementation avoids implicit platform operator access, break-glass access, and client-authoritative role assumptions.

### Final B-13H status

`PARTIAL — LOCAL MIGRATION/RLS VERIFIED; LIVE DATABASE AND ATTENDANCE INTEGRATION UNVERIFIED`

This is intentionally not reported as production-ready. B-13H-R2 closes local PostgreSQL/RLS verification and adds the database-backed read repository, but no live Supabase migration or end-to-end authorization query was performed.

## B-13H-R1C — Administrative Grant Repair and Formatting Closure

### Root cause and correction

The failing `keeps distinct administrative grants separate` test used an explicit `reviewAttendance` grant scoped to the exact organization for a session in that same organization. `grantAllowsCapability` incorrectly limited organization-scoped grants to organization-kind requests, unlike the server authorization contract, which permits an exact organization grant to cover resources in that organization. The test expectation was correct; the helper implementation was defective.

The helper now rejects a supplied resource scope from another organization and rejects an organization-kind scope whose ID differs from the requested organization. An explicit organization-scoped grant is valid for a resource in that exact organization. Team- and session-scoped grants still require the requested scope kind and ID to match exactly. Permission equality, active status, and validity-window checks remain required; no wildcard or implicit administrator permission was added.

The authority tests retain negative assertions that review cannot authorize correction, correction cannot authorize membership management, membership management cannot authorize assignment management, another organization's grant is rejected, and an incompatible team/session scope is rejected. A cross-organization resource scope and a mismatched session ID are also denied.

### Formatting

Prettier was run only on `src/lib/apsi-organization-authority.ts`, `src/test/apsi-organization-authority.test.ts`, and this report. The formatter used LF line endings, matching `.gitattributes` (`* text=auto eol=lf`). `src/lib/authorization.server.ts` and unrelated files were not reformatted.

### Independent verification

Each gate was run independently. All commands completed with exit code `0`:

- Gate A — `npx vitest run src/test/apsi-organization-authority.test.ts src/test/server-authorization.test.ts`: 2 files, 32 tests passed.
- Gate B — `npx vitest run src/test/supabase-authentication.test.ts src/test/supabase-server.test.ts src/test/login-route.test.tsx`: 3 files, 46 tests passed.
- Gate C — `npx vitest run src/test/ssb-training.test.tsx`: 1 file, 6 tests passed.
- Gate D — `npx tsc --noEmit`: passed with no diagnostics.
- Gate E — `npx eslint src/lib/apsi-organization-authority.ts src/test/apsi-organization-authority.test.ts src/lib/authorization.server.ts`: passed.
- Gate F — `npx prettier --check src/lib/apsi-organization-authority.ts src/test/apsi-organization-authority.test.ts src/lib/authorization.server.ts docs/architecture/B-13G-ATTENDANCE-AUTHENTICATION-AUTHORIZATION-IMPLEMENTATION.md`: all checked files matched Prettier.
- Gate G — `npm run build`: passed. Existing non-blocking Vite/Nitro build notices were emitted.
- Gate H — `git diff --check`: passed; Git emitted CRLF-to-LF warnings for unrelated pre-existing documentation files.

These are historical B-13H-R1C results. B-13H-R2 evidence below supersedes the statements about the missing adapter and unrun local PostgreSQL/RLS validation. This is not a production-readiness claim. No remote Supabase changes were made.

## B-13H-R2 — Database Implementation Completion & Evidence Closure

### Schema and migration review

- The existing migration remains the sole B-13H migration candidate; no duplicate migration was created.
- It creates six authority tables: organizations, teams, training sessions, organization memberships, coach assignments, and administrative grants.
- Organization-consistent composite foreign keys bind teams, sessions, assignments, and scoped grants. Check constraints validate lifecycle values, scope shape, and validity windows. Partial unique indexes prevent duplicate active membership, assignment, and grant records at the same scope.
- `anon` has no authority-table privileges. `authenticated` has `SELECT` only; it has no `INSERT`, `UPDATE`, or `DELETE` grants. RLS is enabled and forced on all six tables. The migration defines only `SELECT` policies, so no client DML policy is applicable; row mutation remains unavailable to user-facing roles.
- The migration contains no `SECURITY DEFINER` bypass and does not use `user_metadata` for authorization.
- Player-profile and guardian-relationship tables, attendance persistence, and QR operations are not part of this migration or repository adapter.

### Local database evidence

- Environment: Docker 29.9.2; disposable `supabase/postgres:15.1.0.131` container; PostgreSQL 15.1. The Supabase CLI is not installed (`supabase --help` was unavailable), and there is no `supabase/config.toml` or CLI migration history in the checkout.
- The existing migration was applied to a newly created disposable PostgreSQL instance with `psql -v ON_ERROR_STOP=1`; it completed successfully.
- PostgreSQL catalog inspection confirmed 6/6 authority tables have RLS enabled and forced, 48 constraints, 27 indexes, and six `SELECT` policies with no client DML policy.
- Effective table grants in the local Supabase image show `anon` has no authority-table privileges and `authenticated` has `SELECT` on all six tables only. The image's standard `service_role` has all table privileges and `BYPASSRLS`; the application adapter uses the request-scoped publishable-key client and user session, not a service-role credential.
- The updated [apsi_organization_authority_rls_test.sql](../../supabase/tests/apsi_organization_authority_rls_test.sql) completed `1..43` with all assertions passing. It establishes and exercises `anon`/`authenticated` roles, validates cross-organization and cross-team denials, verifies privileges across all six tables, denies resource reads from membership/assignment-management-only grants, and checks lifecycle revocation and relational constraints. The SQL test transaction rolled back. The container was stopped and removed afterward.
- No linked or remote database was used. No remote Supabase mutation was performed.

### Repository and server integration

- [apsi-authorization-data-source.server.ts](../../src/lib/apsi-authorization-data-source.server.ts) creates a request-scoped Supabase client and reads only the authority tables. The default [authorization.server.ts](../../src/lib/authorization.server.ts) path now uses this adapter; tests may still inject controlled data sources. Database failures map to `AuthorizationUnavailableError`; missing, malformed, mismatched, or ambiguous records do not authorize.
- Session scope is resolved from the stored session row, including its actual organization and team. A coach's exact session assignment is checked first; team fallback queries the session's database-resolved team within the same organization. Browser-supplied team/session relationships are not accepted.
- Adapter unit tests cover trusted team-to-session resolution, exact-session assignment, denial for another session or resolved team, organization mismatch, ambiguous assignments, organization-scoped grant compatibility, and database failure. These tests use a controlled Supabase client; they are not live PostgREST integration tests.
- No attendance server function, persistence operation, or QR enforcement is present. The application still has no live authority dataset.

### B-13H-R2 application verification

- APSI authority helper: `npx vitest run src/test/apsi-organization-authority.test.ts` — 8 passed.
- Database/repository: `npx vitest run src/test/apsi-authorization-data-source.test.ts` — 8 passed.
- Server authorization: `npx vitest run src/test/server-authorization.test.ts` — 26 passed.
- Authentication regressions: `npx vitest run src/test/supabase-authentication.test.ts src/test/supabase-server.test.ts src/test/login-route.test.tsx` — 46 passed.
- Attendance regressions: `npx vitest run src/test/ssb-training.test.tsx` — 6 passed.
- PostgreSQL/RLS: `supabase/tests/apsi_organization_authority_rls_test.sql` on disposable PostgreSQL 15.1 — 43 assertions passed.
- `npx tsc --noEmit` — passed.
- ESLint on all changed TypeScript files — passed.
- Prettier check on all changed TypeScript files — passed.
- `npm run build` — passed with non-blocking Vite/Nitro notices, including chunk-size and plugin-option warnings.
- `git diff --check` — passed; Git reported pre-existing CRLF-to-LF warnings in unrelated documentation files.
- Git postflight: repository root, branch `chore/phase-1a-governance-reconciliation`, and HEAD `6da46b5058d38ebff302b7934ce576d149573a08` match preflight. Staged and unstaged tracked path inventories match preflight path-for-path. Every baseline untracked path remains present; the only additional untracked paths are `src/lib/apsi-authorization-data-source.server.ts` and `src/test/apsi-authorization-data-source.test.ts`. No generated tracked file changed due to the build. No reset, restore, clean, stash, stage, commit, push, or remote database action was performed.

### Final B-13H-R2 status

`PARTIAL` — local migration/RLS and application checks pass, and the server boundary now has a concrete database-backed read adapter. A live Supabase project, CLI migration history, PostgREST execution under a real authenticated session, and remote schema state remain unverified. No production deployment or database mutation was performed.

## B-13H-R3 — Live Supabase Read-Only Authority Verification

### Pre-access identity gate

- R3 originally could not independently establish project identity from repository evidence or this session's available inspection methods. The owner later supplied verified read-only management-inspection evidence, reconciled below in R3A.
- The local `.env.local` URL candidate and the confirmed remote project reference are consistent. No credentials or personal data are recorded here.

### Live verification matrix

| Verification                                      | Result           | Evidence / limitation                                                                                                                                                               |
| ------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Correct remote project identity                   | `PASS`           | R3A verified project name `apssi_platform`, reference `zunuwfalheqlnhjhdmtf`, region `ap-northeast-2`, and PostgreSQL `17.11.0.019`. The reference matches the local URL candidate. |
| Remote project health/status                      | `PASS`           | R3A verified status `ACTIVE_HEALTHY`; the Supabase Health Advisor returned no findings.                                                                                             |
| Live Email + Password authentication              | `NOT TESTED`     | The remote metadata inspection did not perform login. Test credentials were not used in R3A.                                                                                        |
| Server-side identity verification                 | `NOT TESTED`     | No live authenticated session or server-side request was created.                                                                                                                   |
| Session persistence and logout                    | `NOT TESTED`     | No live application flow was started.                                                                                                                                               |
| Six authority tables exist remotely               | `NOT PRESENT`    | Read-only remote inspection returned no public tables and no application-owned relations outside standard managed schemas.                                                          |
| Remote B-13H migration history                    | `NOT PRESENT`    | Remote `list_migrations` returned no entries.                                                                                                                                       |
| Data API exposure and grants                      | `NOT VERIFIED`   | `pgrst.db_schemas` returned NULL; public `USAGE` does not establish actual Data API exposure or table grants.                                                                       |
| Remote RLS enabled and forced                     | `NOT VERIFIABLE` | The application tables are absent; remote RLS evidence cannot exist for those tables.                                                                                               |
| B-13H table grants and policies                   | `NOT VERIFIABLE` | The application tables are absent, so their grants and policies cannot be inspected remotely.                                                                                       |
| Active membership verification from live records  | `NOT VERIFIABLE` | No remote membership records or authority tables exist.                                                                                                                             |
| Coach assignment verification from live records   | `NOT VERIFIABLE` | No remote coach assignment records or authority tables exist.                                                                                                                       |
| Administrative grant separation from live records | `NOT VERIFIABLE` | No remote grant records or authority tables exist.                                                                                                                                  |
| Live cross-organization denial                    | `NOT TESTABLE`   | No remote organization resources exist to exercise a negative test.                                                                                                                 |
| No remote mutation during this verification       | `PASS`           | R3A used read-only management and catalog evidence only. No remote mutation was performed.                                                                                          |
| Security Advisor leaked-password protection       | `WARN`           | `auth_leaked_password_protection` is disabled; owner review is required.                                                                                                            |

### Evidence provenance and Git state

- The R2 unit tests and disposable PostgreSQL/RLS results recorded above are local evidence only. They do not prove the configured project's schema, Data API exposure, policies, records, or runtime authorization.
- R3 preflight repository identity matched the requested root, branch, and HEAD. The complete R3 path inventories match the full B-13H-R2 postflight inventories shown immediately before this R3 request, path-for-path; no path changed during R3 before this report update. The older R1C owner baseline is stated here as 56 staged, 12 unstaged, and 23 untracked paths, while the current R2-state inventories have one additional unstaged path and three additional untracked paths. The current request does not include those older full path lists, so exact R1C-to-R3 path comparison is `NOT VERIFIED`; counts are not treated as a substitute.
- No remote account or configuration was changed. No local or remote database mutation, migration, deployment, staging, commit, or push was performed.

## B-13H-R3A — Owner-Supplied Remote Evidence Reconciliation

### Confirmed remote state

- Project: `apssi_platform`, reference `zunuwfalheqlnhjhdmtf`, region `ap-northeast-2`, status `ACTIVE_HEALTHY`, PostgreSQL `17.11.0.019`.
- Remote `public` table discovery returned no tables. Remote migration history returned no entries.
- Inspection found no application-owned tables, views, or materialized views outside standard Supabase-managed schemas. The read-only catalog query found no application-owned relations in the excluded scope.
- `public` reports `USAGE` for `anon` and `authenticated`. The `pgrst.db_schemas` catalog setting is NULL, so actual PostgREST exposed-schema configuration remains unverified.
- The remote project has no evidence of the six B-13H application tables. This is absence evidence, not evidence that remote RLS is functioning correctly.
- The local R2 migration and 43-assertion pgTAP suite remain valid evidence about a disposable PostgreSQL implementation. They do not establish remote table, policy, grant, or record state.

### Remote security finding

- Supabase Security Advisor reports `auth_leaked_password_protection: WARN`: leaked password protection is disabled. This requires owner review and an environment/configuration decision; no configuration was changed in R3A.

### R3A evidence limitations

- Live Email + Password login and session lifecycle were not tested.
- No live membership, coach-assignment, or administrative-grant records are available to inspect.
- Cross-organization denial is not testable without organization resources and identity relationships.
- Data API exposure remains unverified despite public-schema `USAGE` privileges.
- No remote mutation occurred in R3A: this report reconciles owner-supplied read-only evidence only.

### Final B-13H-R3/R3A status

`PARTIAL` — remote project identity and health are confirmed, but the deployed B-13H application authority tables and migration history are absent. Live authentication and authorization remain untested or untestable, and Data API exposure remains unverified. No remote or local database mutation occurred during R3/R3A.

## B-13H-R3B — Live Authentication and Data API Verification

### Project identity gate

- R3B verified the repository's local Supabase URL reference as `zunuwfalheqlnhjhdmtf`, exactly matching the confirmed remote project reference.
- The test email and password variable names were present locally. Their values were not printed or exposed. No account was created or modified.

### Live authentication and session evidence

| Verification                                           | Result       | Evidence / limitation                                                                                                                                                                                                                                                                      |
| ------------------------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Configured remote project reference                    | `PASS`       | The configured reference exactly matched `zunuwfalheqlnhjhdmtf`.                                                                                                                                                                                                                           |
| Direct approved test-account sign-in                   | `PASS`       | Supabase Email + Password sign-in succeeded through the `@supabase/supabase-js` client using the approved test-account variables. The session was signed out locally after verification. This is account credential evidence, not proof of the existing application's cookie/session flow. |
| Existing APSI application login flow                   | `NOT TESTED` | The browser credential bridge could not safely receive environment-secret values, so no credential was entered or printed through the application form.                                                                                                                                    |
| Server-side identity validation through the app        | `NOT TESTED` | No live app session was established through the existing TanStack/Supabase server flow.                                                                                                                                                                                                    |
| Protected `/account` reload and session persistence    | `NOT TESTED` | This requires an existing-app authenticated session.                                                                                                                                                                                                                                       |
| Existing-app logout and post-logout `/account` denial  | `NOT TESTED` | No app session was established to log out.                                                                                                                                                                                                                                                 |
| Unauthenticated `/account` denial                      | `PASS`       | Direct browser navigation from `/account` redirected to `/login`.                                                                                                                                                                                                                          |
| Cookie `HttpOnly`, `Secure`, and `SameSite` attributes | `NOT TESTED` | No authenticated app session or response headers were available; an empty `document.cookie` was not used as evidence.                                                                                                                                                                      |

### Data API evidence

| Verification                               | Result           | Evidence / limitation                                                                                                                                               |
| ------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Anonymous Data API root request            | `NOT VERIFIED`   | `GET /rest/v1/` returned HTTP `401` for an anonymous publishable-key request.                                                                                       |
| Authenticated Data API root request        | `NOT VERIFIED`   | `GET /rest/v1/` returned HTTP `401` for the authenticated test-account session.                                                                                     |
| `public` schema exposed through PostgREST  | `NOT VERIFIED`   | The root responses and prior NULL `pgrst.db_schemas` setting are insufficient to establish exposed-schema configuration.                                            |
| Expected authority tables addressable      | `NOT PRESENT`    | Anonymous and authenticated `GET` requests for all six exact B-13H table names returned HTTP `404` with `PGRST205`, consistent with missing schema-cache relations. |
| Anonymous/authenticated behavior differs   | `NOT VERIFIED`   | The tested table resources returned the same missing-relation response class; no application-owned resource was addressable.                                        |
| Unexpected application-owned API resources | `NOT VERIFIED`   | R3B did not find any of the six expected tables and did not perform unrelated resource enumeration.                                                                 |
| Remote table grants and RLS                | `NOT VERIFIABLE` | The six tables are absent, so no remote grants or policies can be verified.                                                                                         |

### R3B authority and security limitations

- The direct test-account sign-in proves only successful Supabase Auth credentials for the confirmed project. It does not prove existing-app login, server-side identity claims, organization membership, coach assignment, administrative grants, RLS, or cross-organization denial.
- Live membership lifecycle, coach assignment, grant separation, and cross-organization isolation remain `NOT VERIFIABLE` or `NOT TESTABLE` because the authority tables and organization resources are absent.
- Security Advisor finding `auth_leaked_password_protection: WARN` remains a separate owner-review item. No setting was changed.
- R3B used only read-only GET/Data API probes and authentication-session operations; no account, data, migration, schema, grant, policy, configuration, deployment, or application state was mutated.

### Final B-13H-R3B status

`PARTIAL` — project identity is confirmed, direct test-account Supabase sign-in and unauthenticated `/account` denial were evidenced, and all six expected authority table probes returned missing-relation `404/PGRST205`. Existing-app login/session/logout, server-side identity validation, Data API exposed-schema configuration, remote authority records, RLS, and cross-organization authorization remain unverified or untestable.

## B-13H-R4 — Controlled Remote Authority Schema Deployment & Verification

### Deployment decision

`BLOCKED` — no remote migration deployment occurred.

- Repository and target: `D:/APSSI/PROYEK WEB/apssi_platform`; Supabase project `apssi_platform`, reference `zunuwfalheqlnhjhdmtf`, region `ap-northeast-2`.
- Project-reference gate: PASS. The configured repository URL resolved exactly to `zunuwfalheqlnhjhdmtf`; no credential or secret value was printed.
- Migration: `supabase/migrations/20261118_120000_b13h_authoritative_apsi_organization_data.sql`, version `20261118_120000`.
- Migration identity: 15,917 bytes; SHA-256 `B3A4E704D19B9329D441259842F0F40430C7C2BCC1C95E4639992070BEDE26C6`.
- Remote deployment result: NOT PERFORMED. The current environment has no Supabase CLI, no scoped access token, no database password, no project-linking credential, no Supabase config, and no available Supabase migration-management MCP tool.

### Migration content review

- The migration creates six tables: `apsi_organizations`, `apsi_teams`, `apsi_training_sessions`, `apsi_organization_memberships`, `apsi_coach_assignments`, and `apsi_administrative_grants`.
- It creates primary, unique, check, foreign-key, partial unique, and lookup indexes; no DML seed/insert statements are present.
- It enables and forces RLS on all six tables and defines only `SELECT` policies. It revokes all authority-table privileges from `PUBLIC` and `anon`, then grants only `SELECT` to `authenticated`.
- Management permissions remain separate: team and session RLS visibility grants attendance review/correction only, not membership-management or assignment-management capabilities.
- Scope predicates resolve exact organization/team/session relationships and active, in-period, verified memberships, assignments, and grants. No `user_metadata` authorization or `SECURITY DEFINER` bypass is present.
- No function, trigger, view, extension, destructive operation, seed data, Auth user operation, API-setting change, or unrelated schema change was found in the candidate.

### Remote pre-deployment state

- The previously verified remote state reported no application-owned public tables, no remote migration entries, and active healthy project metadata. R4 did not execute a remote state query because no authenticated deployment or read-only management path was available in the workspace.
- Migration-history verification, exact version application status, target-object conflict checks, and current remote schema checks remain NOT VERIFIED.
- No remote SQL or migration command was run. No remote account, table, record, Auth setting, grant, policy, Data API setting, deployment, or project configuration was changed.

### Deployment tooling and documentation review

- Current Supabase changelog review found a relevant migration-context change: CLI v3 is hosted-aware and confirms hosted changes. The repository has no current CLI installed, so no supported command could be authenticated or executed.
- Current migration guidance requires an authenticated CLI/project connection and compares local migrations against `supabase_migrations.schema_migrations` before deploying only pending migrations.
- Current RLS guidance confirms grants and policies are separate and requires RLS on exposed tables. The migration's scope-only `SELECT` policies and explicit grants match the validated local design.
- The previously checked RLS and Data API guidance does not provide a deployment credential or bypass the missing local deployment authentication.

### Post-deployment and verification gates

- Remote migration application: NOT PERFORMED.
- Remote migration history: NOT VERIFIED.
- Remote table/object inventory: NOT VERIFIED in R4; the prior R3A evidence remains NOT PRESENT for the remote authority tables.
- Remote RLS, grants, policies, Data API exposure, Security Advisor, and data-integrity verification: NOT VERIFIED because deployment did not occur.
- The existing `auth_leaked_password_protection: WARN` finding remains an owner-review security item. R4 did not change Auth configuration.
- No test account, organization, membership, team, session, assignment, grant, or application record was created or modified.

### Git safety and postflight

- R4 preflight root, branch, and HEAD matched: `D:/APSSI/PROYEK WEB/apssi_platform`, `chore/phase-1a-governance-reconciliation`, `6da46b5058d38ebff302b7934ce576d149573a08`.
- Complete staged, unstaged tracked, and untracked inventories were captured before this report update and preserved unchanged.
- R4 updated only this architecture report. No Git staging, commit, push, reset, restore, clean, stash, or checkout occurred.

### Required blocker

Separate owner action is required to provide an approved authenticated deployment path for the exact project, such as an authenticated Supabase CLI session, scoped management credential, or an available approved migration-management MCP method. This task must not proceed until that path is independently verified and the exact migration version is confirmed absent remotely.

## B-13H-R4A — Migration Security Correction & Local Revalidation

### Approved correction scope

R4A corrected two defects in [20261118_120000_b13h_authoritative_apsi_organization_data.sql](../../supabase/migrations/20261118_120000_b13h_authoritative_apsi_organization_data.sql):

1. `teams_select_with_explicit_authority` and `sessions_select_with_explicit_authority` now independently require the parent organization to have `status = 'active'` before an otherwise valid membership/assignment/grant can read the resource.
2. `sessions_select_with_explicit_authority` now permits an active attendance-review or attendance-correction grant scoped to the session's exact team. Organization-scoped and exact-session grants retain their existing behavior.

No TTL or freshness threshold was introduced for `last_verified_at`. The existing rule remains `last_verified_at IS NOT NULL AND last_verified_at <= now()`; an owner decision about a maximum verification age remains unresolved.

### RLS regression coverage

[apsi_organization_authority_rls_test.sql](../../supabase/tests/apsi_organization_authority_rls_test.sql) was expanded with controlled disposable-database fixtures for:

- active, archived, and deleted organizations;
- exact team and session assignments;
- team-scoped review grants covering matching sessions;
- wrong-team, wrong-organization, expired, suspended, revoked, unverified, future-verified, and future-dated grants;
- expired, suspended, revoked, unverified, and future-dated assignments;
- membership-management and assignment-management grants remaining unable to read teams or sessions;
- active membership without an assignment or grant remaining insufficient.

No seed data was added to the migration. No remote Auth users or application records were created or modified.

### Disposable PostgreSQL validation

- Docker 29.9.2; disposable `supabase/postgres:15.1.0.131`; PostgreSQL 15.1.
- The complete corrected migration applied successfully to a fresh container with `psql -v ON_ERROR_STOP=1`.
- The complete pgTAP suite passed `1..62`: 62 assertions passed with no failures.
- Catalog verification found 6/6 authority tables, RLS enabled and forced on all six, 48 constraints, 27 authority indexes, and six `SELECT` policies.
- `authenticated` retained `SELECT` on all six tables; `anon` retained no authority-table privileges. Service-role privileges were not used as application authority evidence.
- The no-write result was preserved: no authority-table `INSERT`, `UPDATE`, or `DELETE` grant was added for `authenticated`.

### Application quality gates

- `npm test`: 9 test files passed, 100 tests passed.
- `npx tsc --noEmit`: passed.
- `npx eslint .`: passed after formatting only the relevant existing APSI authority test file.
- Scoped Prettier check for R4A-relevant TypeScript and report files: passed.
- Full `npx prettier --check .`: remains a repository-wide pre-existing formatting limitation across 38 documentation/application files; it was not repaired broadly.
- `npm run build`: passed with existing Vite/Nitro chunk-size and plugin-option notices.
- `git diff --check`: passed with only existing CRLF-to-LF warnings on unrelated documentation files.

### R4A status

`PARTIAL` — both approved RLS defects are corrected and covered by effective pgTAP behavior tests. The complete migration and 62-assertion local RLS suite pass on disposable PostgreSQL, and the relevant application gates pass. Repository-wide `npx prettier --check .` remains blocked by 38 pre-existing formatting targets, so R4A is not reported as fully closed despite the corrected scope passing. Remote deployment remains prohibited and was not attempted.

## B-13H-R4A-R2 — Missing Team-Scoped Grant RLS Tests

- Migration SQL remained unchanged; R4A-R2 modified only the pgTAP RLS test fixture and this architecture report.
- Added assertion `team-scoped correctAttendance grant allows a matching team session` with an active staff membership and an active, verified, current `correctAttendance` grant scoped to team A2. The role successfully read session A2, proving effective team-scope and capability behavior.
- Added assertion `team-scoped grant from organization A does not read organization B session` with an active, verified `reviewAttendance` team grant in Organization A and a direct query for Organization B's session. The result was empty, proving cross-organization denial without an alternate authority path.
- Disposable validation used `supabase/postgres:15.1.0.131` on PostgreSQL 15.1. The complete corrected migration applied successfully and the full pgTAP suite passed `1..64`: 64 assertions passed, including assertions 46 and 47 for the two additions.
- Existing RLS fixtures and assertions remained in place. R4A-R2 did not add migration objects, seed data, write grants/policies, service-role exposure, or remote Supabase activity.
