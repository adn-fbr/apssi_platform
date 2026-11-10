# Phase 0 — Technical Debt & Migration Risks

| ID | Priority | Observation | Risk | Recommendation |
|---|---|---|---|---|
| TD-01 | P0 | Mock data is directly imported by many route components. | UI and domain data are coupled; replacing fixtures piecemeal can create inconsistent state. | Introduce typed feature-level service/repository interfaces; retain mock adapters for tests and story/demo mode. |
| TD-02 | P0 | Role context models a role switcher, not a real multi-role identity/authorization system. | UI role may be mistaken for actual permission. | Separate display role preference from authenticated principal, role assignments, organization memberships, and server policy. |
| TD-03 | P0 | Consent and payment actions mutate local component state. | False success feedback and loss of state on reload. | Replace with server commands and explicit pending/success/failure states after backend exists. |
| TD-04 | P1 | Existing routes span MVP and future ecosystem capabilities. | Risk of implementing screens in navigation order instead of dependency order. | Prioritize identity, guardian/consent, organization, team, competition, match data foundations. |
| TD-05 | P1 | One route-matching test is the only test file found. | No meaningful regression coverage for business rules or security. | Add unit, integration, authorization, API, and E2E test layers as modules are implemented. |
| TD-06 | P1 | No explicit `typecheck` script exists in `package.json`. | Type safety may not be checked consistently in CI. | Add a dedicated typecheck script after confirming compiler baseline. |
| TD-07 | P1 | README says npm while repository includes `bun.lock`. | Non-reproducible dependency installation and lockfile drift. | Owner chooses one package manager and updates docs/CI consistently. |
| TD-08 | P1 | `AGENTS.md` directs database/migrations to Lovable and asks not to edit them manually. | Conflicts with requested Copilot-led development if Copilot is expected to own schema/migrations. | Owner must explicitly decide source-of-truth and migration ownership before database work. Preserve Lovable sync/history safeguards. |
| TD-09 | P2 | Working name `BolaID` appears in UI metadata, but Blueprint naming is not finalized. | Branding may be mistaken for an approved product decision. | Keep as provisional label until owner confirms brand. |
| TD-10 | P2 | Some UI messages imply actions are completed even though only local state/toast changes. | Users/testers may misinterpret prototype behavior. | During backend integration, only show success after server confirms; add prototype/demo labeling where necessary. |

## Preserve

- Existing responsive app shell and navigation patterns.
- Shared design tokens and UI primitives where accessible and maintainable.
- File-based TanStack routing, unless later evidence requires a change.
- Existing mock fixtures as isolated test/demo data.
- Generated route tree conventions; do not hand-edit generated files.
