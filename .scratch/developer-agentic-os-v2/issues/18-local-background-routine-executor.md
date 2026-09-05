# 18: Local Background Routine Executor

**What to build:** Run eligible due Routines locally on a predictable cadence with deterministic repository context, leases, pause exclusion, and visible execution history.

**Blocked by:** 14: Workspace And Repository Context; 17: Repository-Aware Workflow Execution

**Status:** closed

## Implementation Notes

- The existing execution seam is `createRoutineRegistry({ root }).runRoutine(id)`, which creates a `RoutineHistoryStore` execution and delegates executable work to `SkillRegistry.runSkill()`.
- `RoutineHistoryStore` persists execution history in `.developer-agentic-os/routines/history.json`; repository identity is already derived from the registry root.
- `WorkspaceStore.getActiveContext()` and `resolveRepositoryContext()` provide the active or explicitly selected repository context used by API requests.
- The implementation will add `RoutineExecutionMode` and execution `source`, a persisted per-root executor state/lease, injected-clock due evaluation for daily/nightly/weekly schedules, and an executor control route. Existing per-routine manual run, pause, and resume routes remain unchanged.
- Decomposition verdict: atomic. This is one bounded scheduler/persistence/API/UI slice over the existing routine seam; no graph expansion or independent project migration is involved.
- Focused checks: deterministic executor tests with a fake clock and lease expiry, route contract tests, then `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`.

- [x] Routine definitions distinguish manual execution from local background execution.
- [x] A single persisted lease prevents duplicate execution in the local executor and expires safely on timeout or shutdown/release.
- [x] Due Routines run against the active or explicitly selected Repository Context, with deterministic cwd fallback support.
- [x] Paused Routines are excluded and failures remain visible in execution history plus executor status.
- [x] Manual and background runs share the same RoutineRegistry and SkillRegistry execution seam.
- [x] Injected-clock unit tests and browser tests cover scheduling, lease, status, and failure behavior.

## Validation

- `npm test`: 32 passed.
- `npx tsx --test tests/e2e/dashboard.spec.ts --project=desktop --grep "runs a skill|runs a routine|local background"`: 3 passed.
- `npm run typecheck`, `npm run lint`, and `npm run build`: passed.

## Caveat

The executor cadence is local-process driven. Lease state and execution history persist on disk for restart/expiry visibility; a multi-machine distributed scheduler is outside this issue.
