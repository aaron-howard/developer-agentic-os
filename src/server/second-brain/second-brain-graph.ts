import type { ArtifactIndexEntry } from "@/types/artifact";
import type { GraphLink, GraphNode, SecondBrainGraph } from "@/types/second-brain";
import { ArtifactStore } from "../artifacts/artifact-store";
import { HandoffStore } from "../handoffs/handoff-store";
import { IncomingSignalStore } from "../incoming-signals/incoming-signal-store";
import { getRepoMemorySnapshot } from "../repo-memory/repo-memory";
import { createSkillRegistry } from "../skills/skill-registry";
import { SkillRunStore } from "../skill-runs/skill-run-store";
import { createRoutineRegistry } from "../routines/routine-registry";
import { RoutineHistoryStore } from "../routines/routine-history-store";
import { WorkItemStore } from "../work-items/work-item-store";
import { repositoryId } from "../workspace/repository-context";

export async function buildSecondBrainGraph(root = process.cwd()): Promise<SecondBrainGraph> {
  const contextId = repositoryId(root);
  const snapshot = await getRepoMemorySnapshot(root);
  const artifacts = await new ArtifactStore(root).listArtifacts({ limit: 100 });
  const signals = await new IncomingSignalStore(root).list({ repositoryId: contextId });
  const handoffs = await new HandoffStore(root).list(contextId);
  const skillRuns = await new SkillRunStore(root).listRuns({ limit: 100 });
  const skills = createSkillRegistry({ root }).listSkills().filter((skill) => skill.kind === "built-in");
  const workItems = await new WorkItemStore(root).list({ repositoryId: contextId });
  const routines = await createRoutineRegistry({ root }).listRoutines();
  const executions = await new RoutineHistoryStore(root).listExecutions({ limit: 100 });
  const nodes = new Map<string, GraphNode>();
  const links: GraphLink[] = [];

  addNode(nodes, { id: "repo:root", type: "repo", label: snapshot.repoName, path: snapshot.repoPath, metadata: { repositoryId: contextId } });
  const contextNodeId = `repo_context:${contextId}`;
  addNode(nodes, { id: contextNodeId, type: "repo_context", label: snapshot.repoName, path: snapshot.repoPath, metadata: { repositoryId: contextId } });
  links.push({ source: "repo:root", target: contextNodeId, type: "contains" });

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

  for (const skill of skills) {
    addNode(nodes, { id: `skill:${skill.id}`, type: "skill", label: skill.command, metadata: { model: skill.model, effort: skill.effort } });
  }

  for (const signal of signals) {
    const signalId = `incoming_signal:${signal.id}`;
    addNode(nodes, { id: signalId, type: "incoming_signal", label: signal.title, metadata: { repositoryId: signal.repositoryId, status: signal.status, source: signal.source } });
    links.push({ source: signalId, target: contextNodeId, type: "scoped_to" });
  }

  for (const workItem of workItems) {
    const workItemId = `work_item:${workItem.id}`;
    addNode(nodes, { id: workItemId, type: "work_item", label: workItem.title, metadata: { repositoryId: workItem.repositoryId, status: workItem.status, priority: workItem.priority } });
    links.push({ source: workItemId, target: contextNodeId, type: "scoped_to" });
    addContextReferenceLinks(workItem.contextRefs, workItemId, nodes, links);
  }

  for (const routine of routines) {
    const routineId = `routine:${routine.id}`;
    addNode(nodes, { id: routineId, type: "routine", label: routine.name, metadata: { schedule: routine.scheduleLabel, status: routine.status } });
    if (routine.skillId && nodes.has(`skill:${routine.skillId}`)) links.push({ source: routineId, target: `skill:${routine.skillId}`, type: "triggers" });
  }

  for (const artifact of artifacts) {
    addArtifact(nodes, links, artifact);
    if (artifact.repositoryId === contextId) links.push({ source: `artifact:${artifact.id}`, target: contextNodeId, type: "scoped_to" });
  }

  for (const run of skillRuns.filter((item) => item.repositoryId === contextId)) {
    if (run.artifactId && nodes.has(`skill:${run.skillId}`) && nodes.has(`artifact:${run.artifactId}`)) links.push({ source: `skill:${run.skillId}`, target: `artifact:${run.artifactId}`, type: "produced" });
  }

  for (const execution of executions.filter((item) => item.repositoryId === contextId)) {
    links.push({ source: `routine:${execution.routineId}`, target: contextNodeId, type: "scoped_to" });
    for (const artifactId of execution.artifactIds) {
      if (nodes.has(`routine:${execution.routineId}`) && nodes.has(`artifact:${artifactId}`)) links.push({ source: `routine:${execution.routineId}`, target: `artifact:${artifactId}`, type: "produced" });
    }
  }

  for (const handoff of handoffs) {
    const handoffId = `handoff:${handoff.id}`;
    addNode(nodes, { id: handoffId, type: "handoff", label: handoff.title, metadata: { repositoryId: handoff.snapshot.repositoryContext.id, status: handoff.status } });
    links.push({ source: handoffId, target: contextNodeId, type: "scoped_to" });
    for (const workItem of handoff.snapshot.workItems) {
      if (nodes.has(`work_item:${workItem.id}`)) links.push({ source: handoffId, target: `work_item:${workItem.id}`, type: "includes" });
    }
    for (const artifact of handoff.snapshot.artifacts) {
      if (nodes.has(`artifact:${artifact.id}`)) links.push({ source: handoffId, target: `artifact:${artifact.id}`, type: "includes" });
    }
    if (handoff.artifactId && nodes.has(`artifact:${handoff.artifactId}`)) links.push({ source: handoffId, target: `artifact:${handoff.artifactId}`, type: "finalized_as" });
  }

  return { generatedAt: new Date().toISOString(), nodes: Array.from(nodes.values()), links: uniqueLinks(links) };
}

function addArtifact(nodes: Map<string, GraphNode>, links: GraphLink[], artifact: ArtifactIndexEntry): void {
  const artifactId = `artifact:${artifact.id}`;
  addNode(nodes, { id: artifactId, type: "artifact", label: artifact.name, metadata: { artifactType: artifact.type, createdAt: artifact.createdAt } });

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

function addNode(nodes: Map<string, GraphNode>, node: GraphNode): void {
  if (!nodes.has(node.id)) nodes.set(node.id, node);
}