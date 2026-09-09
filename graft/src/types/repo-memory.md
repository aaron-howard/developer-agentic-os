# src/types/repo-memory.ts

- GitStatus · type · L1-L7 — type GitStatus = { available: boolean; currentBranch: string | null; recentCommits: string[]; changedFiles: string[]; message: string; };
- RepoMemoryFile · type · L9-L12 — type RepoMemoryFile = { path: string; kind: "code" | "doc" | "config" | "test" | "asset" | "other"; };
- RepoMemorySnapshot · type · L14-L21 — type RepoMemorySnapshot = { repoName: string; repoPath: string; refreshedAt: string; files: RepoMemoryFile[]; areas: string[]; git: GitStatus; };
