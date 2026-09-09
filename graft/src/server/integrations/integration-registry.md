# src/server/integrations/integration-registry.ts

- getIntegrationStatuses · function · L6-L65 — async function getIntegrationStatuses(root = process.cwd(), env: Record<string, string | undefined> = process.env): Promise<IntegrationAdapterStatus[]>
- deferred · function · L67-L83 — function deferred( id: string, name: string, kind: IntegrationAdapterStatus["kind"], capabilities: string[], ): IntegrationAdapterStatus
