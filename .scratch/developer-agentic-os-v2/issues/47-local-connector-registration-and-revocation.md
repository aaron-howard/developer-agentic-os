# 47: Local Connector Registration And Revocation

**What to build:** A developer can register an outbound local connector, see its connection state, revoke it, and verify that expired or revoked connectors can no longer access hosted Workspaces.

**Blocked by:** 44: Hosted Identity And Private Workspaces; 45: Hosted Domain Persistence

**Status:** ready-for-agent

- [ ] A local connector registers through an outbound authenticated flow.
- [ ] Connector identity, expiry, and connection state are visible without exposing secrets.
- [ ] A developer can revoke a connector immediately.
- [ ] Expired and revoked connectors are rejected at the hosted boundary.
- [ ] Connector registration, use, expiry, and revocation are auditable.
- [ ] Unit, route, connector-fixture, and browser tests cover lifecycle and isolation.