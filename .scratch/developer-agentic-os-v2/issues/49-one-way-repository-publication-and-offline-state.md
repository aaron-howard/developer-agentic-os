# 49: One-Way Repository Publication And Offline State

**What to build:** A connected repository publishes local-derived state and freshness metadata to hosted storage; when the connector is offline, hosted-safe workflows continue while local workflows become visibly pending and stale state cannot authorize provider mutations.

**Blocked by:** 45: Hosted Domain Persistence; 48: Connector Capability Grants

**Status:** ready-for-agent

- [ ] A granted connector publishes Repository Context snapshots one way to hosted state.
- [ ] Published local-derived data includes freshness and source metadata.
- [ ] Hosted-owned records remain writable only through hosted APIs.
- [ ] Hosted-safe workflows continue while local-repository workflows become pending offline.
- [ ] Historical data is visibly stale and cannot authorize provider mutations.
- [ ] Reconnection resumes pending work safely without bidirectional conflict merging.
- [ ] Unit, route, connector, and browser tests cover publication, freshness, offline state, and isolation.