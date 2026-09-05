import { mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

export const localStoreDirectoryName = ".developer-agentic-os";

export type LocalStorePaths = {
  root: string;
  storeRoot: string;
  workspace: string;
  artifacts: string;
  repoMemory: string;
  skillRuns: string;
  routines: string;
  workItems: string;
};

export function getLocalStorePaths(root = process.cwd()): LocalStorePaths {
  const resolvedRoot = resolve(root);
  const storeRoot = resolve(resolvedRoot, localStoreDirectoryName);

  return {
    root: resolvedRoot,
    storeRoot,
    workspace: resolve(storeRoot, "workspace.json"),
    artifacts: resolve(storeRoot, "artifacts"),
    repoMemory: resolve(storeRoot, "repo-memory"),
    skillRuns: resolve(storeRoot, "skill-runs"),
    routines: resolve(storeRoot, "routines"),
    workItems: resolve(storeRoot, "work-items.json"),
  };
}

export async function initializeLocalStore(root = process.cwd()): Promise<LocalStorePaths> {
  const paths = getLocalStorePaths(root);
  await Promise.all([
    mkdir(paths.storeRoot, { recursive: true }),
    mkdir(paths.artifacts, { recursive: true }),
    mkdir(paths.repoMemory, { recursive: true }),
    mkdir(paths.skillRuns, { recursive: true }),
    mkdir(paths.routines, { recursive: true }),
  ]);
  return paths;
}

export async function resetLocalStore(root = process.cwd()): Promise<LocalStorePaths> {
  const paths = getLocalStorePaths(root);
  await rm(paths.storeRoot, { recursive: true, force: true });
  return initializeLocalStore(root);
}