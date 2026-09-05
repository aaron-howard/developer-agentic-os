import type { GitStatus } from "./repo-memory";

export type RepositoryContext = {
  id: string;
  name: string;
  path: string;
};

export type RepositorySwitcherEntry = RepositoryContext & {
  git: GitStatus;
};

export type Workspace = {
  repositories: RepositoryContext[];
  activeRepositoryId: string | null;
};