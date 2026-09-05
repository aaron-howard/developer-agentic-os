import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

import { ArtifactStore } from "../src/server/artifacts/artifact-store";
import { buildSecondBrainGraph } from "../src/server/second-brain/second-brain-graph";
import { refreshRepoMemorySnapshot } from "../src/server/repo-memory/repo-memory";
import { WorkItemStore } from "../src/server/work-items/work-item-store";
import { repositoryId } from "../src/server/workspace/repository-context";
import type { GraphLinkType, GraphNodeType } from "../src/types/second-brain";

const execFileAsync = promisify(execFile);

async function createGitRepo() {
  const root = await mkdtemp(join(tmpdir(), "developer-agentic-os-graph-"));
  await execFileAsync("git", ["init", "-b", "main"], { cwd: root });
  await execFileAsync("git", ["config", "user.name", "Test User"], { cwd: root });
  await execFileAsync("git", ["config", "user.email", "test@example.com"], { cwd: root });
  await writeFile(join(root, "README.md"), "hello\n", "utf8");
  await writeFile(join(root, "CONTEXT.md"), "# Context\n", "utf8");
  await mkdir(join(root, "src"));
  await writeFile(join(root, "src", "index.ts"), "export const ok = true;\n", "utf8");
  await execFileAsync("git", ["add", "."], { cwd: root });
  await execFileAsync("git", ["commit", "-m", "initial"], { cwd: root });
  return root;
}

test("second brain graph contains repo, area, file, artifact, and skill nodes", async () => {
  const root = await createGitRepo();
  try {
    await refreshRepoMemorySnapshot(root);
    const artifact = await new ArtifactStore(root).createArtifact({
      name: "Repo Summary",
      type: "repo_summary",
      content: "summary",
      tags: ["repo-summary"],
      contextRefs: [{ kind: "file", ref: "README.md" }],
    });

    const graph = await buildSecondBrainGraph(root);
    const nodeTypes = new Set(graph.nodes.map((node) => node.type));
    assert.deepEqual(((["repo", "area", "file", "artifact", "skill"] as GraphNodeType[]).every((type) => nodeTypes.has(type))), true);
    assert.ok(graph.nodes.some((node) => node.id === `artifact:${artifact.id}`));
    assert.ok(graph.nodes.some((node) => node.id === "skill:repo-summary"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("second brain graph includes contains, references, produced, and used_context links", async () => {
  const root = await createGitRepo();
  try {
    await refreshRepoMemorySnapshot(root);
    await new ArtifactStore(root).createArtifact({
      name: "Repo Summary",
      type: "repo_summary",
      content: "summary",
      tags: ["repo-summary"],
      contextRefs: [{ kind: "file", ref: "README.md" }],
    });

    const graph = await buildSecondBrainGraph(root);
    const linkTypes = new Set(graph.links.map((link) => link.type));
    for (const type of ["contains", "references", "produced", "used_context"] as GraphLinkType[]) {
      assert.equal(linkTypes.has(type), true);
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("second brain graph connects durable work items, routines, and workflow provenance", async () => {
  const root = await createGitRepo();
  try {
    await refreshRepoMemorySnapshot(root);
    const workItem = await new WorkItemStore(root).create({ title: "Ship graph", repositoryId: repositoryId(root), contextRefs: [{ kind: "file", ref: "README.md" }] });
    const registry = (await import("../src/server/routines/routine-registry")).createRoutineRegistry({ root });
    const routineRun = await registry.runRoutine("nightly_repo_digest", { source: "local_background" });
    const graph = await buildSecondBrainGraph(root);
    const nodeTypes = new Set(graph.nodes.map((node) => node.type));
    assert.equal(nodeTypes.has("work_item"), true);
    assert.equal(nodeTypes.has("routine"), true);
    assert.ok(graph.nodes.some((node) => node.id === `work_item:${workItem.id}`));
    assert.ok(graph.links.some((link) => link.source === `work_item:${workItem.id}` && link.target === "file:README.md" && link.type === "references"));
    assert.ok(graph.links.some((link) => link.source === "routine:nightly_repo_digest" && link.type === "triggers"));
    assert.ok(graph.links.some((link) => link.source === "routine:nightly_repo_digest" && link.target === `artifact:${routineRun.artifactIds[0]}` && link.type === "produced"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});