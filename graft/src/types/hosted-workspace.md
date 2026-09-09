# src/types/hosted-workspace.ts

- HostedIdentity · type · L1-L4 — type HostedIdentity = { userId: string; displayName: string; };
- HostedWorkspace · type · L6-L11 — type HostedWorkspace = { id: string; ownerId: string; name: string; createdAt: string; };
- HostedAuditAction · type · L13-L13 — type HostedAuditAction = "identity.authenticated" | "workspace.created" | "workspace.listed" | "workspace.selected";
- HostedAuditEvent · type · L15-L21 — type HostedAuditEvent = { id: string; action: HostedAuditAction; userId: string; workspaceId?: string; occurredAt: string; };
