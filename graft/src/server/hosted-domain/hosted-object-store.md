# src/server/hosted-domain/hosted-object-store.ts

- HostedObjectStore · interface · L5-L8 — interface HostedObjectStore
- LocalHostedObjectStore · class · L10-L28 — class LocalHostedObjectStore implements HostedObjectStore
- constructor · method · L11-L11 — constructor(private readonly root = join(resolve(process.cwd()), ".developer-agentic-os", "hosted-objects"))
- put · method · L13-L19 — async put(content: string | Uint8Array, contentType: string)
- get · method · L21-L27 — async get(reference: string): Promise<Uint8Array>
