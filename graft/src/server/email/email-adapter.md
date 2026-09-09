# src/server/email/email-adapter.ts

- LocalEmailAdapter · class · L11-L42 — class LocalEmailAdapter implements EmailAdapter
- constructor · method · L15-L18 — constructor(private readonly root = process.cwd(), private readonly env: Record<string, string | undefined> = process.env)
- getStatus · method · L20-L22 — getStatus(): IntegrationAdapterStatus
- listMessages · method · L24-L26 — async listMessages(): Promise<EmailProviderMessage[]>
- sync · method · L28-L41 — async sync(repositoryId: string): Promise<{ integration: IntegrationAdapterStatus; signals: IncomingSignal[] }>
- parseConfiguredMessages · function · L46-L57 — function parseConfiguredMessages(env: Record<string, string | undefined>): EmailProviderMessage[] | null
- isEmailMessage · function · L59-L63 — function isEmailMessage(value: unknown): value is EmailProviderMessage
- emailStatus · function · L65-L71 — function emailStatus(env: Record<string, string | undefined>, messages: EmailProviderMessage[] | null): IntegrationAdapterStatus
- baseStatus · function · L73-L75 — function baseStatus(status: IntegrationAdapterStatus["status"], message: string): IntegrationAdapterStatus
- formatBody · function · L77-L81 — function formatBody(message: EmailProviderMessage): string
