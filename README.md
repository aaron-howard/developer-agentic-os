# Developer Agentic OS v2

Developer Agentic OS v2 is a local-first command centre for repository work, skills, routines, artifacts, and workspace memory. It is a Next.js App Router application using TypeScript and filesystem-backed JSON state.

## Run Locally

Requirements: Node.js with npm and a local Git installation.

```powershell
npm install
npm run dev
```

Open `http://localhost:3000/`. This is the live application and includes the current Workspace, Work Queue, routine executor, and Second Brain updates.

The approved static visual reference remains available at `index.html`, but it is a frozen prototype and does not receive React/Next application updates. Use the Next.js app above for the current experience.

## Local Store

The app creates `.developer-agentic-os/` in the workspace on first use. It contains:

- `artifacts/`: durable artifact JSON files and an index.
- `repo-memory/`: refreshable repository snapshots.
- `skill-runs/`: skill execution records and statuses.
- `routines/`: routine definitions and execution history.

The store is local and inspectable. To reset generated server state, stop the dev server and run:

```powershell
Remove-Item -Recurse -Force .developer-agentic-os
```

Layout preferences are browser-owned. Use **Reset Layout** in the Layout controls to restore the dashboard baseline, or clear the `developer-agentic-os-layout-v1` local-storage entry in the browser.

## First-Build Boundaries

Live widgets:

- Artifacts, including artifact detail inspection.
- Skills Deck, including built-in skill runs and model-by-effort configuration.
- Routines, including manual Run Now, pause/resume, and history-backed status.
- Second Brain graph, including repository, area, file, artifact, and skill nodes.
- Layout settings and integration status.

Placeholder widgets:

- Micro Apps catalog.
- Calendar and agenda data.
- Email and communication signals.

Integrations:

- Local Git is required and reports repository status.
- GitHub is optional and becomes connected when `GITHUB_TOKEN` or `GH_TOKEN` is available.
- Jira, Linear, Slack, email providers, observability services, Cloudflare services, and other external systems are represented as available/deferred setup surfaces.

Automatic background routine scheduling and persisted user-added Micro Apps are outside the first build.

## Phase Two

Phase two extends the first build into a multi-repository daily workflow:

- Workspace and Repository Context registration with a live Workspace Switcher.
- A repository-scoped Work Queue for lightweight follow-ups and explicit context references.
- Repository-aware Skill, Routine, Artifact, and Integration execution with provenance.
- A local background Routine executor with leases, pause exclusion, and visible history.
- Second Brain links across Repository Contexts, Work Items, Routines, Skills, Artifacts, and files.

Phase-two implementation tickets are tracked under `.scratch/developer-agentic-os-v2/issues/14-19`. The executor remains process-local; hosted scheduling, authentication, shared Workspaces, and cloud synchronization are intentionally deferred.

Phase-three implementation tickets are tracked under `.scratch/developer-agentic-os-v2/issues/20-25`. Phase Three adds Agent Inbox, signal triage, Today / Focus Board, Session Handoff, provider-neutral Email sync, and explicit Second Brain provenance while keeping Email read-only and local-first.

## Validation

Run the application checks from the repository root:

```powershell
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

Expected status for a healthy checkout: every command exits with code `0`; the unit and contract suite reports 50 passing tests, and the Playwright suite reports 24 passing desktop/mobile smoke tests. Playwright uses an isolated local dev server on port `3100` and installs Chromium with:

```powershell
npx playwright install chromium
```

## Project References

- [Domain context](CONTEXT.md): canonical product terminology and first-build boundaries.
- [Wayfinder map](.wayfinder/map.md): resolved product and architecture decisions.
- [Implementation handoff](docs/implementation-plan-and-validation-strategy.md): module boundaries, routes, test strategy, and browser checks.
- Phase Three graph and Local Store boundaries, focused checks, and full validation commands are documented in the implementation handoff.
- [Build issue set](.scratch/developer-agentic-os-v2/issues/build-developer-agentic-os-v2.md): original first-build specification.
- [Static visual reference](index.html): approved command-centre direction.

## Visual Direction

The first screen is the usable command centre rather than a landing page. It uses a dark, orange, and off-white visual system with a central orbital Second Brain, live workflow panels, bounded resizing, and no YouTube or Robonuggets references.