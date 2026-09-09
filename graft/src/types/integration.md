# src/types/integration.ts

- IntegrationStatus · type · L1-L1 — type IntegrationStatus = "connected" | "healthy" | "unhealthy" | "unconfigured" | "deferred" | "available" | "disabled" | "error";
- IntegrationAdapterStatus · type · L3-L12 — type IntegrationAdapterStatus = { id: string; name: string; kind: "local" | "scm" | "issue-tracker" | "chat" | "email" | "observability" | "cloud" | "identity" | "database"; required: boolean; status: IntegrationStatus; capabilities: string[]; setup?: string; message: string; };
