# src/server/repo-memory/repo-memory.ts

- refreshRepoMemorySnapshot · function · L11-L26 — async function refreshRepoMemorySnapshot(root = process.cwd()): Promise<RepoMemorySnapshot>
- getRepoMemorySnapshot · function · L28-L31 — async function getRepoMemorySnapshot(root = process.cwd()): Promise<RepoMemorySnapshot>
- listAreas · function · L33-L36 — async function listAreas(root: string): Promise<string[]>
- listRepoFiles · function · L38-L42 — async function listRepoFiles(root: string): Promise<RepoMemoryFile[]>
- walk · function · L44-L56 — async function walk(current: string, output: RepoMemoryFile[], root: string): Promise<void>
- classifyFile · function · L58-L66 — function classifyFile(name: string, path: string): RepoMemoryFile["kind"]
