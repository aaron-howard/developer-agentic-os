# 22: Today And Focus Board

**What to build:** Provide a live daily Micro App for active Work Items, due and blocked work, recent Artifacts, and failed workflows in the selected Repository Context.

**Blocked by:** 21: Signal Triage Workflow Actions

**Status:** closed

## Execution Notes

- Verified source surfaces: `src/server/work-items/work-item-store.ts`, `src/server/artifacts/artifact-store.ts`, `src/server/skill-runs/skill-run-store.ts`, `src/server/routines/routine-history-store.ts`, `src/server/workspace/request-context.ts`, and `src/components/command-centre/command-centre-shell.tsx`.
- The existing stores are canonical and repository-scoped: Work Items filter by `repositoryId`; Artifact, Skill Run, and Routine stores are constructed with the selected Repository Context path.
- Planned contract: a read-only `GET /api/focus-board` route returning references to existing Work Items, recent Artifacts, failed Skill Runs, and failed Routine executions plus derived due/overdue/blocked groupings. No new persisted records.
- Decomposition verdict: atomic. Execution stage and breakdown hints were not forwarded for this issue workflow; the implementation scope is a single service/route/UI slice with validation gates between data and browser behavior.
- Discriminating check: service tests will seed two repository roots and assert selected-context isolation, stable record IDs, and due/overdue/blocked and failed ordering before UI integration.

- [x] Focus Board aggregates existing Work Queue, Artifact, Skill Run, and Routine data without duplicating records.
- [x] Content is scoped to the active or selected Repository Context.
- [x] Due, overdue, blocked, recent, and failed states are visible and ordered usefully.
- [x] Existing Inspector, Work Item, Skill, Routine, and Artifact actions remain available.
- [x] The board supports repository switching and responsive desktop/mobile layouts.
- [x] Aggregation, route, and browser tests cover the daily workflow.

## Validation

- Added `GET /api/focus-board` and a repository-scoped aggregation service over canonical Work Item, Artifact, Skill Run, and Routine history stores.
- Added aggregation isolation/order coverage and route contract coverage.
- Added desktop/mobile browser coverage for the Focus Board Micro App and preserved Work Queue action coverage.
- `npm test`: 41 passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- Focus Board and Work Queue browser cases: 4 passed across desktop/mobile.
- Full dashboard browser file: 18 passed, 2 pre-existing workspace-switcher reload failures caused by accumulated local repository state; no Focus Board failures.

**Caveat:** The existing workspace-switcher reload case remains flaky when local repository state accumulates between browser tests, consistent with issue 21's documented caveat.
