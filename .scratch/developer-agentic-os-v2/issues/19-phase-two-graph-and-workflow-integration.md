# 19: Phase-Two Graph And Workflow Integration

**What to build:** Connect Repository Contexts, Work Items, Routines, Skills, Artifacts, and files in the Second Brain and present the complete multi-repository daily workflow coherently.

**Blocked by:** 15: Workspace Switcher Micro App; 16: Work Queue Micro App; 17: Repository-Aware Workflow Execution; 18: Local Background Routine Executor

**Status:** closed

## Implementation Notes

- The graph preserves the first-build `repo`, `area`, `file`, `artifact`, and `skill` node types plus `contains`, `references`, `produced`, and `used_context` links. Phase two adds explicit `work_item` and `routine` nodes and `triggers` links.
- Work Items are scoped by Repository Context ID. Routine execution and Skill execution carry workflow references into Artifact provenance; legacy artifacts without provenance remain readable.
- Local Store reset removes only the repository's `.developer-agentic-os` directory and recreates the clean first-build shape. Existing JSON readers remain backward-compatible with missing provenance fields.
- Decomposition verdict: atomic. This is one bounded graph/provenance/inspector integration slice over the existing stores and dashboard; no independent migration is required.

- [x] The graph renders only explicit repository, work-item, routine, skill, artifact, and file relationships.
- [x] Inspector actions navigate between active context, Work Items, Artifacts, Skills, and Routines.
- [x] Artifact provenance includes Repository Context and triggering workflow references.
- [x] Migration/reset behavior is documented and validated for clean, first-build, and multi-repository stores.
- [x] Existing first-build flows, responsive layout, and optional integration behavior remain green.
- [x] Full unit, route, browser, build, and documentation validation passes.

## Validation

- `npm test`: 34 passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed with zero warnings.
- `npm run build`: passed.
- `npm run test:e2e`: 16 passed across desktop and mobile.
- Focused graph, artifact provenance, and Local Store reset tests pass.

## Caveat

Graph and provenance data are persisted per repository Local Store. The local background executor remains process-local with a persisted lease; distributed multi-machine scheduling is outside this issue.
