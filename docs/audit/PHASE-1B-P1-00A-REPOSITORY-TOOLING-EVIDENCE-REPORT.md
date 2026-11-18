# P1-00A Repository and Tooling Evidence Report

**Assessment date:** 2026-11-15  
**Repository:** `apssi_platform`  
**Work package:** P1-00A — Repository & Tooling Evidence Review  
**Scope:** Read-only inspection of repository evidence and public official Supabase documentation. No implementation, CLI execution, project connection, database access, or migration operation was performed.

## 1. Executive Summary

P1-00A evidence review is complete within its authorized read-only scope. OD-11 settles migration source ownership: schema and migration source belong in the repository and are governed through Git. The repository currently contains no Supabase project configuration or migration directory, no Supabase SDK or CLI dependency declaration, and no GitHub Actions workflow. Repository documentation describes an intended reviewed migration workflow, but operational validation, CI/CD, release/rollback, environment, secret, and production approval procedures are not evidenced as implemented.

Official Supabase documentation describes the CLI as a local-development and project-management tool, documents timestamped migration files and local testing, and describes applying migrations to remote projects. The inspected official pages did not identify a current supported CLI release version for this repository. No version is inferred here.

This report authorizes no implementation. The explicit owner authorization for this P1-00A evidence review does not authorize CLI installation, project linking, SQL, migration creation/application, production activity, or Phase 1B feature work.

## 2. Authorization and Scope

**Authorized:** read-only inspection of local Git metadata, repository documentation/configuration and tracked path names, plus public official Supabase documentation; creation of this report only.

**Not performed:** no application tests/builds, no CLI command, installation, initialization or connection; no database or production access; no credentials or environment files were read; no SQL, migrations, package, configuration, or source changes were made.

## 3. Git and Repository Baseline

Preflight snapshot:

| Item | Result | Evidence |
| --- | --- | --- |
| Branch | `chore/phase-1a-governance-reconciliation` | `git branch --show-current` |
| HEAD | `6da46b5058d38ebff302b7934ce576d149573a08` | `git rev-parse HEAD` |
| Latest commit | `6da46b5 docs(governance): finalize Phase 1A governance baseline` | `git log -1 --oneline` |
| Staged / unstaged tracked paths | 0 / 0 | `git status --short`, `git diff --name-status`, `git diff --cached --name-status` |
| Untracked before this report | 4 | Two Phase 1A reconciliation reports, `PHASE-1B-ENTRY-GATE.md`, and `PHASE-1B-OWNER-DECISION-REGISTER.md` |

The working tree was clean for tracked files at preflight. The only postflight change expected from this authorized task is this report; the four existing untracked reports remain outside the Phase 1A commit. GitHub remains the canonical source of truth under OD-11; no remote state was queried.

## 4. Repository Migration Ownership

**VERIFIED — approved governance decision:** OD-11, dated 2026-11-15, settles migration source ownership. Database schema and migration source files are maintained in this repository and managed through the VS Code/GitHub workflow. OD-11 is not reopened by this review. Production database changes still require explicit owner authorization ([Owner Decision Record, OD-04 follow-up and OD-11](PHASE-0-OWNER-DECISION-RECORD.md)).

**DOCUMENTED — intended workflow:** [AGENTS.md](../../AGENTS.md) and [DEVELOPMENT-WORKFLOW.md](../architecture/DEVELOPMENT-WORKFLOW.md) require reviewed, repository-managed migrations and backward-compatibility/security review. The workflow explicitly requires authorization before project linking, SQL, or migration application.

**NOT PRESENT IN INSPECTED REPOSITORY:** No `supabase/` or `drizzle/` directory, tracked migration path, or Supabase project configuration was found using tracked-path inspection and directory presence checks. This describes the checkout only; it does not establish whether an external Supabase project exists.

**Distinction:** Ownership is settled; migration implementation and operating evidence are not. No migration creation, validation run, application, or deployment is evidenced by this P1-00A review.

## 5. Package Manager and Tooling Inventory

| Evidence | Status | Observation |
| --- | --- | --- |
| Package manager | VERIFIED | `package.json` declares `packageManager: npm@11.19.1` (OD-01 approves npm as the official package manager). |
| Lockfiles | VERIFIED | `package-lock.json` and `bun.lock` are tracked. OD-01 names npm and `package-lock.json` as canonical; the tracked Bun lockfile remains an artifact requiring separately authorized inspection/cleanup decision, not a second approved package-manager workflow. |
| Bun configuration | NOT PRESENT IN INSPECTED REPOSITORY | No root `bunfig.toml` is tracked or present in the inspected root listing. Older audit references are historical. |
| Scripts | VERIFIED | `package.json` defines `dev`, `build`, `build:dev`, `preview`, `lint`, `format`, `test`, and `test:watch`; no `typecheck` script is declared. `format` uses `prettier --write .` and was not run. |
| Tests/config | VERIFIED | `vitest.config.ts` targets `src/**/*.{test,spec}.{ts,tsx}` with jsdom; two test files exist (`app-routing.test.tsx`, `roles.test.ts`). No tests were run in this work package. |
| Supabase dependency | NOT PRESENT IN INSPECTED REPOSITORY | `package.json` contains no Supabase SDK/CLI dependency declaration. This does not establish whether a machine-level executable exists. |
| Supabase CLI version | UNKNOWN | No CLI version is pinned in the manifest or repository configuration; the CLI was not executed or queried. |
| GitHub Actions | NOT PRESENT IN INSPECTED REPOSITORY | No `.github/workflows/` directory or tracked workflow file was found. Repository evidence does not establish external CI configuration. |

`.gitignore` ignores `.dev.vars`. No tracked environment template was found by path-name inspection; no `.env` or other environment-file contents were opened. No environment ownership/mapping is established by this evidence review.

## 6. Supabase CLI Public Documentation Verification

Official pages were fetched on **2026-11-15**. The pages provide workflow guidance, not an owner-approved project configuration or a pinned CLI version.

| Official page title | URL | Relevant guidance observed | Version evidence |
| --- | --- | --- | --- |
| Local Development & CLI | https://supabase.com/docs/guides/cli | Describes CLI use for local development and project workflows; installation through package managers; local stack requires a container runtime; recommends limiting local stack exposure to localhost on untrusted networks. | No current supported release version stated on this page. |
| Supabase CLI | https://supabase.com/docs/reference/cli/introduction | Reference describes `supabase init` creating local `supabase/config.toml`, migration commands, `db diff`, `db push`, migration history, and local/remote targets. It includes compatibility notes for v3/v4 command flags, not a repository-specific supported CLI release. | No current supported release version established for this repository. |
| Deploy database migrations | https://supabase.com/docs/guides/deployment/database-migrations | Describes migration files as version-controlled schema changes, local testing, team Git workflow, applying migrations remotely, and avoiding direct remote schema changes that bypass migration history. It also discusses coordinating remote pushes. | No current supported release version stated on this page. |

These pages support documenting possible workflows only. They do not prove that the repository’s CLI is installed, that an account/project is configured, or that a migration process is operational. No version is inferred from documentation compatibility notes.

## 7. Migration Workflow Evidence Matrix

| Workflow element | Classification | Evidence and consequence |
| --- | --- | --- |
| Source ownership and repository review | `DOCUMENTED` | OD-11, [AGENTS.md](../../AGENTS.md), and [Development Workflow](../architecture/DEVELOPMENT-WORKFLOW.md) establish repository-managed migration source and review. This is governance documentation, not migration implementation. |
| Local migration authoring | `DOCUMENTED` / `NOT PRESENT IN INSPECTED REPOSITORY` | Repository workflow permits reviewed migrations; official CLI docs describe `supabase/migrations` and timestamped names. No migration directory or files are present in this checkout. |
| Naming and ordering | `DOCUMENTED` | Official CLI reference documents `<timestamp>_<name>.sql` naming and timestamp-based migration history. No project-specific convention beyond official guidance is approved in repository evidence. |
| Validation and review | `DOCUMENTED` / `OWNER DECISION REQUIRED` | Governance requires compatibility, data-safety, and security review. Operational validation commands, responsibility assignments, and acceptance gates are not finalized. |
| CI checks | `NOT PRESENT IN INSPECTED REPOSITORY` / `OWNER DECISION REQUIRED` | No tracked GitHub Actions workflow or migration-related CI check is present. Required checks and ownership are not established in the checkout. |
| Deployment approval | `DOCUMENTED` / `OWNER DECISION REQUIRED` | Production database changes require explicit owner authorization; exact approvers, release gate, and non-production promotion process remain unresolved. |
| Rollback / forward-fix | `DOCUMENTED` / `OWNER DECISION REQUIRED` | Architecture decisions identify rollback/forward-fix as unresolved. No repository procedure or acceptance evidence was found. |
| Environment separation | `PROPOSED` / `OWNER DECISION REQUIRED` | Architecture decisions propose isolated environments; actual project topology and ownership are unknown. |

## 8. CI and Release Readiness

**VERIFIED:** package scripts exist for build, lint, and test; no typecheck script exists. The repository has no `.github/workflows/` path and no migration-related automated check in tracked files inspected.

**Historical only:** Phase 0 documents report three tests passing, build passing with warnings, direct TypeScript checking passing, and lint failing with 97 errors/13 warnings. These results were not rerun here and are not represented as current validation.

**Gaps:** no repository evidence establishes CI enforcement, required reviewers, migration test gates, environment promotion, release/rollback approval, or production deployment controls. Branch protection and external CI status are not verified. These gaps block release readiness, but not owner planning or this read-only evidence review.

## 9. Environment and Security Boundaries

- **VERIFIED from repository policy:** do not commit secrets; do not expose `service_role` or other privileged credentials to browser code; preserve server-side authorization and RLS requirements; require explicit production authorization.
- **NOT PRESENT IN INSPECTED REPOSITORY:** no tracked environment template, Supabase config, migration directory, or Supabase dependency was found. `.dev.vars` is ignored. No environment file was opened.
- **UNKNOWN:** project identity, regions, environment topology, access owners, secret provider/rotation, hosted configuration, and external CI/branch-protection state. No external service or credential store was accessed.
- **Security boundary:** fixture provenance remains unverified. Keep real youth-player data disconnected until provenance and trusted controls are independently verified, as stated in the [Security Gap Analysis](PHASE-0-SECURITY-GAP-ANALYSIS.md) and [Entry Gate](PHASE-1B-ENTRY-GATE.md).

## 10. Findings and Dependencies

| ID | Status | Evidence / observation | Consequence | Recommended next step | Blocks |
| --- | --- | --- | --- | --- | --- |
| P1-00A-F01 | `VERIFIED` | OD-11 settles repository migration source ownership; current governance documents align. | No ownership conflict remains to resolve. | Preserve OD-11 as authoritative; do not reopen it. | None for repository-only planning. |
| P1-00A-F02 | `NOT PRESENT IN INSPECTED REPOSITORY` | No tracked/local Supabase config or migration tree exists. | No local migration implementation or project topology can be verified. | Keep project/environment inventory read-only and non-secret until separately authorized. | Project-specific setup and migration implementation. |
| P1-00A-F03 | `VERIFIED` | `package.json` declares npm 11.19.1; both npm and Bun lockfiles are tracked; no Supabase dependency/CLI pin is declared. | npm is the approved workflow, but the additional Bun lockfile leaves an artifact cleanup question; CLI version remains unpinned. | Owner-authorize any Bun artifact cleanup separately; make a separate tooling/version decision before CLI use. | Package-file cleanup and CLI use; not this report. |
| P1-00A-F04 | `NOT PRESENT IN INSPECTED REPOSITORY` | No `.github/workflows/` directory or migration CI configuration was found. | Automated migration validation and required-check enforcement are not evidenced. | Decide required checks and CI/release responsibility before a migration deployment workflow is used. | CI-enforced validation and release readiness. |
| P1-00A-F05 | `OWNER DECISION REQUIRED` | Supabase project/environment topology, CLI/version policy, migration validation/release/rollback, secret ownership, and production approval details remain unresolved in the architecture register. | A documented ownership direction alone does not provide operational controls. | Resolve only the decisions needed for a selected, explicitly authorized work package. | Environment-dependent work, migration deployment, production readiness. |
| P1-00A-F06 | `UNKNOWN` | Machine-level CLI installation, external project state, hosted secret configuration, and external CI/branch-protection status were not verified. | Repository inspection cannot establish external or host state. | Verify only through a separately authorized, non-secret, read-only method when needed. | External configuration-dependent work. |
| P1-00A-F07 | `VERIFIED` | The entry gate records unauthenticated/server authorization, RLS/data controls, and fixture provenance as unresolved or absent. | Real youth-player data and authenticated pilots remain unsafe/unapproved. | Require approved policy plus independent implementation and negative-test evidence before connection. | Authenticated pilot and real-data use. |

## 11. Unknowns and Owner Decisions

- Supabase project identity, region, environment topology, and operational owners are not established.
- Supabase CLI supported version/install policy is not pinned in repository evidence; official documentation reviewed here does not supply a repository-specific version.
- Migration validation, CI/CD integration, review/approval gates, release/rollback, and production authorization need operational decisions. Migration source ownership is already settled by OD-11.
- Secret provider, access/rotation responsibilities, and environment mapping remain unresolved.
- API/server boundary, authentication/session behavior, permission matrix, guardian verification, consent lifecycle, RLS policy scope, audit/retention, backup/recovery, hosting, and external service decisions remain open as documented in [Supabase Architecture Decisions](../architecture/SUPABASE-ARCHITECTURE-DECISIONS.md) and [BRB-001](../product/BLUEPRINT-REQUIREMENT-BASELINE.md).
- Fixture provenance remains unknown. No legal/privacy interpretation is made.

## 12. Recommended Next Steps

1. Owner selects a bounded first work package and explicitly approves its scope, exclusions, access method, deliverables, and acceptance criteria. P1-00A’s read-only review does not authorize a follow-on task.
2. If the owner selects **P1-00A — Repository & Tooling Evidence Review**, perform only its separately approved non-secret/read-only repository and public-documentation inventory. P1-00A does not authorize follow-on work; any work beyond it requires separate owner authorization. Do not install CLI, link a project, read credentials, run SQL, or apply migrations.
3. Before any database work, approve the required project/environment topology, CLI policy, migration validation and deployment gates, secret ownership, and rollback process. OD-11 migration source ownership remains settled.
4. Before authenticated pilot or real-data work, separately approve the necessary product/security policies and implement/test trusted authentication, authorization, RLS/data scope, guardian/consent controls, audit, and synthetic-data provenance.
5. Define current quality gates and obtain current evidence for the selected scope; do not rely on historical Phase 0 pass results as current.

## 13. Explicitly Prohibited / Not Performed Activities

- No Supabase CLI was installed, initialized, or executed.
- No Supabase project was discovered, linked, authenticated, or connected.
- No credentials, secrets, environment-file contents, or private data were accessed or reproduced.
- No database command, SQL, migration creation/application, application test/build, or deployment was run.
- No application, package, configuration, migration, or environment file was modified.
- No commit, push, branch creation/switch, or Git configuration change occurred.
- The only repository write authorized and performed was creation of this P1-00A report; it was not staged.

## 14. Evidence Sources and Verification Date

**Verification date:** 2026-11-15. Repository evidence was inspected at branch `chore/phase-1a-governance-reconciliation`, HEAD `6da46b5058d38ebff302b7934ce576d149573a08`.

### Repository sources

- [AGENTS.md](../../AGENTS.md)
- [BRB-001](../product/BLUEPRINT-REQUIREMENT-BASELINE.md)
- [Phase 0 Owner Decision Record](PHASE-0-OWNER-DECISION-RECORD.md)
- [Development Workflow](../architecture/DEVELOPMENT-WORKFLOW.md)
- [Supabase Architecture Decisions](../architecture/SUPABASE-ARCHITECTURE-DECISIONS.md)
- [Proposed Phase 1 Backlog](../architecture/PROPOSED-PHASE-1-BACKLOG.md)
- [Phase 1B Entry Gate](PHASE-1B-ENTRY-GATE.md)
- [Phase 1B Owner Decision Register](PHASE-1B-OWNER-DECISION-REGISTER.md)
- [Phase 0 Repository Inventory](PHASE-0-REPOSITORY-INVENTORY.md)
- [Phase 0 Implementation Readiness](PHASE-0-IMPLEMENTATION-READINESS.md)
- [Phase 0 Remediation Backlog](PHASE-0-REMEDIATION-BACKLOG.md)
- [Phase 0 Architecture Assessment](PHASE-0-ARCHITECTURE-ASSESSMENT.md)
- [Phase 0 Route Functional Audit](PHASE-0-ROUTE-FUNCTIONAL-AUDIT.md)
- [Phase 0 Security Gap Analysis](PHASE-0-SECURITY-GAP-ANALYSIS.md)
- [Phase 0 Technical Debt](PHASE-0-TECHNICAL-DEBT.md)
- `package.json`, `package-lock.json`, `bun.lock`, `vitest.config.ts`, `.gitignore`, and tracked-path listings; no environment-file contents were read.

### Official public Supabase documentation

- [Local Development & CLI](https://supabase.com/docs/guides/cli), accessed 2026-11-15. Describes CLI installation/use and local development; it does not state a supported current CLI release version for this repository.
- [Supabase CLI reference](https://supabase.com/docs/reference/cli/introduction), accessed 2026-11-15. Documents `supabase init`, migration commands and path conventions. Version-specific compatibility notes do not select the installed/supported release for this repository.
- [Deploy database migrations](https://supabase.com/docs/guides/deployment/database-migrations), accessed 2026-11-15. Describes creating/testing versioned migrations, committing through Git, and applying to a remote project; it does not establish this repository’s CI or approval configuration.
