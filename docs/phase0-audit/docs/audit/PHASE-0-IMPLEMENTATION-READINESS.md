# Phase 0 — Implementation Readiness & Gate

## 1. Current status

**PHASE 0: PARTIAL**

Reason: static repository and Blueprint baseline audit are documented, but runtime verification, Git inspection, and owner decisions needed for implementation are incomplete.

## 2. Gate checklist

| Gate | Status | Evidence / reason |
|---|---|---|
| Blueprint accepted as sole initial requirement baseline | PASS | Explicit owner decision dated 2026-11-11 |
| Requirement gaps explicitly recorded | PASS | `BLUEPRINT-REQUIREMENT-BASELINE.md` |
| Repository structure inventoried | PASS | Static inspection of supplied ZIP |
| Existing routes inventoried | PASS | Route files enumerated |
| Mock data and prototype state identified | PASS | Imports/state/toast behavior inspected |
| Current architecture assessed | PASS | Static source review |
| Security gaps identified | PASS | Static source review; no penetration testing claimed |
| Git branch/history/remote inspected | BLOCKED | ZIP contains no `.git` directory |
| Dependency installation reproducible | UNKNOWN | `node_modules` absent; package manager conflict exists |
| Build passes | NOT RUN | Dependencies not installed |
| Tests pass | NOT RUN | Dependencies not installed |
| Lint passes | NOT RUN | Dependencies not installed |
| Typecheck passes | NOT RUN | No typecheck script; dependencies absent |
| Mobile/browser runtime verified | NOT RUN | No app runtime launched |
| Backend/auth/database readiness verified | FAIL / NOT PRESENT IN ARCHIVE | No concrete implementation identified |
| Lovable vs Copilot migration ownership decided | BLOCKED | `AGENTS.md` still assigns DB/migration control to Lovable |
| Phase 1 architecture decisions approved | BLOCKED | Provider/runtime/DB/migration/deployment decisions open |

## 3. Blocking owner decisions

### DEC-01 — Source and migration ownership

Decide whether VS Code + Copilot will own source code, schema design, and database migrations, while Lovable is retained only as an editor/preview/sync participant. The current `AGENTS.md` says database changes must be made through Lovable. Do not bypass this instruction until the owner explicitly resolves it.

### DEC-02 — Package manager

Choose Bun or npm. The project contains `bun.lock`, while README instructs npm. Use one lockfile and one CI install method.

### DEC-03 — Backend/database provider

Choose after comparing operational requirements, authorization controls, migration workflow, data residency/hosting needs, backup, and cost. PostgreSQL is the Blueprint direction; vendor is undecided.

### DEC-04 — Authentication

Choose identity provider and account lifecycle (phone/email/OTP/OAuth, recovery, multi-role person model).

### DEC-05 — Brand status

Confirm whether `BolaID` is an approved brand or a temporary prototype label.

## 4. Phase 0 exit criteria

Phase 0 may be marked complete only when:

1. The actual Git repository is available and branch/remote/history are inspected.
2. Owner resolves DEC-01 and DEC-02 at minimum.
3. Dependency installation completes reproducibly from a clean checkout.
4. Build, lint, typecheck, and existing tests are executed and results recorded.
5. A browser smoke test covers all existing routes at desktop and mobile widths.
6. The target architecture and initial Phase 1 backlog are approved.
7. No critical ambiguity remains in the identity, guardian/consent, organization, and authorization boundaries required for the first vertical slice.

## 5. Next action

Run the companion Copilot Phase 0 verification prompt in the actual cloned Git repository. Copilot should first inspect the actual repository state, then reconcile this preliminary package with the real files and execute runtime checks only after confirming package-manager choice and preserving the existing lockfile.
