---
title: Phase Two Multi-Repository Daily Workflow
labels:
  - ready-for-agent
status: open
---

## Problem Statement

The first build provides a useful local Command Centre for one repository, but phase two still leaves the developer to manage repository context manually and to start every Routine by hand. The product needs to become a daily operating surface for a developer who works across multiple repositories without abandoning its local-first model or introducing hosted infrastructure prematurely.

The current domain model has the right primitives: Repo Memory Snapshots, Skills, Routines, Artifacts, the Second Brain, Integration Adapters, and the Command Centre. Phase two should connect those primitives around a durable workspace context. A developer should be able to switch repositories, see the active repository clearly, capture work that needs attention, and let local routines run when their schedules are due.

## Solution

Extend Developer Agentic OS into a local-first multi-repository daily workflow product.

The phase-two build will:

- Introduce a Workspace containing one or more registered repositories.
- Make one Repository Context active at a time and use it as the default context for repo memory, Skills, Routines, Artifacts, and the Second Brain.
- Promote the Micro Apps surface into a live Workspace Switcher and Work Queue micro app while keeping other future micro apps extensible.
- Add a durable work-item intake model for notes, tasks, and manually captured follow-ups that can reference repositories, files, Areas, Artifacts, Skills, or Routines.
- Add a local background routine executor that evaluates due schedule-aware Routines and records each attempt through the existing Routine Execution Record contract.
- Preserve manual Run Now, pause/resume, failure visibility, and local inspectability.
- Keep all phase-two state in the Local Store and keep external integrations optional.

Phase two is complete when a developer can open the app, select a repository, understand its current workflow state, capture a work item, run or schedule a Routine against the active Repository Context, and follow the resulting Artifact and Second Brain relationships without manually rewriting context between repositories.

## User Stories

1. As a developer, I want to register multiple repositories, so that Developer Agentic OS can represent my actual working set.
2. As a developer, I want to see all registered repositories in one Workspace, so that I can understand the scope of my daily work.
3. As a developer, I want to select one active Repository Context, so that every repo-aware operation has an unambiguous target.
4. As a developer, I want the active Repository Context to be visible in the Command Centre, so that I do not accidentally run work against the wrong repository.
5. As a developer, I want to switch repositories without restarting the app, so that changing tasks is quick.
6. As a developer, I want repository registration to validate that the selected location exists, so that broken contexts do not enter the Workspace.
7. As a developer, I want a non-git repository to remain selectable with a clear Integration Status, so that the Workspace does not fail as a whole.
8. As a developer, I want the active Repository Context to drive Repo Memory refreshes, so that the Second Brain reflects the repository I am currently working on.
9. As a developer, I want repository-specific Artifacts to remain distinguishable, so that outputs from different repositories do not become one ambiguous list.
10. As a developer, I want repository-specific Skill Runs to retain their context, so that I can audit where an output came from.
11. As a developer, I want repository-specific Routine Execution Records, so that scheduled work is traceable to the repository it processed.
12. As a developer, I want the Second Brain to identify the active repository, so that graph exploration starts from the context I selected.
13. As a developer, I want to switch repositories from a Micro App, so that repository selection is a focused utility rather than a hidden setting.
14. As a developer, I want the Workspace Switcher to show branch and git availability, so that I can choose a repository using useful current signals.
15. As a developer, I want the Workspace Switcher to show recent activity, so that I can find the repository that needs attention.
16. As a developer, I want the Workspace Switcher to preserve the last active repository, so that reopening the app returns me to my working context.
17. As a developer, I want to capture a work item from the Command Centre, so that small follow-ups do not disappear into another tool.
18. As a developer, I want a work item to contain a title, optional notes, status, priority, and due information, so that it can represent a real follow-up.
19. As a developer, I want a work item to reference a Repository Context, so that it remains tied to the work it describes.
20. As a developer, I want a work item to reference a file, Area, Artifact, Skill, or Routine when relevant, so that the Second Brain can explain its context.
21. As a developer, I want to mark a work item open, in progress, blocked, or complete, so that the Work Queue reflects real progress.
22. As a developer, I want to filter the Work Queue by repository and status, so that the list remains usable as my Workspace grows.
23. As a developer, I want to open a work item in an Inspector Panel, so that its context and next actions are visible without leaving the Command Centre.
24. As a developer, I want completed work items to remain in history, so that I can understand what changed over time.
25. As a developer, I want a Routine to declare whether it is eligible for local background execution, so that manual-only workflows are not silently automated.
26. As a developer, I want the local executor to evaluate due Routines on a predictable cadence, so that schedule-aware Routines can run without a hosted worker.
27. As a developer, I want a due Routine to execute against the active or explicitly assigned Repository Context, so that background work has deterministic context.
28. As a developer, I want each background attempt to create a Routine Execution Record, so that automatic work is as auditable as manual work.
29. As a developer, I want background execution to reuse SkillRegistry handlers, so that manual and scheduled behavior do not drift.
30. As a developer, I want a failed background Routine to record its error and remain visible, so that local automation fails transparently.
31. As a developer, I want paused Routines to remain excluded from automatic execution, so that pause has a reliable meaning.
32. As a developer, I want to see the last run, next due time, and execution source for a Routine, so that I can distinguish manual work from local background work.
33. As a developer, I want to trigger a due Routine manually, so that I can validate or accelerate scheduled work.
34. As a developer, I want generated Artifacts to link back to the Repository Context and triggering Routine or Skill, so that the result is navigable from every relevant surface.
35. As a developer, I want the Second Brain to show relationships among repositories, work items, files, Artifacts, Skills, and Routines, so that it becomes a useful operational memory rather than only a file constellation.
36. As a developer, I want optional integrations to remain available or connected independently per Repository Context, so that one repository's credentials do not block another.
37. As a developer, I want the app to remain useful without GitHub credentials, so that the multi-repository Workspace stays local-first.
38. As a developer, I want local state to be inspectable and resettable, so that phase-two behavior remains safe to troubleshoot.
39. As a developer, I want the Command Centre to remain responsive with several repositories and work items, so that adding context does not make the core workflow harder to scan.
40. As a developer, I want the existing first-build flows to keep working, so that phase two extends the product instead of regressing its live widgets, placeholder boundaries, or layout behavior.

## Implementation Decisions

- The canonical aggregate is a Workspace. A Workspace owns registered Repository Contexts, the active Repository Context selection, and cross-repository Work Items.
- A Repository Context is the durable identity for one local repository. It contains a stable identifier, display name, local location, active/inactive state, and repository-scoped integration and memory metadata.
- The active Repository Context is client-visible and persisted locally, but server operations must receive or resolve an explicit repository context rather than relying on an implicit process working directory.
- Existing repository-scoped models gain a repository context reference. Existing first-build data created before phase two must remain readable and should be associated with the default repository context when migration is possible.
- The Local Store remains the persistence boundary. Workspace registration, active-context metadata, Work Items, executor leases, and executor history use structured JSON behind typed server modules.
- The Workspace Switcher is the first live Micro App. It owns repository selection and repository summary display; it does not become a generic navigation system.
- The Work Queue is the second live Micro App. It owns work-item capture, filtering, status transitions, and context references; it does not replace the Skills Deck or Routines panel.
- Work Items are domain records, not Artifacts. A Work Item describes intended or pending human work; an Artifact describes durable output produced by a workflow.
- Work Item statuses are `open`, `in_progress`, `blocked`, and `completed`. Priority is `low`, `normal`, `high`, or `urgent`.
- Work Items may reference files, Areas, Artifacts, Skills, and Routines through explicit Context References. Inferred graph relationships remain out of scope.
- Routine definitions gain an explicit execution mode distinguishing `manual` from `local_background`. Existing manual routines remain manual unless deliberately opted into local background execution.
- The local background executor is a process-owned scheduler with a single active lease. It evaluates due routines, prevents duplicate execution during one lease window, records started/completed/failed attempts, and releases its lease on shutdown or expiry.
- Background execution must never run a paused Routine and must not silently retry indefinitely. Retry policy is explicit per Routine and defaults to no automatic retry until a later decision.
- The executor runs only against a Repository Context that is active or explicitly assigned by the Routine. It must not derive repository identity from a mutable global current directory.
- Scheduled and manual runs share the same RoutineRegistry and SkillRegistry execution seam. The highest test seam is the routine execution boundary: given a Routine, Repository Context, clock, and executor lease, it produces one Routine Execution Record and any linked Artifacts.
- Time is injected at the scheduler boundary so due-status and next-run behavior can be tested deterministically.
- The Second Brain expands its graph contract with repository, work-item, and routine nodes only where a durable explicit relationship exists. Existing first-build node and link types remain backward compatible.
- Artifacts produced by a Skill or Routine include Repository Context references. The graph may connect a Work Item to its explicitly referenced Artifact or Routine, but it must not infer relationships from names or timestamps.
- Integration Adapters remain independently scoped to Repository Contexts. Local Git is still required per usable repository; GitHub remains optional and credential-driven.
- The Command Centre keeps Calendar and Email as placeholders until their own provider and privacy decisions are made. Phase two does not turn those widgets into fake live integrations.
- Layout settings remain client-owned and continue to support Reset Layout and mobile vertical-only resizing.
- The UI must surface active repository, background executor state, last execution result, and errors without blocking the rest of the Command Centre.
- API boundaries should expose typed Workspace, Repository Context, Work Item, Routine scheduling, and execution contracts. Route handlers remain thin and delegate persistence and behavior to server modules.
- There is no hosted authentication, shared multi-user Workspace, remote database, or cloud worker in this phase.

## Testing Decisions

- Tests verify observable contracts at the highest stable seam. They should not assert private helper structure, JSON formatting, or React implementation details.
- The primary unit seam is the repository/workspace service boundary: registering a repository, selecting an active context, refreshing context metadata, and rejecting invalid locations.
- The primary work-item seam is the Work Queue service boundary: create, list, filter, update status, add explicit context references, and preserve history.
- The primary scheduler seam is the routine execution boundary with an injected clock and lease store. Tests cover due selection, explicit repository context, pause exclusion, duplicate prevention, completion, failure, and shutdown/lease expiry.
- Existing ArtifactStore, SkillRegistry, RoutineRegistry, integration, and Second Brain tests remain regression coverage and gain repository-context assertions.
- Route-handler tests cover success, validation failure, unknown IDs, unavailable integrations, and cross-repository isolation for Workspace, Work Items, and scheduler endpoints.
- Migration tests cover a clean Local Store, a first-build Local Store without Workspace metadata, and a Local Store containing multiple Repository Contexts.
- Browser tests use the existing Playwright smoke suite as prior art. They cover repository switching, active-context visibility, Work Queue capture and filtering, manual Routine execution, background execution status, graph inspection, artifact navigation, layout persistence, and desktop/mobile overflow.
- Browser tests must create or select isolated temporary repository fixtures where possible and must not depend on the developer's real repository contents or credentials.
- A deterministic fake clock and fake scheduler lease are preferred over sleeping in tests. End-to-end tests may use short explicit waits only for visible UI state transitions.
- Validation remains `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, and `npm run build`, with all commands required to exit successfully.

## Out of Scope

- Hosted authentication, accounts, permissions, invitations, and multi-user collaboration.
- A hosted database or cloud synchronization of Local Store state.
- Automatic migration from the previous Python application's `.memory` directory.
- Arbitrary shell-command execution from Work Items, Skills, or Routines.
- Unbounded automatic retries, self-modifying schedules, or autonomous routine creation.
- Turning Calendar, Email, Slack, Jira, Linear, GitLab, or observability surfaces into live integrations.
- GitHub Issues, Releases, Actions/CI, or full remote repository synchronization beyond the existing optional metadata boundary.
- Reordering Command Centre widgets or replacing the current layout model with a new drag-and-drop system.
- A general-purpose project management suite. Work Items are intentionally lightweight context-carrying follow-ups.
- A general-purpose plugin marketplace for Micro Apps.
- Model-provider billing, team-level model governance, or a new AI gateway.
- Replacing the Second Brain visual language with a separate navigation application.

## Further Notes

- This is a multi-session milestone. The recommended execution order is Workspace and Repository Context, then Work Queue, then background Routine execution, then graph and cross-surface integration, followed by migration, browser coverage, and documentation.
- The phase-two success metric is reduced context switching for one developer working across multiple repositories, not the number of integrations or automation features shipped.
- The first implementation ticket should establish the Workspace and Repository Context contract before adding scheduler behavior. Without an explicit repository identity, background execution would make the current single-repository assumptions harder to remove later.
- The most important failure mode is running a valid Skill or Routine against the wrong repository. Active-context visibility, explicit server context, and cross-repository tests are therefore release-blocking.
- A future hosted phase can introduce shared Workspaces and remote persistence after the local Repository Context and Work Item semantics prove stable.
