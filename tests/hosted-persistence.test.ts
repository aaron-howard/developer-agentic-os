import assert from "node:assert/strict";
import test from "node:test";

import { EncryptedProtectedSecretStore, hostedDatabaseUrl } from "../src/server/hosted-persistence/neon-hosted-provider";
import type { HostedState, HostedStateProvider } from "../src/server/hosted-domain/hosted-domain-store";
import { HostedDomainStore } from "../src/server/hosted-domain/hosted-domain-store";
import type { HostedWorkspaceState, HostedWorkspaceStateProvider } from "../src/server/hosted-workspaces/hosted-workspace-store";
import { HostedWorkspaceStore } from "../src/server/hosted-workspaces/hosted-workspace-store";

const emptyDomainState = (): HostedState => ({ repositories: {}, records: {}, relationships: {}, snapshots: {}, connectors: [], credentials: [], audit: [] });
const emptyWorkspaceState = (): HostedWorkspaceState => ({ users: {}, audit: [] });

class MemoryDomainProvider implements HostedStateProvider {
  constructor(private state: HostedState) {}
  async read(): Promise<HostedState> { return structuredClone(this.state); }
  async write(state: HostedState): Promise<void> { this.state = structuredClone(state); }
}

class MemoryWorkspaceProvider implements HostedWorkspaceStateProvider {
  constructor(private state: HostedWorkspaceState) {}
  async read(): Promise<HostedWorkspaceState> { return structuredClone(this.state); }
  async write(state: HostedWorkspaceState): Promise<void> { this.state = structuredClone(state); }
}

test("hosted stores persist through injected deterministic providers", async () => {
  const workspaceProvider = new MemoryWorkspaceProvider(emptyWorkspaceState());
  const domainProvider = new MemoryDomainProvider(emptyDomainState());
  const workspaceStore = new HostedWorkspaceStore(process.cwd(), workspaceProvider);
  const domainStore = new HostedDomainStore(process.cwd(), workspaceStore, domainProvider, undefined, undefined, { put: async () => "test-secret-reference" });
  const workspace = await domainStore.createWorkspace("alice", "Neon-shaped fixture");
  const repository = await domainStore.registerRepository("alice", workspace.id, "D:/repos/app");
  const record = await domainStore.putRecord("alice", workspace.id, "workItems", { repositoryId: repository.id, title: "Persisted" });

  assert.equal((await workspaceStore.list("alice"))[0].id, workspace.id);
  assert.equal((await domainStore.listRecords("alice", workspace.id, "workItems"))[0].id, record.id);
  assert.equal((await domainStore.listRepositories("alice", workspace.id))[0].id, repository.id);
});

test("production database configuration is explicit and credential encryption fails closed", async () => {
  const environment = process.env as Record<string, string | undefined>;
  const previousUrl = environment.DEV_AGENTIC_OS_DATABASE_URL;
  const previousUnpooled = environment.DEV_AGENTIC_OS_DATABASE_URL_UNPOOLED;
  const previousKey = environment.DEV_AGENTIC_OS_SECRET_KEY;
  try {
    delete environment.DEV_AGENTIC_OS_DATABASE_URL;
    delete environment.DEV_AGENTIC_OS_DATABASE_URL_UNPOOLED;
    assert.throws(() => hostedDatabaseUrl(), /DEV_AGENTIC_OS_DATABASE_URL/);
    delete environment.DEV_AGENTIC_OS_SECRET_KEY;
    assert.throws(() => new EncryptedProtectedSecretStore(), /DEV_AGENTIC_OS_SECRET_KEY/);
    environment.DEV_AGENTIC_OS_SECRET_KEY = Buffer.alloc(32, 7).toString("base64url");
    const store = new EncryptedProtectedSecretStore();
    const reference = await store.put("secret-value");
    assert.equal(reference.includes("secret-value"), false);
    assert.equal(store.decrypt(reference), "secret-value");
  } finally {
    if (previousUrl === undefined) delete environment.DEV_AGENTIC_OS_DATABASE_URL; else environment.DEV_AGENTIC_OS_DATABASE_URL = previousUrl;
    if (previousUnpooled === undefined) delete environment.DEV_AGENTIC_OS_DATABASE_URL_UNPOOLED; else environment.DEV_AGENTIC_OS_DATABASE_URL_UNPOOLED = previousUnpooled;
    if (previousKey === undefined) delete environment.DEV_AGENTIC_OS_SECRET_KEY; else environment.DEV_AGENTIC_OS_SECRET_KEY = previousKey;
  }
});