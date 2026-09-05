# 14: Workspace And Repository Context

**What to build:** Register local repositories, select one active Repository Context, persist that selection, and show its current repository state in the Command Centre.

**Blocked by:** None (can start immediately)

**Status:** closed

## Execution Notes

- Existing persistence is filesystem-backed JSON through `src/server/local-store/json-file.ts`.
- Existing local-store roots are resolved from the supplied root, defaulting to `process.cwd()`; workspace metadata will follow that convention at `.developer-agentic-os/workspace.json`.
- Existing repo memory already carries explicit `repoName` and resolved `repoPath`, so this issue will add context registration without rewiring issue 17 consumers.
- Repository IDs will be stable SHA-256 identifiers of normalized resolved paths; registration validates that the path exists and is a directory.
- Missing workspace metadata preserves the first-build default by exposing the resolved current working directory as the active context without creating metadata.
- Route surface: `GET/POST /api/workspace/repositories`, `DELETE /api/workspace/repositories/:id`, and `GET/PUT /api/workspace/context`.
- Focused tests will cover model/store persistence, path validation, stable IDs, route contracts, deletion of active repositories, and legacy cwd fallback.

- [x] A Workspace can register, list, validate, and remove local Repository Contexts.
- [x] One Repository Context can be selected as active and persists across reloads.
- [x] Repository identity is explicit in repo memory, integration status, Skills, Routines, Artifacts, and Second Brain reads.
- [x] Existing first-build Local Store data remains readable when Workspace metadata is absent.
- [x] Invalid paths and ambiguous repository selections fail clearly without corrupting Workspace state.
- [x] Unit and route tests cover the context contract; browser/workflow propagation remains intentionally deferred to tickets 15-19.
