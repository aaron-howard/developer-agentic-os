# src/app/api/hosted/domain/route.ts

- HostedDomainBody · type · L11-L13 — type HostedDomainBody = { action?: unknown; workspaceId?: unknown; connectorId?: unknown; credentialId?: unknown; repositoryId?: unknown; capability?: unknown; skillId?: unknown; allowedPaths?: unknown; localPath?: unknown; data?: unknown; package?: unknown; selectedKinds?: unknown; selectedRepositoryIds?: unknown; description?: unknown; provider?: unknown; scopes?: unknown; secret?: unknown; expiresAt?: unknown; identity?: unknown; grantId?: unknown; requestedPath?: unknown; approval?: unknown; providerAction?: unknown; };
- GET · function · L15-L39 — async function GET(request: Request)
- POST · function · L41-L75 — async function POST(request: Request)
- isRecord · function · L77-L77 — function isRecord(value: unknown): value is Record<string, unknown>
- isStringArray · function · L78-L78 — function isStringArray(value: unknown, allowEmpty = false): value is string[]
- requiredString · function · L79-L79 — function requiredString(body: HostedDomainBody, key: keyof HostedDomainBody): boolean
- validateBody · function · L80-L105 — function validateBody(body: HostedDomainBody): string | null
- isMigrationPackage · function · L106-L106 — function isMigrationPackage(value: unknown): boolean
