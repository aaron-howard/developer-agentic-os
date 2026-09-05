# 16: Work Queue Micro App

**What to build:** Capture, inspect, filter, and update lightweight Work Items tied to a Repository Context and explicit workflow context.

**Blocked by:** 14: Workspace And Repository Context

**Status:** closed

## Execution Notes

- Research confirms the existing persistence boundary is `src/server/local-store/json-file.ts` plus `getLocalStorePaths`; Work Queue data will use a typed JSON store file under `.developer-agentic-os`.
- Repository scope is represented by `RepositoryContext.id` from `src/types/workspace.ts`; the active context is available through `/api/workspace/context`.
- Existing API handlers return typed top-level JSON with validation in the route and domain behavior in a server module. The Command Centre has a reusable Inspector Panel and responsive module layout in `src/components/command-centre/command-centre-shell.tsx` and `src/app/globals.css`.
- The focused validation check is the existing Node/tsx test suite plus `npm run typecheck`, `npm run lint`, and the Work Queue browser flow. No repository-aware execution propagation or scheduling will be added.

- [x] Work Items support title, notes, status, priority, due information, and Repository Context.
- [x] Work Items can reference files, Areas, Artifacts, Skills, and Routines explicitly.
- [x] The Work Queue supports create, list, filter, status updates, and completion history.
- [x] Work Items open in an Inspector Panel with context and next actions.
- [x] Cross-repository Work Items remain isolated and correctly scoped.
- [x] Unit, route, and browser tests cover the Work Queue workflow.

## Validation

- `npm test`: 27 tests passed.
- `npx tsx --test tests/work-items.test.ts`: 2 tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npx playwright test`: 14 tests passed across desktop and mobile; the focused Work Queue flow was rerun after the final capture-field change and passed on both projects.

## Scope Caveats

- Work Items are persisted locally and scoped by explicit `repositoryId`; repository-aware execution propagation and background scheduling remain intentionally out of scope.
