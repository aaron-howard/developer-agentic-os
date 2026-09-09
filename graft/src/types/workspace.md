# src/types/workspace.ts

- RepositoryContext · type · L3-L7 — type RepositoryContext = { id: string; name: string; path: string; };
- RepositorySwitcherEntry · type · L9-L11 — type RepositorySwitcherEntry = RepositoryContext & { git: GitStatus; };
- Workspace · type · L13-L16 — type Workspace = { repositories: RepositoryContext[]; activeRepositoryId: string | null; };
