# 24: Provider-Neutral Email Adapter

**What to build:** Expose Email as a provider-neutral Communication Signal source with local/demo mode by default and transparent configured-provider status.

**Blocked by:** 20: Incoming Signal And Agent Inbox

**Status:** closed

- [x] Demo Email signals work without credentials.
- [x] Provider status reports connected, available, disabled, or error using existing Integration Adapter vocabulary.
- [x] Configured provider data maps into Incoming Signals without changing Inbox behavior.
- [x] Email has no send, reply, delete, or full-client actions.
- [x] Tests cover demo mode, provider availability, mapping, and no-send boundaries.

Implementation: added the typed read-only `EmailAdapter` boundary, local demo signals, configured JSON provider mapping via `EMAIL_PROVIDER` and `EMAIL_PROVIDER_DATA`, disabled mode via `EMAIL_ENABLED=false`, `/api/email` sync route, and integration registry status wiring. Validation passed for focused tests, full unit/route tests, typecheck, lint, production build, and focused desktop/mobile browser tests.
