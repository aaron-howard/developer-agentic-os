# src/server/local-store/paths.ts

- LocalStorePaths · type · L6-L19 — type LocalStorePaths = { root: string; storeRoot: string; workspace: string; artifacts: string; repoMemory: string; skillRuns: string; routines: string; workItems: string; incomingSignals: string; handoffs: string; operational: string; workspaceOperational: string; };
- getLocalStorePaths · function · L21-L39 — function getLocalStorePaths(root = process.cwd()): LocalStorePaths
- initializeLocalStore · function · L41-L52 — async function initializeLocalStore(root = process.cwd()): Promise<LocalStorePaths>
- resetLocalStore · function · L54-L58 — async function resetLocalStore(root = process.cwd()): Promise<LocalStorePaths>
