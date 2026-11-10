# PHASE 0 — ACTUAL REPOSITORY VERIFICATION & BASELINE RECONCILIATION

Act as Principal Software Architect, Senior Full-Stack Engineer, Application Security Engineer, and QA Lead.

## Authority

The sole initial product requirement baseline is `docs/product/BLUEPRINT-REQUIREMENT-BASELINE.md`, which records the owner decision accepting Blueprint v0.1 as the only current requirement source. If this file is not yet present in the repository, use the owner-supplied Blueprint v0.1 and create the baseline document. Do not assume a separate PRD exists.

Unspecified requirements must be `UNDEFINED`. Unmade technical choices must be `ARCHITECTURE DECISION REQUIRED`. Do not invent business rules.

## Mission

Re-run Phase 0 against the actual cloned Git repository. Reconcile the preliminary audit package supplied by the owner with the actual repository. This is an audit and verification task, not a feature implementation task.

## Safety and change control

1. Do not modify application source code.
2. Do not install, remove, or upgrade dependencies without owner approval.
3. Do not edit database schemas or migrations in this task.
4. Do not delete or rewrite existing files or Git history.
5. Do not force-push, rebase, amend, or squash already-published commits.
6. Do not edit generated files such as `src/routeTree.gen.ts`.
7. Respect `AGENTS.md`. Specifically, identify its Lovable-managed database/migration restriction and do not bypass it.
8. Preserve existing UI and mock data.
9. Never report a test as passed unless it was actually executed and its output recorded.

## Work

### A. Repository and Git inspection

- Confirm repository root, current branch, status, remotes, latest commits, and whether there are uncommitted changes.
- Identify whether the working branch is connected to Lovable and explain implications of commits.
- Compare actual files against the supplied preliminary audit.

### B. Requirement traceability

- Map Blueprint themes to existing screens/components and domain implementation evidence.
- Distinguish UI present, client-only behavior, server-backed behavior, and absent functionality.
- Do not treat labels, toast messages, mock data, or local state as completed business workflows.

### C. Runtime verification

- First inspect package manager and lockfiles.
- If lockfile/package manager conflict exists, report it; do not choose silently.
- Only run install/build/lint/test/typecheck if dependencies are already installed or the owner has approved installation.
- Record exact command, exit code, and relevant output.
- Inspect whether a typecheck script exists; do not claim type safety from editor diagnostics alone.

### D. Security verification

- Verify actual authentication, server-side authorization, guardian relationship, consent persistence/revocation, data access scoping, and audit trail.
- Specifically test whether scout results are filtered on the server by active purpose-specific consent.
- Check cross-organization and cross-guardian access paths.
- Do not use real child data.
- Treat CSRF middleware as request protection, not authentication or authorization.

### E. Phase 0 documents

Create or update:

- `docs/audit/PHASE-0-REPOSITORY-INVENTORY.md`
- `docs/audit/PHASE-0-ROUTE-FUNCTIONAL-AUDIT.md`
- `docs/audit/PHASE-0-ARCHITECTURE-ASSESSMENT.md`
- `docs/audit/PHASE-0-SECURITY-GAP-ANALYSIS.md`
- `docs/audit/PHASE-0-TECHNICAL-DEBT.md`
- `docs/audit/PHASE-0-IMPLEMENTATION-READINESS.md`
- `docs/architecture/PROPOSED-PHASE-1-BACKLOG.md`

Every material finding must include path and line references where possible, severity, impact, and recommended next action.

## Status vocabulary

Use only:

- `VERIFIED` — directly evidenced and checked.
- `PARTIAL` — some implementation/evidence exists, but acceptance is incomplete.
- `NOT IMPLEMENTED` — no implementation found after inspecting relevant paths.
- `UNKNOWN` — insufficient evidence.
- `BLOCKED` — cannot verify because of missing access, dependency, decision, or environment.

## Final response

Provide an executive summary, findings by severity, runtime check results, unresolved owner decisions, Phase 0 gate status, and a proposed next action. Do not mark Phase 0 complete until all exit criteria are satisfied.
