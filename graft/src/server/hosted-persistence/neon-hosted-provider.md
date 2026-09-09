# src/server/hosted-persistence/neon-hosted-provider.ts

- emptyHostedState · function · L20-L20 — emptyHostedState = (): HostedState
- emptyWorkspaceState · function · L21-L21 — emptyWorkspaceState = (): HostedWorkspaceState
- hostedDatabaseUrl · function · L23-L27 — function hostedDatabaseUrl(): string
- NeonHostedStateProvider · class · L29-L37 — class NeonHostedStateProvider implements HostedStateProvider
- read · method · L33-L33 — async read(): Promise<HostedState>
- write · method · L34-L34 — async write(state: HostedState): Promise<void>
- close · method · L35-L35 — async close(): Promise<void>
- ensureSchema · method · L36-L36 — private ensureSchema(): Promise<void>
- NeonHostedWorkspaceStateProvider · class · L39-L47 — class NeonHostedWorkspaceStateProvider implements HostedWorkspaceStateProvider
- read · method · L43-L43 — async read(): Promise<HostedWorkspaceState>
- write · method · L44-L44 — async write(state: HostedWorkspaceState): Promise<void>
- close · method · L45-L45 — async close(): Promise<void>
- ensureSchema · method · L46-L46 — private ensureSchema(): Promise<void>
- EncryptedProtectedSecretStore · class · L49-L69 — class EncryptedProtectedSecretStore implements ProtectedSecretStore
- put · method · L52-L58 — async put(secret: string): Promise<string>
- decrypt · method · L60-L66 — decrypt(reference: string): string
- loadKey · method · L68-L68 — private loadKey(): Buffer
- isHostedNeonConfigured · function · L71-L71 — function isHostedNeonConfigured(): boolean
