# 27: Integration Health Foundation

**What to build:** Give the command centre one refreshable operations view for the active Repository Context. It should show Local Git plus the listed external integrations with honest connected, healthy, unhealthy, unconfigured, or deferred states and setup guidance.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] The operations view lists Local Git, GitHub, Vercel, Sentry, Cloudflare, CodeRabbit, WorkOS, Clerk, Convex, NeonDB, Upstash, Email, and Slack.
- [x] Dashboard-load refresh and explicit manual refresh return current normalized integration state.
- [x] Missing credentials, provider errors, and deferred integrations are distinguishable and do not crash the dashboard.
- [x] Results are scoped to the active Repository Context.
- [x] Existing Integration Registry and route contract tests cover status mapping, refresh, credentials, failures, and repository isolation.

**Status:** completed
