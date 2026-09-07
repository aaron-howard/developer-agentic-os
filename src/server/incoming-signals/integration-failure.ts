import type { IncomingSignal } from "@/types/incoming-signal";
import { IncomingSignalStore } from "./incoming-signal-store";

const writeLocks = new Map<string, Promise<void>>();

export async function recordIntegrationFailure(
  root: string,
  input: { provider: string; sourceId: string; title: string; body: string; repositoryId: string },
): Promise<IncomingSignal> {
  const previous = writeLocks.get(root) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => { release = resolve; });
  const queued = previous.then(() => current);
  writeLocks.set(root, queued);
  await previous;
  try {
    const store = new IncomingSignalStore(root);
    const existing = (await store.list({ repositoryId: input.repositoryId, source: "integration" })).find((signal) => signal.sourceId === input.sourceId);
    return existing ?? await store.create({ source: "integration", provider: input.provider as "github" | "vercel" | "sentry", sourceId: input.sourceId, title: input.title, body: input.body, repositoryId: input.repositoryId });
  } finally {
    release();
    if (writeLocks.get(root) === queued) writeLocks.delete(root);
  }
}
