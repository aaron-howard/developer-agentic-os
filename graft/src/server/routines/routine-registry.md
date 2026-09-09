# src/server/routines/routine-registry.ts

- RoutineRegistryOptions · type · L10-L17 — type RoutineRegistryOptions = { context?: WorkspaceContext; root?: string; artifactStore?: ArtifactStore; skillRunStore?: SkillRunStore; historyStore?: RoutineHistoryStore; now?: () => Date; };
- createRoutineRegistry · function · L31-L109 — function createRoutineRegistry(options: RoutineRegistryOptions = {})
- listRoutines · method · L51-L66 — async listRoutines(): Promise<RoutineDefinition[]>
- runRoutine · method · L68-L89 — async runRoutine(id: string, options: { source?: RoutineExecutionSource } = {}): Promise<RoutineRunResult>
- pauseRoutine · method · L91-L96 — async pauseRoutine(id: string): Promise<RoutineDefinition>
- resumeRoutine · method · L98-L103 — async resumeRoutine(id: string): Promise<RoutineDefinition>
- listExecutions · method · L105-L107 — async listExecutions(options?: { limit?: number; routineId?: string })
- calculateNextDueAt · function · L111-L116 — function calculateNextDueAt(scheduleLabel: string, lastRun: Date): Date
