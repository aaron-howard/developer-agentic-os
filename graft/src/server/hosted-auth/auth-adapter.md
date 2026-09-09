# src/server/hosted-auth/auth-adapter.ts

- AuthError · class · L4-L9 — class AuthError extends Error
- constructor · method · L5-L8 — constructor(readonly code: "UNAUTHENTICATED", message = "Authentication is required.")
- AuthAdapter · interface · L11-L13 — interface AuthAdapter
- HostedTokenVerifier · interface · L15-L17 — interface HostedTokenVerifier
- UnconfiguredHostedTokenVerifier · class · L19-L24 — class UnconfiguredHostedTokenVerifier implements HostedTokenVerifier
- verify · method · L20-L23 — async verify(token: string): Promise<HostedIdentity | null>
- TokenAuthAdapter · class · L26-L36 — class TokenAuthAdapter implements AuthAdapter
- constructor · method · L27-L27 — constructor(private readonly verifier: HostedTokenVerifier)
- authenticate · method · L29-L35 — async authenticate(request: Request): Promise<HostedIdentity>
- DeterministicAuthAdapter · class · L38-L48 — class DeterministicAuthAdapter implements AuthAdapter
- constructor · method · L39-L39 — constructor(private readonly fixtureMode = (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development") && process.env.HOSTED_AUTH_FIXTURE_MODE === "true")
- authenticate · method · L41-L47 — async authenticate(request: Request): Promise<HostedIdentity>
- ClerkAuthAdapter · class · L50-L57 — class ClerkAuthAdapter implements AuthAdapter
- authenticate · method · L51-L56 — async authenticate(request: Request): Promise<HostedIdentity>
- authenticate · method · L63-L69 — authenticate(request)
