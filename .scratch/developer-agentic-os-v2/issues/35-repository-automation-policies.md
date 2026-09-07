# 35: Repository Automation Policies

**What to build:** A developer can inspect and configure repository-local Automation Policies controlling enabled triggers, workflows, approval requirements, retry limits, and catch-up behavior without storing credentials.

**Blocked by:** 33: Operational Event Contract

**Status:** ready-for-agent

- [ ] Policies define schedule and provider-event triggers.
- [ ] Policies select eligible workflows and required approval behavior.
- [ ] Policies define bounded retry and restart catch-up limits.
- [ ] Policies can be enabled, disabled, inspected, and validated.
- [ ] Policy data is scoped to a Repository Context and contains no credentials.
- [ ] Unit, route, and browser tests cover valid, invalid, disabled, and cross-repository policies.