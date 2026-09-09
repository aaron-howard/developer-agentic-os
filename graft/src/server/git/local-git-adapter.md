# src/server/git/local-git-adapter.ts

- LocalGitAdapter · class · L8-L53 — class LocalGitAdapter
- constructor · method · L9-L9 — constructor(private readonly root = process.cwd())
- getStatus · method · L11-L36 — async getStatus(): Promise<GitStatus>
- changedFiles · method · L38-L42 — async changedFiles(baseBranch = "main"): Promise<string[]>
- runGit · method · L44-L52 — private async runGit(args: string[]): Promise<{ ok: boolean; stdout: string; stderr: string }>
