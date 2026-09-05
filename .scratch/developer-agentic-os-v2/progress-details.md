## Issue 14: Workspace And Repository Context

- Implemented typed `Workspace` and `RepositoryContext` models.
- Added `.developer-agentic-os/workspace.json` persistence with stable SHA-256 IDs derived from resolved local paths.
- Added repository registration, listing, removal, active-context selection, path validation, and cwd fallback behavior.
- Added `GET/POST /api/workspace/repositories`, `DELETE /api/workspace/repositories/:id`, and `GET/PUT/POST /api/workspace/context`.
- Added focused unit and route coverage in `tests/workspace-context.test.ts`.
- Validation: focused tests pass (4/4), full tests pass (24/24), `npm run typecheck` passes, and `npm run lint` passes with zero warnings.
- Scope note: existing consumers continue to default to `process.cwd()`; repository-aware propagation is deferred to tickets 15-19 as requested.