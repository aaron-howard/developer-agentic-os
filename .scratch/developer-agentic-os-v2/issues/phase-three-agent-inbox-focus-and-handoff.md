---
title: Phase Three Agent Inbox Focus And Handoff
labels:
  - ready-for-agent
status: open
---

## Problem Statement

Phase Two gives Developer Agentic OS a multi-repository Workspace, Repository Context switching, repository-aware workflow execution, a Work Queue, background Routines, provenance, and an operational Second Brain. The remaining daily-workflow gap is the handling of incoming context and session continuity.

The Email widget is currently a placeholder communication-signal surface and does not collaborate with the Work Queue. Incoming context has no explicit triage boundary, so a developer must manually decide what becomes actionable work, what should be dismissed, and what deserves a Skill or Artifact. The existing Work Queue is valuable for committed Work Items, but it should not become an undifferentiated inbox.

The developer also lacks a focused daily view that combines current Work Items, due and blocked work, recent outputs, and failed workflows. Session state is similarly difficult to preserve between interruptions or handoffs to another agent.

## Solution

Build Phase Three as a reliable local-first daily workflow milestone for one developer working across multiple Repository Contexts.

The product will add three focused Micro Apps:

- **Agent Inbox**: a source-neutral triage surface for Incoming Signals, beginning with manual notes and local/demo Email signals.
- **Today / Focus Board**: a daily operating view over the active Repository Context's Work Items, due and blocked work, recent Artifacts, and failed workflows.
- **Session Handoff**: an editable handoff draft that becomes an immutable snapshot Artifact when finalized.

The workflow is:

```text
Incoming Signal -> Agent Inbox -> Work Item / Skill / Artifact / dismissal
Work Items + Artifacts + failures -> Today / Focus Board
Current workflow state -> Session Handoff draft -> finalized Handoff Artifact
```

Existing Workspace Switcher and Second Brain Micro Apps remain valuable. The current Work Queue continues to own actionable Work Items. Email remains a provider-neutral communication-signal source and does not become a second Work Queue or an email client.

Phase Three is complete when the full workflow operates across multiple Repository Contexts with explicit provenance, reset/migration coverage, and no requirement for hosted authentication, cloud synchronization, or email send/reply behavior.

## User Stories

1. As a developer, I want an Agent Inbox, so that incoming context has a deliberate place before it becomes committed work.
2. As a developer, I want Agent Inbox to accept manual notes, so that I can capture context without an external provider.
3. As a developer, I want Agent Inbox to accept local/demo Email signals, so that the workflow is testable while remaining local-first.
4. As a developer, I want Incoming Signals to use a provider-neutral contract, so that Gmail, Outlook, or another provider can be added later without changing triage behavior.
5. As a developer, I want each Incoming Signal to show a source type, so that I know where it came from.
6. As a developer, I want each Incoming Signal to show a title and body or notes, so that I can understand it before acting.
7. As a developer, I want each Incoming Signal to retain a received or created timestamp, so that I can prioritize recent context.
8. As a developer, I want an optional source identifier, so that a signal can link back to its external origin when available.
9. As a developer, I want a signal to optionally carry Repository Context, so that repository-specific context can be preserved before triage.
10. As a developer, I want signal status to distinguish unprocessed, snoozed, dismissed, and triaged states, so that Inbox state is understandable.
11. As a developer, I want to dismiss a signal, so that irrelevant context leaves my active Inbox without becoming work.
12. As a developer, I want to snooze a signal, so that it can return later without losing its content.
13. As a developer, I want to create a Work Item from a signal, so that actionable context becomes a committed follow-up.
14. As a developer, I want the created Work Item to preserve a reference to its source signal, so that I can trace why the work exists.
15. As a developer, I want to attach a signal to an existing Work Item, so that multiple messages do not create duplicate commitments.
16. As a developer, I want to run a Skill from a signal, so that incoming context can trigger a safe typed workflow.
17. As a developer, I want to save a signal as an Artifact, so that useful reference material remains durable without becoming a task.
18. As a developer, I want triage actions to preserve the original signal, so that communication history is not destroyed when work is created.
19. As a developer, I want Agent Inbox to remain source-neutral, so that routine failures and repository notifications can join later without a new Inbox model.
20. As a developer, I want the Work Queue to remain focused on actionable Work Items, so that it does not become a noisy stream of incoming context.
21. As a developer, I want Today / Focus Board to show open and in-progress Work Items, so that I can see what deserves attention now.
22. As a developer, I want Today / Focus Board to show due and overdue Work Items, so that time-sensitive work is visible.
23. As a developer, I want Today / Focus Board to show blocked Work Items, so that impediments are not hidden in the general queue.
24. As a developer, I want Today / Focus Board to show recent Artifacts, so that I can connect current work to produced results.
25. As a developer, I want Today / Focus Board to show failed Skill Runs and Routine executions, so that failures become actionable instead of silent history.
26. As a developer, I want Focus Board content scoped to the active Repository Context, so that daily attention is not polluted by another repository.
27. As a developer, I want to switch the Focus Board to another registered repository, so that daily planning works across my Workspace.
28. As a developer, I want Focus Board items to open their existing Inspector actions, so that I can update Work Items, rerun workflows, or open Artifacts from one surface.
29. As a developer, I want Focus Board to reuse Work Queue state rather than duplicate it, so that status changes remain consistent across the app.
30. As a developer, I want to create a Session Handoff draft manually, so that I can prepare a clean continuation point before stopping work.
31. As a developer, I want a handoff draft to include the active Repository Context, branch, and changed files, so that the recipient knows exactly where work occurred.
32. As a developer, I want a handoff draft to include completed, open, and blocked Work Items, so that progress and remaining work are explicit.
33. As a developer, I want a handoff draft to include recent Artifacts and Skill Runs, so that generated evidence travels with the handoff.
34. As a developer, I want a handoff draft to include decisions, blockers, unresolved questions, and next actions, so that another session can resume without reconstructing context.
35. As a developer, I want to edit a handoff draft before finalizing it, so that generated context can be corrected.
36. As a developer, I want finalization to create an immutable Handoff Artifact, so that historical session state remains stable.
37. As a developer, I want finalized Handoff Artifacts to carry explicit Repository Context references, so that they remain navigable in the Second Brain.
38. As a developer, I want the Second Brain to link Incoming Signals, Work Items, Skills, Artifacts, Routines, and Repository Contexts only through explicit references, so that the graph does not invent relationships.
39. As a developer, I want Email to support triage and workflow linking without sending or replying, so that the product does not become a second email client.
40. As a developer, I want demo signal data to work without credentials, so that Phase Three remains locally usable.
41. As a developer, I want real Email data to activate only when a provider is configured, so that integration availability is transparent.
42. As a developer, I want multi-repository signal, Work Item, Artifact, and handoff data to remain isolated, so that context cannot leak between repositories.
43. As a developer, I want reset and migration behavior to preserve or clear Phase Three state predictably, so that local data remains safe to troubleshoot.
44. As a developer, I want the existing Workspace Switcher, Second Brain, Skills Deck, Routines, Artifacts, layout controls, and first-build placeholder boundaries to keep working, so that Phase Three is an extension rather than a regression.

## Implementation Decisions

- The canonical new record is an Incoming Signal. It is distinct from a Communication Signal display item and from a Work Item. An Incoming Signal represents triageable input; a Work Item represents an intentional commitment.
- Incoming Signals support source type, title, body or notes, created or received timestamp, optional source identifier, optional Repository Context, triage status, and explicit links to resulting Work Items, Skill Runs, or Artifacts.
- Initial source adapters are manual notes and local/demo Email. The adapter boundary is provider-neutral and may later support Gmail, Outlook, or other providers.
- Email remains read/triage context only. Sending, replying, and full email-client behavior are out of scope.
- The Agent Inbox owns signal listing, filtering, snoozing, dismissal, and triage action selection. It does not own Work Item lifecycle after a Work Item is created.
- Triage creates separate linked records: the Incoming Signal remains available as communication history and the Work Item owns actionable status, priority, due information, and completion history.
- The Work Queue remains the owner of Work Items. Agent Inbox must call the existing Work Item service boundary rather than duplicating Work Item persistence.
- Today / Focus Board is a read/orchestration surface over existing Repository Context, Work Item, Artifact, Skill Run, and Routine Execution data. It does not create a second copy of those records.
- Focus Board supports applicable existing actions: open Inspector, update Work Item status, run a linked Skill or Routine, open an Artifact, and navigate to explicit context.
- Focus Board data is scoped by active or explicitly selected Repository Context and must preserve cross-repository isolation.
- Session Handoff has draft and finalized states. Drafts are editable local records; finalization creates an immutable Handoff Artifact.
- Handoff generation uses a dedicated typed Skill or service seam over the active Repository Context, Work Items, Artifacts, Skill Runs, Routine executions, repo branch, changed files, decisions, blockers, and next actions.
- A finalized Handoff Artifact records the Repository Context, creation time, source session identity when available, and explicit Context References. It is not regenerated implicitly after finalization.
- The highest shared behavior seam is Incoming Signal triage: given a signal and action, it creates or links the appropriate Work Item, Skill Run, or Artifact while preserving source provenance.
- Existing ArtifactStore, WorkItemStore, SkillRegistry, RoutineRegistry, Repository Context, Integration Adapter, and Second Brain boundaries are reused. New persistence is limited to Incoming Signals and Handoff drafts/finalization metadata.
- Route handlers remain thin. Typed endpoints expose signal creation/listing/update/triage, Focus Board aggregation, and Handoff draft/finalization operations.
- The Email adapter reports connected, available, disabled, or error status using the existing Integration Adapter vocabulary. Demo mode is available without credentials.
- Phase Three remains local-first and filesystem-backed. No hosted authentication, cloud sync, multi-user Workspace, or distributed worker is introduced.
- Existing layout controls remain client-owned, with responsive behavior and no horizontal overflow at desktop or mobile sizes.

## Testing Decisions

- Tests verify observable behavior at the highest stable seam, not private helpers, JSON formatting, or React implementation details.
- The primary unit seam is Incoming Signal triage. Tests cover dismissal, snoozing, Work Item creation, linking to an existing Work Item, Skill invocation, Artifact creation, provenance, and invalid actions.
- Incoming Signal store tests cover creation, listing, status transitions, source identifiers, optional Repository Context, links to derived records, reset behavior, and migration from a clean or first-build Local Store.
- Work Item regression tests verify that signal-created Work Items behave identically to manually created Work Items and remain repository-scoped.
- Focus Board tests verify aggregation, active Repository Context filtering, due and blocked ordering, failed workflow visibility, and action delegation to existing services.
- Session Handoff tests verify draft creation, editing, context aggregation, finalization, immutability, explicit references, and repository isolation.
- Email adapter tests verify demo mode, configured-provider status, unavailable-provider behavior, and no-send/no-reply enforcement.
- Route-handler tests cover success, validation errors, unknown IDs, invalid triage actions, cross-repository access, reset/migration behavior, and provider availability.
- Second Brain tests verify only explicit new links among signals, Work Items, Artifacts, Skills, Routines, Handoffs, and Repository Contexts.
- Browser tests use the existing Playwright suite as prior art. They cover Inbox capture and triage, conversion to Work Item, Focus Board filtering/actions, handoff draft/finalization, repository switching, provenance inspection, and desktop/mobile overflow.
- Browser tests use demo/manual signal fixtures and isolated repository contexts, never real credentials or the developer's personal email.
- Validation remains `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, and `npm run build`, with all commands required to exit successfully.

## Out of Scope

- Sending, replying to, deleting, or composing Email.
- Full Gmail, Outlook, or other provider-specific email clients.
- Hosted authentication, shared Workspaces, permissions, invitations, or multi-user collaboration.
- Cloud synchronization, hosted databases, or distributed background workers.
- Automatic session-end detection or automatic Handoff creation.
- A general-purpose project-management suite or arbitrary custom board columns.
- Automatic conversion of every Incoming Signal into a Work Item.
- A general-purpose Micro App marketplace.
- New AI model-provider billing, team governance, or an AI gateway.
- Reordering the Command Centre layout.
- Automatic migration from the previous Python application's `.memory` directory.

## Further Notes

- This is a multi-session milestone. The implementation order is Agent Inbox and Incoming Signal, provider-neutral demo Email/manual-note adapters, Work Item triage, Today / Focus Board, Session Handoff, then Second Brain integration, browser coverage, migration/reset validation, and documentation.
- The Phase Three success metric is reduced daily context switching and a reliable signal-to-action-to-handoff loop for one developer across multiple local repositories.
- The Inbox/Work Queue split is intentional: Inbox handles unprocessed context; Work Queue handles committed action.
- Demo Email signals are sufficient to validate the product loop before any provider credential decision is made.
- Finalized Handoffs are historical snapshots, not live dashboards. This keeps session history trustworthy.
