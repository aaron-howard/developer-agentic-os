# src/server/workspace/repository-context.ts

- RepositoryContextInput · type · L9-L14 — type RepositoryContextInput = { repositoryId?: unknown; contextId?: unknown; repositoryRoot?: unknown; root?: unknown; };
- resolveRepositoryContext · function · L16-L41 — async function resolveRepositoryContext(input: RepositoryContextInput = {}): Promise<RepositoryContext>
- contextFromRoot · function · L43-L53 — async function contextFromRoot(inputRoot: string): Promise<RepositoryContext>
- repositoryId · function · L55-L58 — function repositoryId(root: string): string
