# 34: Operational Incident Grouping

**What to build:** Related Operational Events and Incoming Signals appear as one Operational Incident while preserving every original signal, source identifier, timestamp, and Repository Context.

**Blocked by:** 33: Operational Event Contract

**Status:** ready-for-agent

- [ ] Related events can be correlated into a repository-scoped Operational Incident.
- [ ] Existing Incoming Signals remain durable and link to the Incident rather than being replaced.
- [ ] Incident inspection exposes all linked events, signals, providers, timestamps, and failure details.
- [ ] Duplicate events do not create uncontrolled duplicate Incidents or Signals.
- [ ] Cross-repository event and Incident access is rejected.
- [ ] Unit, route, and browser tests cover grouping, evidence preservation, deduplication, and isolation.