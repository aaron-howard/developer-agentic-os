# src/types/workspace.ts

- RepositoryContext · type · L10-L14 — type RepositoryContext = { id: string; name: string; path: string; };
- RepositorySwitcherEntry · type · L16-L18 — type RepositorySwitcherEntry = RepositoryContext & { git: GitStatus; };
- Workspace · type · L20-L23 — type Workspace = { repositories: RepositoryContext[]; activeRepositoryId: string | null; };
- WorkspaceContext · type · L32-L41 — type WorkspaceContext = { root: string; paths: LocalStorePaths; artifactStore: ArtifactStore; handoffStore: HandoffStore; incomingSignalStore: IncomingSignalStore; skillRunStore: SkillRunStore; routineHistoryStore: RoutineHistoryStore; workItemStore: WorkItemStore; };
