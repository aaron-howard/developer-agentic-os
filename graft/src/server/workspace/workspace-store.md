# src/server/workspace/workspace-store.ts

- WorkspaceError · class · L12-L17 — class WorkspaceError extends Error
- constructor · method · L13-L16 — constructor(readonly code: "INVALID_PATH" | "NOT_FOUND", message: string)
- WorkspaceStore · class · L19-L84 — class WorkspaceStore
- constructor · method · L20-L20 — constructor(private readonly root = process.cwd())
- listRepositories · method · L22-L25 — async listRepositories(): Promise<RepositoryContext[]>
- getActiveContext · method · L27-L31 — async getActiveContext(): Promise<RepositoryContext>
- getContext · method · L33-L38 — async getContext(id: string): Promise<RepositoryContext>
- registerRepository · method · L40-L51 — async registerRepository(inputPath: string): Promise<RepositoryContext>
- removeRepository · method · L53-L64 — async removeRepository(id: string): Promise<void>
- setActiveContext · method · L66-L73 — async setActiveContext(id: string): Promise<RepositoryContext>
- readWorkspace · method · L75-L78 — private async readWorkspace(): Promise<Workspace>
- writeWorkspace · method · L80-L83 — private async writeWorkspace(workspace: Workspace): Promise<void>
- repositoryFromPath · function · L88-L103 — async function repositoryFromPath(inputPath: string): Promise<RepositoryContext>
- defaultContext · function · L105-L108 — function defaultContext(root: string): RepositoryContext
- repositoryId · function · L110-L113 — function repositoryId(path: string): string
