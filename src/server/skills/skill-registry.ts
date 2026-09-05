import { ArtifactStore } from "../artifacts/artifact-store";
import { LocalGitAdapter } from "../git/local-git-adapter";
import { getRepoMemorySnapshot, refreshRepoMemorySnapshot } from "../repo-memory/repo-memory";
import { SkillRunStore } from "../skill-runs/skill-run-store";
import type { SkillCommand, SkillHandlerResult, SkillRunResult } from "@/types/skill";
import type { WorkflowReference } from "@/types/artifact";
import { contextFromRoot } from "../workspace/repository-context";

type SkillRegistryOptions = {
  root?: string;
  artifactStore?: ArtifactStore;
  runStore?: SkillRunStore;
};

type SkillHandler = (input: Record<string, string>) => Promise<SkillHandlerResult>;

const builtInSkills: SkillCommand[] = [
  command("repo-summary", "/repo-summary", "Repo Summary", "Summarize the current repository.", []),
  command("branch-summary", "/branch-summary", "Branch Summary", "Summarize branch changes against a base branch.", [
    { name: "baseBranch", label: "Base branch", required: true },
    { name: "targetBranch", label: "Target branch", required: true },
  ]),
  command("release-readiness", "/release-readiness", "Release Readiness", "Assess release readiness from local repo signals.", []),
  command("implementation-checklist", "/implementation-checklist", "Implementation Checklist", "Create a checklist from work item text.", [
    { name: "workItem", label: "Work item text", required: true },
  ]),
  command("sprint-digest", "/sprint-digest", "Sprint Digest", "Summarize recent repository motion.", []),
];

const placeholderSkills: SkillCommand[] = [
  placeholder("newsletter", "/newsletter", "Newsletter"),
  placeholder("games", "/games", "Games"),
  placeholder("clean-up", "/clean-up", "Clean Up"),
];

export function createSkillRegistry(options: SkillRegistryOptions = {}) {
  const root = options.root ?? process.cwd();
  const artifacts = options.artifactStore ?? new ArtifactStore(root);
  const runs = options.runStore ?? new SkillRunStore(root);
  const handlers: Record<string, SkillHandler> = {
    "repo-summary": async () => {
      const snapshot = await refreshRepoMemorySnapshot(root);
      return artifact("Repo Summary", "repo_summary", {
        repoName: snapshot.repoName,
        fileCount: snapshot.files.length,
        areas: snapshot.areas,
        git: snapshot.git,
      }, ["repo-summary"]);
    },
    "branch-summary": async (input) => {
      requireInput(input, "baseBranch", "Base branch is required.");
      requireInput(input, "targetBranch", "Target branch is required.");
      const git = new LocalGitAdapter(root);
      const changedFiles = await git.changedFiles(input.baseBranch);
      const status = await git.getStatus();
      return artifact("Branch Summary", "branch_summary", {
        baseBranch: input.baseBranch,
        targetBranch: input.targetBranch,
        currentBranch: status.currentBranch,
        changedFiles,
        summary: `Branch ${input.targetBranch} has ${changedFiles.length} changed file(s) against ${input.baseBranch}.`,
      }, ["branch-summary"]);
    },
    "release-readiness": async () => {
      const snapshot = await getRepoMemorySnapshot(root);
      const blockers = snapshot.git.available ? [] : ["Local git is unavailable."];
      if (snapshot.git.changedFiles.length === 0) blockers.push("No changed files detected.");
      const score = Math.max(0, 100 - blockers.length * 25);
      return artifact("Release Readiness", "release_readiness", {
        repoName: snapshot.repoName,
        score,
        status: blockers.length ? "watch" : "ready",
        blockers,
        changedFiles: snapshot.git.changedFiles,
      }, ["release-readiness"]);
    },
    "implementation-checklist": async (input) => {
      requireInput(input, "workItem", "Work item text is required.");
      return artifact("Implementation Checklist", "implementation_checklist", {
        workItem: input.workItem,
        checklist: [
          "Map the likely implementation surface.",
          "Write or update behavior tests.",
          "Implement the smallest vertical slice.",
          "Run lint, typecheck, tests, and build.",
        ],
      }, ["implementation-checklist"]);
    },
    "sprint-digest": async () => {
      const snapshot = await getRepoMemorySnapshot(root);
      return artifact("Sprint Digest", "sprint_digest", {
        repoName: snapshot.repoName,
        recentCommits: snapshot.git.recentCommits,
        changedFiles: snapshot.git.changedFiles,
        summary: `${snapshot.repoName} has ${snapshot.git.changedFiles.length} changed file(s) and ${snapshot.git.recentCommits.length} recent commit(s).`,
      }, ["sprint-digest"]);
    },
  };

  return {
    listSkills(): SkillCommand[] {
      return [...builtInSkills, ...placeholderSkills];
    },

    async runSkill(id: string, input: Record<string, string> = {}, options: { workflowRefs?: WorkflowReference[] } = {}): Promise<SkillRunResult> {
      const skill = builtInSkills.find((item) => item.id === id) ?? placeholderSkills.find((item) => item.id === id);
      if (!skill) throw new Error(`Unknown skill: ${id}`);
      await contextFromRoot(root);
      const run = await runs.createRun(skill, input);

      if (skill.kind === "placeholder") {
        return failRun(runs, { ...run, status: "running" }, "Placeholder skills do not have executable handlers yet.");
      }

      try {
        await runs.updateRun({ ...run, status: "running" });
        for (const field of skill.inputs.filter((field) => field.required)) requireInput(input, field.name, `${field.label} is required.`);
        const output = await handlers[skill.id](input);
        const artifactEntry = await artifacts.createArtifact({
          ...output,
          provenance: {
            repositoryId: run.repositoryId ?? "",
            repositoryRoot: run.repositoryRoot ?? root,
            workflowRefs: [{ kind: "skill", ref: skill.id, label: skill.label }, ...(options.workflowRefs ?? [])],
          },
        });
        const completed = await runs.updateRun({
          ...run,
          status: "succeeded",
          artifactId: artifactEntry.id,
          completedAt: new Date().toISOString(),
        });
        return { status: "succeeded", run: completed };
      } catch (error) {
        return failRun(runs, { ...run, status: "running" }, error instanceof Error ? error.message : "Skill failed.");
      }
    },
  };
}

export const skillRegistry = createSkillRegistry();

function command(id: string, commandText: string, label: string, description: string, inputs: SkillCommand["inputs"]): SkillCommand {
  return { id, command: commandText, label, description, model: "sonnet", effort: "medium", kind: "built-in", inputs, status: "ready" };
}

function placeholder(id: string, commandText: string, label: string): SkillCommand {
  return { id, command: commandText, label, description: "Placeholder skill for a later build.", model: "opus", effort: "xhigh", kind: "placeholder", inputs: [], status: "placeholder" };
}

function artifact(name: string, type: string, content: SkillHandlerResult["content"], tags: string[]): SkillHandlerResult {
  return { name, type, content, tags };
}

function requireInput(input: Record<string, string>, key: string, message: string): void {
  if (!input[key]?.trim()) throw new Error(message);
}

async function failRun(runStore: SkillRunStore, run: Awaited<ReturnType<SkillRunStore["createRun"]>>, error: string): Promise<SkillRunResult> {
  const failed = await runStore.updateRun({ ...run, status: "failed", artifactId: null, error, completedAt: new Date().toISOString() });
  return { status: "failed", run: failed };
}