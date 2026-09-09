# src/server/email/email-adapter.ts

- LocalEmailAdapter · class · L12-L47 — class LocalEmailAdapter implements EmailAdapter
- constructor · method · L16-L19 — constructor(private readonly root = process.cwd(), private readonly env: Record<string, string | undefined> = process.env)
- getStatus · method · L21-L23 — getStatus(): IntegrationAdapterStatus
- listMessages · method · L25-L27 — async listMessages(): Promise<EmailProviderMessage[]>
- sync · method · L33-L46 — async sync(repositoryId: string, context?: WorkspaceContext): Promise<{ integration: IntegrationAdapterStatus; signals: IncomingSignal[] }>
- parseConfiguredMessages · function · L51-L62 — function parseConfiguredMessages(env: Record<string, string | undefined>): EmailProviderMessage[] | null
- isEmailMessage · function · L64-L68 — function isEmailMessage(value: unknown): value is EmailProviderMessage
- emailStatus · function · L70-L76 — function emailStatus(env: Record<string, string | undefined>, messages: EmailProviderMessage[] | null): IntegrationAdapterStatus
- baseStatus · function · L78-L80 — function baseStatus(status: IntegrationAdapterStatus["status"], message: string): IntegrationAdapterStatus
- formatBody · function · L82-L86 — function formatBody(message: EmailProviderMessage): string
