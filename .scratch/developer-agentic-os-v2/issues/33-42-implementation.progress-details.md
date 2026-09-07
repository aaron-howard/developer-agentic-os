# Operational Automation 33-42 Progress

Implemented the shared operational foundation across tickets 33-42 without changing parent issue 32.

## Verified scope

- Operational events are normalized, repository-scoped, deduplicated, persisted, and exposed through typed routes.
- Correlated events are grouped into incidents while retaining event evidence and provider provenance.
- Repository-local policies validate bounded retries/catch-up and reject credential-bearing data.
- Automation runs persist lifecycle, approval, retry history, outputs, and errors; pause, resume, cancel, retry, and global pause routes are available.
- Scheduled/provider policy execution uses the existing Skill Registry and never invokes an arbitrary shell runner.
- Sentry has a read-only adapter with deterministic fetch fixtures and normalized configuration/provider states.
- Failed provider events create existing integration signals and link them to incidents.
- GitHub failed-action rerun and Vercel redeploy methods are approval-gated through stored input fingerprints and immutable audit records.
- Focus Board exposes active incidents and operational runs using existing domain stores.

## Validation

- `npm exec tsx --test tests/operational-automation.test.ts`: 6 passing.
- `npm run typecheck`: passing.
- Full `npm test`: 64 passing at the time of this entry.

## Remaining gaps

- Browser coverage for the new operational panels and action controls is not yet added.
- Existing command-centre controls do not yet offer dedicated approval/action buttons for operational runs.
- Restart catch-up and interrupted process recovery are represented by lifecycle contracts but are not integrated into the existing background timer.
- `npm run lint`: passing.
- `npm run build`: passing after one local route-parser fix.
- `npm test`: 66 passing on the repeat run; the prior single handoff failure was intermittent and did not reproduce.
- `npm run test:e2e`: 32 passing existing browser regression tests.
- New operational controls do not yet have dedicated browser scenarios.

## Follow-up Validation

- Added a Focus Board operational run inspector with approval, pause/resume/cancel, provider-action selection from run input, and audit/result display.
- Integrated scheduled operational policy evaluation and interrupted-run marking into the leased local background executor.
- Added Playwright coverage for pending-run visibility, approval, pause/resume, approved GitHub rerun, and audit rendering; focused browser coverage passes in both configured projects.
- Focused operational/background tests pass (8/8 across the two files), and `npm run typecheck` passes.
- Full `npm test` currently reports one unrelated existing failure in `tests/signal-triage.test.ts` (`404 !== 400`); no operational test failure was observed.
- Remaining gap: policy schedules do not carry an explicit due timestamp, so restart catch-up uses UTC calendar-day boundaries and `catchUpWindowMinutes` rather than a richer schedule expression.
