# Phase 0 — Route & Functional Audit

**Classification:** UI/UX prototype inventory, not production feature verification.

| Route | Observed UI capability | Data/state evidence | Initial assessment |
|---|---|---|---|
| `/` | Product landing/home | Route file exists | UI present; business workflows not established |
| `/player` | Football ID/passport, journey, match history, development, certificates | Imports mock player/journey/development/match/certificate records; buttons show toast feedback | Prototype; share/QR actions are not backed by API |
| `/parent` | Child switcher, schedule, attendance/development summary, invoice, messages, consent controls | Imports mock child/messages/audit records; local React state for paid and consent | Prototype; consent is not persisted or enforced server-side |
| `/payments` | Invoice list, payment method selection, payment history | Mock invoice/history; local state marks invoices paid | Prototype; no payment gateway or reconciliation evidenced |
| `/schedule` | Role-aware weekly agenda and day filter | Static agenda and local filter state | Prototype; no persisted calendar/activity source |
| `/opportunities` | Trial/opportunity list and filters; apply action | Static opportunities; local applied state and toast | Prototype; no registration workflow/API evidenced |
| `/ssb` | SSB dashboard, teams, roster search, attendance, session list | Static SSB/team/roster/session data; local attendance state | Prototype; no organization or roster persistence |
| `/ssb/finance` | Finance summary and payment follow-up actions | Static SSB finance data; local reminder state | Prototype; no ledger/invoice/payment integration |
| `/coach` | Coach dashboard, roster and session plan | Static coach/roster/session plan | Prototype; no coach identity or team-scoped authorization |
| `/coach/assessment` | Player selection, score sliders, notes, completion state | Static assessment template/roster; local state | Prototype; assessment is not saved or versioned server-side |
| `/referee` | Assignment list and confirm/decline actions | Static assignments; local state | Prototype; no assignment service or notification delivery evidenced |
| `/referee/report` | Match event entry, event timeline, report submission | Static squads; local event state; submission toast | Prototype; no authoritative match-event persistence or finalization |
| `/organizer` | Tournament checklist, referee assignment, registration list | Static tournament/registrations/referees/matches; local assignment state | Prototype; no competition lifecycle persistence |
| `/tournament` | Tournament category, fixtures, results and standings | Static tournament/fixture/standings data | Prototype; standings are not proven to be calculated from persisted match data |
| `/scout` | Search filters, consent-filtered demo results, shortlist, request-contact action | Static scout pool; client-side `p.consent` filter; toast for contact request | High-risk prototype; consent gate is client-side demo logic only |
| `/association` | Region drill-down and growth metrics | Static regional tree and growth data; local path state | Prototype; no scoped association data access or aggregation service |

## Cross-cutting observations

1. UI coverage is broader than the actual MVP requirement. Several later-stage areas (scout, referee, association, development, finance) already have screens, but their presence must not cause them to be treated as production-ready or automatically prioritized over identity/competition foundations.
2. The role switcher is a prototype convenience, not an authenticated role assignment.
3. Toast messages such as “terkirim”, “diperbarui”, “dikonfirmasi”, or “tercatat di jejak audit” are not evidence that a server-side action occurred.
4. Local React state is transient and generally resets on reload; it cannot be treated as a system of record.
5. Static mock data can be useful for visual regression and UI development, but must be separated from production data access behind explicit repository/service boundaries.

## Route audit status

All listed routes are **UI PRESENT / BUSINESS WORKFLOW UNVERIFIED**. No route is marked production-complete based on this archive inspection.
