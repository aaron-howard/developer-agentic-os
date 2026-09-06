# 30: Integration Failure Triage

**What to build:** Turn an unhealthy integration result into an Agent Inbox signal and, when chosen, a linked Work Item while preserving provider and repository provenance.

**Blocked by:** 27: Integration Health Foundation

**Status:** ready-for-agent

- [x] An unhealthy provider result can create an Incoming Signal with provider, source event, repository, timestamp, and failure details.
- [x] Duplicate refreshes do not create uncontrolled duplicate signals for the same provider event.
- [x] A developer can create a Work Item from the signal without deleting or replacing the signal.
- [x] The Work Item links back to the Incoming Signal, provider event, and Repository Context.
- [x] Signal and Work Item actions reject cross-repository access.
- [x] Store, route, and browser tests cover creation, linkage, duplicate handling, and isolation.

**Status:** completed
