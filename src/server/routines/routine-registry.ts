import { ArtifactStore } from "../artifacts/artifact-store";
import { SkillRunStore } from "../skill-runs/skill-run-store";
import { createSkillRegistry } from "../skills/skill-registry";
import { RoutineHistoryStore } from "./routine-history-store";
import type { RoutineDefinition, RoutineExecutionSource, RoutineRunResult } from "@/types/routine";
import { contextFromRoot } from "../workspace/repository-context";

type RoutineRegistryOptions = {
  root?: string;
  artifactStore?: ArtifactStore;
  skillRunStore?: SkillRunStore;
  historyStore?: RoutineHistoryStore;
  now?: () => Date;
};

const routineDefinitions: RoutineDefinition[] = [
  builtIn("nightly_repo_digest", "Nightly Repo Digest", "Summarize the repo at the end of the day.", "nightly", "repo-summary"),
  builtIn("weekly_sprint_digest", "Weekly Sprint Digest", "Summarize recent work for the week.", "weekly", "sprint-digest"),
  builtIn("release_readiness_scan", "Release Readiness Scan", "Check shipping confidence and blockers.", "daily", "release-readiness"),
  placeholder("stale_branch_check", "Stale Branch Check", "Find stale or forgotten branch work.", "weekly"),
  placeholder("artifact_cleanup", "Artifact Cleanup", "Review local artifact retention.", "weekly"),
];

export function createRoutineRegistry(options: RoutineRegistryOptions = {}) {
  const root = options.root ?? process.cwd();
  const history = options.historyStore ?? new RoutineHistoryStore(root);
  const now = options.now ?? (() => new Date());
  const skills = createSkillRegistry({
    root,
    artifactStore: options.artifactStore ?? new ArtifactStore(root),
    runStore: options.skillRunStore ?? new SkillRunStore(root),
  });

  return {
    async listRoutines(): Promise<RoutineDefinition[]> {
      return Promise.all(routineDefinitions.map(async (routine, index) => {
        const executions = await history.listExecutions({ routineId: routine.id, limit: 1 });
        const latest = executions[0];
        const lastRunAt = latest?.startedAt ?? null;
        return {
          ...routine,
          status: await history.isPaused(routine.id) ? "paused" : index === 0 ? "next" : routine.status,
          lastRunAt,
          nextDueAt: lastRunAt ? nextDueAt(routine.scheduleLabel, new Date(lastRunAt)).toISOString() : now().toISOString(),
          lastExecutionSource: latest?.source ?? null,
        };
      }));
    },

    async runRoutine(id: string, options: { source?: RoutineExecutionSource } = {}): Promise<RoutineRunResult> {
      const routine = routineDefinitions.find((item) => item.id === id);
      if (!routine) throw new Error(`Unknown routine: ${id}`);
      await contextFromRoot(root);
      const execution = await history.createExecution(id, { source: options.source ?? "manual", startedAt: now().toISOString() });

      if (routine.kind === "placeholder" || !routine.skillId) {
        const failed = await history.completeExecution(execution, { status: "failed", error: "Placeholder routine does not have executable behavior yet." });
        return { status: "failed", execution: failed, artifactIds: [], error: failed.error };
      }

      const skillResult = await skills.runSkill(routine.skillId, {}, { workflowRefs: [{ kind: "routine", ref: routine.id, label: routine.name }] });
      const artifactIds = skillResult.run.artifactId ? [skillResult.run.artifactId] : [];
      const completed = await history.completeExecution(execution, {
        status: skillResult.status === "succeeded" ? "succeeded" : "failed",
        artifactIds,
        skillRunId: skillResult.run.id,
        error: skillResult.run.error,
        completedAt: now().toISOString(),
      });
      return { status: completed.status, execution: completed, artifactIds, error: completed.error };
    },

    async pauseRoutine(id: string): Promise<RoutineDefinition> {
      const routine = routineDefinitions.find((item) => item.id === id);
      if (!routine) throw new Error(`Unknown routine: ${id}`);
      await history.pauseRoutine(id);
      return { ...routine, status: "paused" };
    },

    async resumeRoutine(id: string): Promise<RoutineDefinition> {
      const routine = routineDefinitions.find((item) => item.id === id);
      if (!routine) throw new Error(`Unknown routine: ${id}`);
      await history.resumeRoutine(id);
      return { ...routine, status: "queued" };
    },

    async listExecutions(options?: { limit?: number; routineId?: string }) {
      return history.listExecutions(options);
    },
  };
}

export const routineRegistry = createRoutineRegistry();

function builtIn(id: string, name: string, description: string, scheduleLabel: string, skillId: string): RoutineDefinition {
  return { id, name, description, scheduleLabel, kind: "built-in", executionMode: "local_background", status: "queued", skillId };
}

function placeholder(id: string, name: string, description: string, scheduleLabel: string): RoutineDefinition {
  return { id, name, description, scheduleLabel, kind: "placeholder", executionMode: "manual", status: "queued", skillId: null };
}

function nextDueAt(scheduleLabel: string, lastRun: Date): Date {
  const next = new Date(lastRun);
  if (scheduleLabel === "weekly") next.setUTCDate(next.getUTCDate() + 7);
  else next.setUTCDate(next.getUTCDate() + 1);
  return next;
}