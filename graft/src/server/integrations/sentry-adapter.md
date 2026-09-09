# src/server/integrations/sentry-adapter.ts

- SentryHealthState · type · L4-L4 — type SentryHealthState = "healthy" | "unconfigured" | "authentication" | "timeout" | "rate_limit" | "unavailable" | "unhealthy";
- SentryObservation · type · L5-L5 — type SentryObservation = { state: SentryHealthState; project: string | null; sourceId: string | null; title: string; observedAt: string; details: Record<string, unknown> };
- SentryFetch · type · L7-L7 — type SentryFetch = (input: string, init?: RequestInit) => Promise<Response>;
- SentryIssue · type · L8-L8 — type SentryIssue = { id?: unknown; title?: unknown; culprit?: unknown; firstSeen?: unknown; lastSeen?: unknown; count?: unknown; level?: unknown };
- SentryAdapter · class · L10-L52 — class SentryAdapter
- constructor · method · L11-L11 — constructor(private readonly env: Record<string, string | undefined> = process.env, private readonly fetcher: SentryFetch = fetch as SentryFetch, private readonly repositoryRoot?: string)
- getObservations · method · L13-L31 — async getObservations(): Promise<SentryObservation[]>
- failure · method · L33-L33 — private failure(state: SentryHealthState, project: string | null, title: string): SentryObservation
- contextConfig · method · L35-L51 — private async contextConfig(): Promise<{ token?: string; organization?: string; project?: string }>
- stringValue · function · L54-L54 — function stringValue(value: unknown): string | null
