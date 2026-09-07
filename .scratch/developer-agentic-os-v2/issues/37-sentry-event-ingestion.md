# 37: Sentry Event Ingestion

**What to build:** Configured or fixture-backed Sentry health and error results enter the operational workflow with normalized provider states, deduplication, repository scope, and read-only behavior.

**Blocked by:** 33: Operational Event Contract; 35: Repository Automation Policies

**Status:** ready-for-agent

- [ ] Sentry reports read-only health and error observations through the Operational Event contract.
- [ ] Configured success, authentication failure, timeout, rate-limit, unavailable, and unhealthy states are distinguishable.
- [ ] Sentry source identifiers and observed timestamps are retained.
- [ ] Sentry events are deduplicated and scoped to the active Repository Context.
- [ ] Deterministic fixtures cover provider responses without live-service dependence.
- [ ] Unit, route, and browser tests verify that no Sentry mutation or send operation is exposed.