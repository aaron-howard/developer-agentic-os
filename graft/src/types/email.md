# src/types/email.ts

- EmailProviderMessage · type · L4-L10 — type EmailProviderMessage = { id: string; subject: string; body?: string; sender?: string; receivedAt?: string; };
- EmailAdapterResult · type · L12-L15 — type EmailAdapterResult = { integration: IntegrationAdapterStatus; signals: IncomingSignal[]; };
- EmailAdapter · type · L17-L21 — type EmailAdapter = { getStatus(): IntegrationAdapterStatus; listMessages(): Promise<EmailProviderMessage[]>; sync(repositoryId: string): Promise<EmailAdapterResult>; };
