import type { ArtifactIndexEntry } from "@/types/artifact";
import type { GraphLink, GraphNode, SecondBrainGraph } from "@/types/second-brain";
import { ArtifactStore } from "../artifacts/artifact-store";
import { getRepoMemorySnapshot } from "../repo-memory/repo-memory";
import { createSkillRegistry } from "../skills/skill-registry";
import { createRoutineRegistry } from "../routines/routine-registry";
import { RoutineHistoryStore } from "../routines/routine-history-store";
import { WorkItemStore } from "../work-items/work-item-store";
import { repositoryId } from "../workspace/repository-context";

export async function buildSecondBrainGraph(root = process.cwd()): Promise<SecondBrainGraph> {
  const snapshot = await getRepoMemorySnapshot(root);
  const artifacts = await new ArtifactStore(root).listArtifacts({ limit: 100 });
  const skills = createSkillRegistry({ root }).listSkills().filter((skill) => skill.kind === "built-in");
  const contextId = repositoryId(root);
  const workItems = await new WorkItemStore(root).list({ repositoryId: contextId });
  const routines = await createRoutineRegistry({ root }).listRoutines();
  const executions = await new RoutineHistoryStore(root).listExecutions({ limit: 100 });
  const nodes = new Map<string, GraphNode>();
  const links: GraphLink[] = [];

  addNode(nodes, { id: "repo:root", type: "repo", label: snapshot.repoName, path: snapshot.repoPath, metadata: { repositoryId: contextId } });

  for (const area of snapshot.areas) {
    const areaId = `area:${area}`;
    addNode(nodes, { id: areaId, type: "area", label: area, path: area });
    links.push({ source: "repo:root", target: areaId, type: "contains" });
  }

  for (const file of snapshot.files) {
    const fileId = `file:${file.path}`;
    const area = file.path.includes("/") ? file.path.split("/")[0] : null;
    addNode(nodes, { id: fileId, type: "file", label: file.path.split("/").at(-1) ?? file.path, path: file.path, metadata: { kind: file.kind } });
    links.push({ source: area && snapshot.areas.includes(area) ? `area:${area}` : "repo:root", target: fileId, type: "contains" });
  }

  addReferenceLinks(snapshot.files.map((file) => file.path), links);

  for (const skill of skills) {
    addNode(nodes, { id: `skill:${skill.id}`, type: "skill", label: skill.command, metadata: { model: skill.model, effort: skill.effort } });
  }

  for (const workItem of workItems) {
    const workItemId = `work_item:${workItem.id}`;
    addNode(nodes, { id: workItemId, type: "work_item", label: workItem.title, metadata: { repositoryId: workItem.repositoryId, status: workItem.status, priority: workItem.priority } });
    links.push({ source: "repo:root", target: workItemId, type: "contains" });
    addContextReferenceLinks(workItem.contextRefs, workItemId, nodes, links);
  }

  for (const routine of routines) {
    const routineId = `routine:${routine.id}`;
    addNode(nodes, { id: routineId, type: "routine", label: routine.name, metadata: { schedule: routine.scheduleLabel, status: routine.status } });
    links.push({ source: "repo:root", target: routineId, type: "contains" });
    if (routine.skillId && nodes.has(`skill:${routine.skillId}`)) links.push({ source: routineId, target: `skill:${routine.skillId}`, type: "triggers" });
  }

  for (const artifact of artifacts) {
    addArtifact(nodes, links, artifact);
  }

  for (const execution of executions) {
    for (const artifactId of execution.artifactIds) {
      if (nodes.has(`routine:${execution.routineId}`) && nodes.has(`artifact:${artifactId}`)) links.push({ source: `routine:${execution.routineId}`, target: `artifact:${artifactId}`, type: "produced" });
    }
  }

  return { generatedAt: new Date().toISOString(), nodes: Array.from(nodes.values()), links: uniqueLinks(links) };
}

function addArtifact(nodes: Map<string, GraphNode>, links: GraphLink[], artifact: ArtifactIndexEntry): void {
  const artifactId = `artifact:${artifact.id}`;
  addNode(nodes, { id: artifactId, type: "artifact", label: artifact.name, metadata: { artifactType: artifact.type, createdAt: artifact.createdAt } });

  for (const tag of artifact.tags) {
    const skillId = `skill:${tag}`;
    if (nodes.has(skillId)) links.push({ source: skillId, target: artifactId, type: "produced" });
  }

  for (const contextRef of artifact.contextRefs) {
    addContextReferenceLinks([contextRef], artifactId, nodes, links, "used_context");
  }

  for (const workflowRef of artifact.provenance?.workflowRefs ?? []) {
    const target = `${workflowRef.kind}:${workflowRef.ref}`;
    if (nodes.has(target)) links.push({ source: target, target: artifactId, type: "produced" });
  }
}

function addContextReferenceLinks(references: Array<{ kind: string; ref: string }>, source: string, nodes: Map<string, GraphNode>, links: GraphLink[], type: GraphLink["type"] = "references"): void {
  for (const reference of references) {
    const target = `${reference.kind}:${reference.ref}`;
    if (nodes.has(target)) links.push({ source, target, type });
  }
}

function uniqueLinks(links: GraphLink[]): GraphLink[] {
  return Array.from(new Map(links.map((link) => [`${link.source}-${link.target}-${link.type}`, link])).values());
}

function addReferenceLinks(files: string[], links: GraphLink[]): void {
  const fileSet = new Set(files);
  if (fileSet.has("CONTEXT.md") && fileSet.has("README.md")) {
    links.push({ source: "file:CONTEXT.md", target: "file:README.md", type: "references" });
  }
}

function addNode(nodes: Map<string, GraphNode>, node: GraphNode): void {
  if (!nodes.has(node.id)) nodes.set(node.id, node);
}