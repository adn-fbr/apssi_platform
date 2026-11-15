# Development Workflow

**Status:** Governance for repository changes is `APPROVED` by OD-11 (2026-11-15). Branch, commit, and pull request conventions below are `PROPOSED` recommendations unless explicitly stated as owner decisions. This document does not authorize implementation, database access, or production deployment.

## Authority

- Product requirements: [BRB-001](../product/BLUEPRINT-REQUIREMENT-BASELINE.md) is the sole initial product requirement baseline. Undefined business rules remain `UNDEFINED`.
- Owner decisions: [PHASE-0-OWNER-DECISION-RECORD.md](../audit/PHASE-0-OWNER-DECISION-RECORD.md), including OD-11.
- Agent instructions: [AGENTS.md](../../AGENTS.md).
- GitHub is the canonical source of truth for application code, configuration, documentation, and migration history. VS Code is the primary development environment.

## Standard workflow

1. Open the canonical GitHub repository in VS Code and inspect the current branch, worktree, and repository instructions.
2. Fetch and pull the latest approved changes from GitHub. Do not discard existing local or user changes; resolve worktree changes before switching branches.
3. Create a feature branch from the approved base branch. Direct commits or pushes to `main` are not allowed.
4. Implement the authorized change in VS Code, using GitHub Copilot as an assistant. Keep the change within the approved task scope and preserve unrelated work.
5. Use Lovable only for explicitly approved UI design or frontend work. Do not delegate schema, migrations, RLS, backend authorization, or production infrastructure to Lovable.
6. Review Lovable-generated UI changes in Git before integration. Prefer a controlled feature branch. If Lovable cannot target a controlled branch, export or otherwise transfer the proposed changes into a reviewable branch; do not allow it to write directly to `main`. Avoid simultaneous edits to the same files from Lovable and VS Code.
7. Implement approved backend and database changes through repository source and the Supabase workflow. Supabase CLI is the intended database development tool, after verifying the supported version and current official documentation. Every schema change requires a reviewed migration. Do not link a project, execute SQL, or apply migrations without explicit authorization for that task.
8. Run the tests, build, lint, type checks, and security checks relevant to the change. Record exact commands and results. Do not claim a check passed if it was not run. Never use real child data in tests unless separately authorized and governed.
9. Review the complete Git diff, generated files, secret exposure, migration compatibility/security, and the final worktree. Confirm no unrelated changes were overwritten.
10. Create a pull request against the approved base branch. Include scope, evidence, migration/deployment notes, and remaining risks.
11. Merge only after required human review and automated checks pass. Never self-bypass a required approval or branch protection.
12. Promote and deploy through controlled environments. Production database changes and production deployment require the explicit approval process and owner authorization; no direct production mutation is allowed.

## Lovable-generated change handling

Lovable is a UI collaborator, not an integration authority. Before accepting a Lovable-generated change:

- Confirm the change is limited to the approved UI/frontend scope.
- Compare its complete diff with the current canonical GitHub branch.
- Reject or separate any unapproved database, migration, RLS, server authorization, secret, or production-infrastructure change.
- Run relevant lint, tests, build, and security review on the integrated branch.
- Resolve conflicts manually while preserving unrelated work; do not accept a bulk overwrite.
- Merge only through the reviewed pull request workflow.

At the time of the initial Phase 1A review, the README contained legacy Lovable-first and direct-to-main guidance. The subsequent documentation reconciliation updated the README to align with OD-11. Future changes must remain consistent with `AGENTS.md` and this approved workflow. GitHub branch protection and other technical enforcement remain unverified.

## Proposed conventions

These naming conventions are `PROPOSED`, not owner-approved requirements:

- Branch: `<type>/<ticket-or-date>-<short-description>`, for example `feature/APSI-123-player-passport` or `docs/2026-11-governance`.
- Commit: Conventional Commit style, for example `feat(player): add passport view` or `docs(governance): record OD-11`.
- Pull request title: `<type>: <concise change>`. Use one purpose per pull request where practical.

Do not include secrets, child data, or sensitive identifiers in branch names, commit messages, or pull request text.

## Pull request checklist

- [ ] Scope matches an approved task and BRB-001; undefined requirements are not guessed.
- [ ] Full diff reviewed; unrelated work preserved; no generated file edited manually.
- [ ] UI changes are reviewed; Lovable changes are not assumed safe or merged automatically.
- [ ] No credential, secret, local environment file, or real child data is committed.
- [ ] Database changes have a reviewed migration and backward-compatibility/security review; no production DB action occurred without explicit authorization.
- [ ] RLS and server-side authorization implications are addressed for exposed application data.
- [ ] Relevant tests, build, lint, type checks, and security checks ran and their results are reported accurately.
- [ ] Required reviewers and automated checks have approved the pull request.
- [ ] Deployment and environment-promotion plan is documented; production approvals are recorded separately.

## Environment and secret handling

Never commit local environment files or secret values. Use only a secret-management mechanism approved for the target environment. The production secret provider, operational owner, rotation process, and local/staging/production variable mapping remain `ARCHITECTURE DECISION REQUIRED`; Lovable is not the production infrastructure authority. Never place Supabase `service_role` credentials or other privileged secrets in browser code.
