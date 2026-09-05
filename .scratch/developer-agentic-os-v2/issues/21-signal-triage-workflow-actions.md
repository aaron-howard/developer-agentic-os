# 21: Signal Triage Workflow Actions

**What to build:** Turn an Incoming Signal into a linked Work Item, existing Work Item attachment, Skill Run, Artifact, dismissal, or snooze without destroying the original signal.

**Blocked by:** 20: Incoming Signal And Agent Inbox

**Status:** ready-for-agent

## Implementation Notes

- Existing signal, work-item, skill, and artifact stores are repository-aware at their route boundaries.
- Triage will use `POST /api/incoming-signals/:id/triage` with a discriminated action contract.
- Work-item links use the explicit `incoming_signal:<signalId>` context reference and are deduplicated on attach.
- Cross-repository safety is enforced by resolving the signal and target work item through the request repository context before mutation.
- Dismiss and snooze update the existing signal only; no action deletes or replaces the source record.

- [x] Triage creates repository-scoped Work Items with explicit source-signal references.
- [x] Triage can attach a signal to an existing Work Item without duplication.
- [x] Triage can invoke a typed Skill or create an Artifact with provenance.
- [x] Invalid or cross-repository actions fail safely.
- [x] Agent Inbox exposes triage actions and visible outcomes.
- [x] Contract, route, and browser tests cover every triage path.

**Validation:** `npm test` (40 passed), `npx tsx --test tests/signal-triage.test.ts` (2 passed), `npm run typecheck`, `npm run lint`, and focused Playwright inbox coverage (desktop/mobile, 2 passed).

**Caveat:** The full dashboard Playwright file still has an existing workspace-switcher reload failure when local repository state accumulates between tests; the issue 21 inbox cases pass on both viewports.

**Status:** closed
