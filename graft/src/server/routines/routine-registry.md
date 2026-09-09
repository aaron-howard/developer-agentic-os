# src/server/routines/routine-registry.ts

- RoutineRegistryOptions · type · L8-L14 — type RoutineRegistryOptions = { root?: string; artifactStore?: ArtifactStore; skillRunStore?: SkillRunStore; historyStore?: RoutineHistoryStore; now?: () => Date; };
- createRoutineRegistry · function · L24-L91 — function createRoutineRegistry(options: RoutineRegistryOptions = {})
- listRoutines · method · L35-L48 — async listRoutines(): Promise<RoutineDefinition[]>
- runRoutine · method · L50-L71 — async runRoutine(id: string, options: { source?: RoutineExecutionSource } = {}): Promise<RoutineRunResult>
- pauseRoutine · method · L73-L78 — async pauseRoutine(id: string): Promise<RoutineDefinition>
- resumeRoutine · method · L80-L85 — async resumeRoutine(id: string): Promise<RoutineDefinition>
- listExecutions · method · L87-L89 — async listExecutions(options?: { limit?: number; routineId?: string })
- builtIn · function · L95-L97 — function builtIn(id: string, name: string, description: string, scheduleLabel: string, skillId: string): RoutineDefinition
- placeholder · function · L99-L101 — function placeholder(id: string, name: string, description: string, scheduleLabel: string): RoutineDefinition
- nextDueAt · function · L103-L108 — function nextDueAt(scheduleLabel: string, lastRun: Date): Date
