## Integration Operations Layer

**Status:** implemented and validated through tickets 27–31.

## Problem Statement

Developer Workflow OS v2 is a personal-first Agentic OS for monitoring and acting across repositories. The command centre already coordinates Repository Contexts, Work Items, Agent Inbox, Skills, Routines, Artifacts, and Second Brain memory, but external integrations are mostly deferred and GitHub currently exposes only limited metadata.

The user needs one operations surface that shows whether the applications and development work are healthy, while keeping GitHub, Vercel, Sentry, Cloudflare, and the other services as the systems of record. Problems should become actionable context inside the Agentic OS rather than isolated status cards.

## Solution

Build a provider-neutral Integration Operations layer scoped to the active Repository Context. GitHub and Vercel receive the first actionable MVP. The remaining daily tools begin as explicit health, setup, or deferred states and gain actions later without changing the dashboard's core contract.

Unhealthy integration results appear in the command centre and can be converted into an Incoming Signal and then a linked Work Item. Dashboard-load refresh and explicit manual refresh are both supported.

Local development uses environment tokens. The adapter boundary remains suitable for future hosted OAuth and encrypted per-user credentials, but hosted credential management is not part of this milestone.

## User Stories

1. As a solo developer, I want to see integration health for the active repository, so that I can identify problems without opening every provider dashboard.
2. As a solo developer, I want to switch repository context before viewing integration data, so that signals and actions belong to the correct repository.
3. As a solo developer, I want GitHub Issues visible in the command centre, so that repository work is part of my operating picture.
4. As a solo developer, I want GitHub Pull Requests visible, so that review work and merge readiness are visible beside local branch state.
5. As a solo developer, I want GitHub Actions status visible, so that failed automation is caught from the command centre.
6. As a solo developer, I want GitHub merge status visible, so that I can see whether a change is ready to merge.
7. As a solo developer, I want Vercel deployments visible, so that I can see whether the application is successfully deployed.
8. As a solo developer, I want Vercel build logs available from the operations view, so that I can diagnose failed builds without losing context.
9. As a solo developer, I want Vercel runtime logs available, so that I can investigate deployed application failures.
10. As a solo developer, I want integration data refreshed on dashboard load, so that the initial view reflects current provider state.
11. As a solo developer, I want to manually refresh integration data, so that I can verify a fix immediately.
12. As a solo developer, I want missing credentials clearly identified, so that setup problems are not mistaken for provider outages.
13. As a solo developer, I want timeouts, authentication failures, rate limits, and unavailable services distinguished, so that I know what action to take.
14. As a solo developer, I want unhealthy provider results to create Incoming Signals, so that operational problems enter the same triage flow as other incoming context.
15. As a solo developer, I want to create a Work Item from an integration signal, so that a failure becomes an explicit commitment.
16. As a solo developer, I want the original signal preserved when I create a Work Item, so that the work retains its source and history.
17. As a solo developer, I want staged integrations to show honest health or setup state, so that deferred capabilities are not presented as working actions.
18. As a solo developer, I want Sentry, Cloudflare, CodeRabbit, WorkOS, Clerk, Convex, NeonDB, Upstash, Email, and Slack represented in the operations surface, so that the dashboard reflects the tools I use daily.
19. As a future hosted user, I want the integration contract to support provider-specific credentials without redesigning the command centre, so that local-first development can evolve into a sellable product.
20. As a future hosted user, I want credentials isolated from repository data and never displayed as status content, so that production connections can be handled securely.
21. As a solo developer, I want existing Skills, Routines, Artifacts, Inbox, Work Items, and Second Brain relationships to remain intact, so that integration work improves the OS instead of fragmenting it.
22. As a solo developer, I want integration data isolated between repositories, so that one repository's outage or credentials cannot appear in another repository's context.
23. As a solo developer, I want the operations layer disableable by provider, so that a failed integration rollout does not disable the rest of the Agentic OS.

## Implementation Decisions

- Use the existing Integration Registry as the highest test seam. Provider adapters normalize external responses into a shared operations result containing provider identity, repository identity, capability, health state, timestamps, source identifiers, and normalized failure information.
- Keep Local Git as the mandatory local integration and preserve the existing optional GitHub status behavior while adding the GitHub MVP capabilities.
- Add GitHub and Vercel as actionable providers. GitHub covers Issues, Pull Requests, Actions, and merge status. Vercel covers deployments, build logs, and runtime logs.
- Represent Sentry, Cloudflare, CodeRabbit, WorkOS, Clerk, Convex, NeonDB, Upstash, Email, and Slack as staged health integrations with no unsupported action controls.
- Use environment tokens for local development. GitHub accepts `GITHUB_TOKEN` or `GH_TOKEN`; Vercel uses an environment token. Missing credentials map to an explicit unconfigured or available state with setup guidance.
- Keep provider operations separate from the existing system-of-record services. The OS reads provider state and creates local Incoming Signals, Work Items, Skill Runs, or Artifacts when the user chooses.
- Extend Incoming Signal source handling to include integration-originated signals while preserving the source record and provider event identifier.
- Use existing Work Item context references to link a Work Item back to its Incoming Signal, Repository Context, provider, and source event.
- Scope every provider request, response, signal, and Work Item action to the active Repository Context.
- Support refresh on dashboard load and explicit manual refresh through the operations route boundary.
- Normalize provider failures into distinguishable states for missing credentials, timeout, authentication failure, rate limit, unavailable service, and provider-reported unhealthy status.
- Keep OAuth and encrypted per-user credential storage as a future production boundary. Do not add hosted authentication to this milestone.
- Gate each provider behind its adapter registration or feature flag so an individual provider can be disabled without deleting local state or affecting other workflows.
- Preserve the existing command-centre visual direction and Agentic OS vocabulary. This work adds operations capability; it does not replace the dashboard with provider-specific pages.

## Testing Decisions

- Test externally observable behavior at the highest available seam: normalized Integration Registry results, route contracts, persisted signal linkage, and visible dashboard behavior.
- Prefer deterministic fake provider responses over live network calls. Tests must cover successful responses, missing credentials, timeout, authentication failure, rate limit, unavailable provider, and provider-reported unhealthy status.
- Extend the existing integration registry tests for provider registration, status mapping, repository isolation, and credential states.
- Extend the existing API route contract tests for operations responses, refresh behavior, and provider-scoped errors.
- Extend the existing Incoming Signal tests for integration sources, source identifiers, repository isolation, and conversion to linked Work Items.
- Add browser coverage for initial operations loading, manual refresh, unhealthy status, staged integration presentation, and creating a Work Item from a signal.
- Preserve the current test style: Node test runner and `tsx` for unit and route tests, with Playwright for browser behavior.
- Do not assert provider SDK internals, implementation-specific helper calls, or live provider availability.

## Out of Scope

- Replacing GitHub, Vercel, Sentry, Cloudflare, or any other provider.
- Full action support for staged integrations.
- OAuth, hosted credential management, encrypted per-user credential storage, and team permissions in this milestone.
- Automatic remediation, automatic deployments, or destructive provider mutations.
- Team accounts, billing, collaboration, or a multi-user SaaS control plane.
- Provider-specific dashboards that duplicate the source applications.
- Adding integrations not listed in the agreed staged set.

## Further Notes

- The application remains useful locally without external credentials.
- The first release is for one developer but should preserve the architectural path to a product that can be sold later.
- The integration table supplied by the user is the roadmap input. GitHub and Vercel are the first actionable providers; all other listed tools are initially health-oriented or staged.
- The current codebase already provides the preferred seams: Integration Registry, route handlers, Incoming Signal Store, Work Item Store, and repository-context isolation.
- Issue publication requires a configured repository remote and the project's `ready-for-agent` triage label vocabulary. The local spec remains the source until those are available.
- The shipped implementation is tracked by the completed local issue [26](../.scratch/developer-agentic-os-v2/issues/26-integration-operations-layer.md) and child tickets 27–31.
