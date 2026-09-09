# ADR 0004: Vercel Webhook Routing to Tenants

**Status**: Proposed

**Date**: 2026-09-09

## Context

Vercel fires webhooks for deployment events (started, succeeded, failed). In a multi-tenant system, we must route each webhook to the correct tenant/organization.

**Challenge**: Vercel webhooks don't inherently know which Clerk org they belong to. We need a mechanism to infer the tenant from the webhook payload.

## Decision

We will use **Vercel project ID ↔ tenant mapping** to route webhooks:

### Webhook Routing Flow

1. **Vercel fires a webhook** for a deployment event (e.g., `deployment.ready`)
   ```json
   {
     "type": "deployment.ready",
     "deploymentId": "dpl_...",
     "projectId": "prj_abc123",
     "meta": {
       "githubCommitSha": "abc123...",
       "githubOrg": "acme-corp",
       "githubRepo": "main-app"
     }
   }
   ```

2. **Our webhook endpoint receives it**
   ```
   POST /api/webhooks/vercel
   ```

3. **Look up tenant by Vercel project ID**
   ```sql
   SELECT tenant_id FROM vercel_projects
   WHERE vercel_project_id = 'prj_abc123'
   ```

4. **Process the event in that tenant's context**
   - Create deployment record with `tenant_id`
   - Update artifacts or work items scoped to that tenant
   - Send notifications to that org's members

### Database Schema

Extend `vercel_projects` table with webhook routing:

```sql
CREATE TABLE vercel_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  vercel_project_id VARCHAR(255) NOT NULL,
  vercel_team_id VARCHAR(255),
  domain VARCHAR(255),
  webhook_secret VARCHAR(255), -- HMAC secret for webhook validation
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (tenant_id, vercel_project_id),
  INDEX idx_vercel_project (vercel_project_id)
);

-- Store deployment events
CREATE TABLE deployment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES organizations(id),
  vercel_project_id VARCHAR(255) NOT NULL,
  vercel_deployment_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- 'ready', 'error', etc.
  status VARCHAR(50), -- 'success', 'failed', 'running'
  url VARCHAR(255),
  commit_sha VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (tenant_id, vercel_deployment_id),
  INDEX idx_tenant_deployments (tenant_id),
  INDEX idx_vercel_project_id (vercel_project_id)
);
```

### Webhook Handler

```typescript
// POST /api/webhooks/vercel
export async function POST(req: Request) {
  const body = await req.json();
  const signature = req.headers.get("x-vercel-signature");

  // 1. Look up tenant by Vercel project ID
  const vercelProject = await db.vercel_projects.findUnique({
    where: { vercel_project_id: body.projectId }
  });

  if (!vercelProject) {
    // Project not registered; ignore or warn
    return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 });
  }

  // 2. Verify webhook signature (optional but recommended)
  const isValid = verifyWebhookSignature(body, signature, vercelProject.webhook_secret);
  if (!isValid) {
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 401 });
  }

  // 3. Process event in tenant context
  const tenantId = vercelProject.tenant_id;
  await handleDeploymentEvent(tenantId, body);

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

async function handleDeploymentEvent(tenantId: UUID, event: any) {
  // Record the deployment
  await db.deployment_events.create({
    tenant_id: tenantId,
    vercel_project_id: event.projectId,
    vercel_deployment_id: event.deploymentId,
    event_type: event.type,
    status: event.deployment?.state,
    url: event.deployment?.url,
    commit_sha: event.meta?.githubCommitSha
  });

  // Create a signal or work item if deployment failed
  if (event.deployment?.state === "error") {
    await createFailureSignal(tenantId, event);
  }

  // Emit to connected developers (via WebSocket, polling, etc.)
  await notifyTenant(tenantId, {
    type: "deployment_event",
    event: event
  });
}
```

## Webhook Event Types

Vercel sends several event types. We track:

| Event | Action |
|-------|--------|
| `deployment.ready` | Deployment succeeded; show live URL |
| `deployment.error` | Build or deploy failed; create Incoming Signal |
| `deployment.created` | Build started; show status |
| `comment.created` | (Future) Comment on PR from Vercel checks |

For v1, we handle `ready` (success) and `error` (failure).

## Security Considerations

### Webhook Secret Validation

Vercel signs each webhook with an HMAC. We validate it:

```typescript
function verifyWebhookSignature(
  body: any,
  signature: string,
  secret: string
): boolean {
  const json = JSON.stringify(body);
  const hash = crypto
    .createHmac("sha256", secret)
    .update(json)
    .digest("hex");
  
  return signature === hash;
}
```

### Store Secret Securely

- Generate a random secret when the Vercel project is registered
- Store encrypted in Neon (use `pgcrypto` or application-level encryption)
- Rotate secrets periodically

### Authenticate Webhook Origin

Even with signature validation:
- Only accept webhooks from Vercel's IP ranges (optional but extra layer)
- Log all webhook attempts for audit

## Failure Modes

| Scenario | Response |
|----------|----------|
| Webhook arrives but project not found in DB | 404; log for investigation |
| Signature invalid | 401; log as potential security issue |
| Deployment event stored but tenant notification fails | 200 anyway; alert ops |

## Related Decisions

- **ADR 0001**: Multi-tenancy with tenant_id
- **ADR 0003**: Per-tenant Vercel deployments
- **ADR 0002**: Clerk org → tenant mapping

## Open Questions

1. Should webhook events trigger automatic Work Items or Artifacts?
   - *Current lean*: Create an Incoming Signal (triage first); user decides on action
   - *Alternative*: Auto-create Work Item for failed deployments if configured

2. Should we support custom webhooks per tenant (so each org sees only their events)?
   - *Deferred*: Single endpoint is simpler for v1; per-tenant webhooks later if needed

3. How long should we retain deployment event history?
   - *Deferred*: Store indefinitely for now; add retention policy later

## References

- Vercel Webhooks: https://vercel.com/docs/integrations/webhooks
- HMAC validation: https://nodejs.org/api/crypto.html
- Neon encryption: https://neon.tech/docs/manage/sensitive-data
