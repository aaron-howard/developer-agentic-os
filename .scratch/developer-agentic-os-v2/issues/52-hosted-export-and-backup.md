# 52: Hosted Export And Backup

**What to build:** A developer can export hosted Workspaces, Artifacts, relationships, provenance, approvals, and audit history into a restorable backup package without exposing credentials.

**Blocked by:** 45: Hosted Domain Persistence; 46: Local Data Export And Selective Import

**Status:** ready-for-agent

- [ ] A developer can export a selected hosted Workspace or its records.
- [ ] The backup includes relationships, provenance, Artifact references, approvals, and audit history.
- [ ] Credentials and secret values are excluded from the backup.
- [ ] The package is versioned, reviewable, and suitable for restoration.
- [ ] Export failures are retryable without partial data being presented as complete.
- [ ] Unit, route, and browser tests cover export contents, secret exclusion, and restoration metadata.