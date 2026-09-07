# 33: Operational Event Contract

**What to build:** The system accepts scheduled and provider observations through one repository-scoped event model, deduplicates repeated delivery, persists event history, and exposes events in a user-visible operational view.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Scheduled and provider observations are represented by one normalized Operational Event contract.
- [ ] Events retain trigger type, source/provider, capability, timestamp, source identifier, and Repository Context.
- [ ] Repeated delivery is deduplicated without losing the first source evidence.
- [ ] Events are persisted and listed through a typed API.
- [ ] A user can inspect the event and its provenance in the command centre.
- [ ] Unit, route, and browser tests cover success, malformed input, deduplication, and repository isolation.