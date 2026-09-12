import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";

import { Pool, type PoolClient } from "@neondatabase/serverless";

import type {
  HostedState,
  HostedStateProvider,
  ProtectedSecretStore,
} from "@/server/hosted-domain/hosted-domain-store";
import type {
  HostedWorkspaceState,
  HostedWorkspaceStateProvider,
} from "@/server/hosted-workspaces/hosted-workspace-store";

const schema = `
CREATE TABLE IF NOT EXISTS developer_agentic_os_hosted_state (
  tenant_id text NOT NULL,
  state_key text NOT NULL,
  state jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, state_key)
);
CREATE TABLE IF NOT EXISTS developer_agentic_os_workspace_state (
  tenant_id text NOT NULL,
  state_key text NOT NULL,
  state jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, state_key)
);
ALTER TABLE developer_agentic_os_hosted_state ADD COLUMN IF NOT EXISTS tenant_id text NOT NULL DEFAULT 'legacy';
ALTER TABLE developer_agentic_os_workspace_state ADD COLUMN IF NOT EXISTS tenant_id text NOT NULL DEFAULT 'legacy';
ALTER TABLE developer_agentic_os_hosted_state DROP CONSTRAINT IF EXISTS developer_agentic_os_hosted_state_pkey;
ALTER TABLE developer_agentic_os_workspace_state DROP CONSTRAINT IF EXISTS developer_agentic_os_workspace_state_pkey;
CREATE UNIQUE INDEX IF NOT EXISTS developer_agentic_os_hosted_state_tenant_key ON developer_agentic_os_hosted_state (tenant_id, state_key);
CREATE UNIQUE INDEX IF NOT EXISTS developer_agentic_os_workspace_state_tenant_key ON developer_agentic_os_workspace_state (tenant_id, state_key);`;

const emptyHostedState = (): HostedState => ({
  repositories: {},
  records: {},
  relationships: {},
  snapshots: {},
  connectors: [],
  credentials: [],
  audit: [],
});
const emptyWorkspaceState = (): HostedWorkspaceState => ({ users: {}, audit: [] });

export function hostedDatabaseUrl(): string {
  const url =
    process.env.DEV_AGENTIC_OS_DATABASE_URL ??
    process.env.DATABASE_URL ??
    process.env.DEV_AGENTIC_OS_DATABASE_URL_UNPOOLED ??
    process.env.DATABASE_URL_UNPOOLED;
  if (!url)
    throw new Error(
      "Hosted persistence requires DATABASE_URL, DATABASE_URL_UNPOOLED, DEV_AGENTIC_OS_DATABASE_URL, or DEV_AGENTIC_OS_DATABASE_URL_UNPOOLED."
    );
  return url;
}

export class NeonHostedStateProvider implements HostedStateProvider {
  private readonly pool = new Pool({ connectionString: hostedDatabaseUrl() });
  private readonly transactionClient = new AsyncLocalStorage<PoolClient>();
  private ready: Promise<void> | undefined;

  constructor(private readonly tenantId: string) {
    if (!tenantId.trim()) throw new Error("Hosted persistence requires a tenant ID.");
  }

  async read(): Promise<HostedState> {
    await this.ensureSchema();
    const client = this.transactionClient.getStore() ?? this.pool;
    const result = await client.query<{ state: HostedState }>(
      "SELECT state FROM developer_agentic_os_hosted_state WHERE tenant_id = $1 AND state_key = $2",
      [this.tenantId, "default"]
    );
    return result.rows[0]?.state ?? emptyHostedState();
  }
  async write(state: HostedState): Promise<void> {
    await this.ensureSchema();
    const client = this.transactionClient.getStore();
    if (!client) return this.withMutationLock(() => this.write(state));
    await client.query(
      "INSERT INTO developer_agentic_os_hosted_state (tenant_id, state_key, state) VALUES ($1, $2, $3::jsonb) ON CONFLICT (tenant_id, state_key) DO UPDATE SET state = EXCLUDED.state, updated_at = now()",
      [this.tenantId, "default", JSON.stringify(state)]
    );
  }
  async withMutationLock<T>(operation: () => Promise<T>): Promise<T> {
    await this.ensureSchema();
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
        `developer_agentic_os_hosted_state:${this.tenantId}`,
      ]);
      const result = await this.transactionClient.run(client, operation);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  async close(): Promise<void> {
    await this.pool.end();
  }
  private ensureSchema(): Promise<void> {
    return (this.ready ??= this.pool.query(schema).then(() => undefined));
  }
}

export class NeonHostedWorkspaceStateProvider implements HostedWorkspaceStateProvider {
  private readonly pool = new Pool({ connectionString: hostedDatabaseUrl() });
  private readonly transactionClient = new AsyncLocalStorage<PoolClient>();
  private ready: Promise<void> | undefined;

  constructor(private readonly tenantId: string) {
    if (!tenantId.trim()) throw new Error("Hosted persistence requires a tenant ID.");
  }

  async read(): Promise<HostedWorkspaceState> {
    await this.ensureSchema();
    const client = this.transactionClient.getStore() ?? this.pool;
    const result = await client.query<{ state: HostedWorkspaceState }>(
      "SELECT state FROM developer_agentic_os_workspace_state WHERE tenant_id = $1 AND state_key = $2",
      [this.tenantId, "default"]
    );
    return result.rows[0]?.state ?? emptyWorkspaceState();
  }
  async write(state: HostedWorkspaceState): Promise<void> {
    await this.ensureSchema();
    const client = this.transactionClient.getStore();
    if (!client) return this.withMutationLock(() => this.write(state));
    await client.query(
      "INSERT INTO developer_agentic_os_workspace_state (tenant_id, state_key, state) VALUES ($1, $2, $3::jsonb) ON CONFLICT (tenant_id, state_key) DO UPDATE SET state = EXCLUDED.state, updated_at = now()",
      [this.tenantId, "default", JSON.stringify(state)]
    );
  }
  async withMutationLock<T>(operation: () => Promise<T>): Promise<T> {
    await this.ensureSchema();
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
        `developer_agentic_os_workspace_state:${this.tenantId}`,
      ]);
      const result = await this.transactionClient.run(client, operation);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  async close(): Promise<void> {
    await this.pool.end();
  }
  private ensureSchema(): Promise<void> {
    return (this.ready ??= this.pool.query(schema).then(() => undefined));
  }
}

export class EncryptedProtectedSecretStore implements ProtectedSecretStore {
  private readonly key = this.loadKey();

  async put(secret: string): Promise<string> {
    if (!secret) throw new Error("Credential secret is required.");
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.key, iv);
    const ciphertext = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
    return `encrypted-secret:v1:${iv.toString("base64url")}:${cipher.getAuthTag().toString("base64url")}:${ciphertext.toString("base64url")}`;
  }

  decrypt(reference: string): string {
    const [, version, ivValue, tagValue, ciphertextValue] = reference.split(":");
    if (version !== "v1" || !ivValue || !tagValue || !ciphertextValue)
      throw new Error("Invalid protected secret reference.");
    const decipher = createDecipheriv("aes-256-gcm", this.key, Buffer.from(ivValue, "base64url"));
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
    return Buffer.concat([
      decipher.update(Buffer.from(ciphertextValue, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  }

  private loadKey(): Buffer {
    const value = process.env.DEV_AGENTIC_OS_SECRET_KEY;
    if (!value) throw new Error("Credential mutations require DEV_AGENTIC_OS_SECRET_KEY.");
    const key = Buffer.from(value, "base64url");
    if (key.length !== 32)
      throw new Error("DEV_AGENTIC_OS_SECRET_KEY must be a base64url-encoded 32-byte key.");
    return key;
  }
}

export function isHostedNeonConfigured(): boolean {
  return Boolean(
    process.env.DEV_AGENTIC_OS_DATABASE_URL ??
    process.env.DATABASE_URL ??
    process.env.DEV_AGENTIC_OS_DATABASE_URL_UNPOOLED ??
    process.env.DATABASE_URL_UNPOOLED
  );
}

export function isHostedJsonFixtureMode(): boolean {
  return (
    (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") &&
    process.env.HOSTED_JSON_FIXTURE_MODE === "true"
  );
}
