# 38: Event-Triggered Diagnosis

**What to build:** A Sentry, GitHub, or Vercel failure creates or updates an Operational Incident, invokes a typed diagnostic Skill, and produces a linked Artifact, Skill Run, or Work Item.

**Blocked by:** 34: Operational Incident Grouping; 36: Local Scheduled Automation; 37: Sentry Event Ingestion

**Status:** ready-for-agent

- [ ] A provider failure can trigger an eligible diagnostic workflow.
- [ ] The workflow creates or attaches an Incoming Signal and Operational Incident.
- [ ] Diagnosis invokes a Skill through the existing Skill Registry.
- [ ] Diagnostic outputs retain event, signal, Incident, and Repository Context provenance.
- [ ] Diagnostic failure is visible and does not masquerade as successful recovery.
- [ ] Unit, route, and browser tests demonstrate one complete event-triggered diagnosis path.