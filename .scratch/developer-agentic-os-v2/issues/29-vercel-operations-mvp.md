# 29: Vercel Operations MVP

**What to build:** Let the developer inspect the active application's Vercel deployments, build logs, and runtime logs from the command centre using a local environment credential.

**Blocked by:** 27: Integration Health Foundation

**Status:** ready-for-agent

- [x] Deployment status is visible for the configured Vercel project.
- [x] Build logs can be opened for a deployment without leaving the operations context.
- [x] Runtime logs can be opened for the configured project or deployment.
- [x] Missing, invalid, rate-limited, timed-out, and unavailable Vercel credentials produce actionable normalized states.
- [x] Project and repository context remain associated with the correct Repository Context.
- [x] Deterministic adapter, route, and browser tests cover success and provider failure behavior.

**Status:** completed
