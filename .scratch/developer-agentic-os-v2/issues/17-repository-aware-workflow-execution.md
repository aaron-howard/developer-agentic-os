# 17: Repository-Aware Workflow Execution

**What to build:** Make Skills, Routines, Artifacts, Skill Runs, and Integration Adapters execute against explicit Repository Contexts instead of the process working directory.

**Blocked by:** 14: Workspace And Repository Context

**Status:** closed

- [x] Repository-scoped workflow operations accept an explicit Repository Context.
- [x] Artifacts and Skill Runs retain repository provenance and remain isolated across repositories.
- [x] Routine executions and integrations use the assigned repository context.
- [x] Existing first-build records remain readable through compatibility handling.
- [x] Missing or invalid repository context fails before workflow execution begins.
- [x] Contract, route, migration, and regression tests cover cross-repository isolation.

## Validation

- `npm test` passed: 30 tests.
- `npm run typecheck` passed.
- `npm run lint` passed with zero warnings.
- `npm run build` passed.
