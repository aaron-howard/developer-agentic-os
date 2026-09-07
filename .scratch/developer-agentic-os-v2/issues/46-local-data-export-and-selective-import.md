# 46: Local Data Export And Selective Import

**What to build:** A developer can generate a reviewable Migration Package, inspect its contents, select repositories and records, import them into a private Workspace, preserve relationships, and receive explicit warnings for legacy or missing provenance.

**Blocked by:** 45: Hosted Domain Persistence

**Status:** ready-for-agent

- [ ] Local state can be exported into a reviewable package without credentials.
- [ ] The package lists repositories, records, relationships, provenance, and legacy-data warnings.
- [ ] A developer can select repositories and records for import.
- [ ] Imported records map local path-derived identities to explicit hosted identities.
- [ ] Relationships and provenance are preserved; missing provenance is reported.
- [ ] Repeated or interrupted imports are safe and do not duplicate records.
- [ ] Unit, route, and browser tests cover export review, selective import, retry, and isolation.