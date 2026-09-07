# 48: Connector Capability Grants

**What to build:** A developer can grant a connector access to selected Repository Contexts and capabilities, use Git metadata by default, grant filesystem access per Skill, and see every connector request recorded in audit history.

**Blocked by:** 47: Local Connector Registration And Revocation

**Status:** ready-for-agent

- [ ] Repository and capability grants are explicit, scoped, inspectable, and revocable.
- [ ] Git metadata is available by default within a granted Repository Context.
- [ ] Filesystem access requires an allowlist and per-Skill capability grant.
- [ ] Requests outside a grant are rejected without leaking data.
- [ ] Connector requests record Workspace, Repository Context, capability, outcome, and timestamp.
- [ ] Unit, connector-fixture, route, and browser tests cover least privilege and revocation.