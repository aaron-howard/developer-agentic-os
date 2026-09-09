# src/server/routines/routine-history-store.ts

- RoutineHistory · type · L9-L12 — type RoutineHistory = { executions: RoutineExecutionRecord[]; pausedRoutineIds: string[]; };
- RoutineHistoryStore · class · L16-L92 — class RoutineHistoryStore
- constructor · method · L20-L23 — constructor(private readonly root = process.cwd())
- createExecution · method · L25-L41 — async createExecution(routineId: string, options: { source?: RoutineExecutionRecord["source"]; startedAt?: string } = {}): Promise<RoutineExecutionRecord>
- completeExecution · method · L43-L54 — async completeExecution(execution: RoutineExecutionRecord, update: { status: RoutineStatus; artifactIds?: string[]; skillRunId?: string | null; error?: string | null; completedAt?: string }): Promise<RoutineExecutionRecord>
- listExecutions · method · L56-L59 — async listExecutions({ limit = 50, routineId }: { limit?: number; routineId?: string } = {}): Promise<RoutineExecutionRecord[]>
- pauseRoutine · method · L61-L64 — async pauseRoutine(routineId: string): Promise<void>
- resumeRoutine · method · L66-L69 — async resumeRoutine(routineId: string): Promise<void>
- isPaused · method · L71-L73 — async isPaused(routineId: string): Promise<boolean>
- saveExecution · method · L75-L81 — private async saveExecution(execution: RoutineExecutionRecord): Promise<void>
- readHistory · method · L83-L86 — private async readHistory(): Promise<RoutineHistory>
- writeHistory · method · L88-L91 — private async writeHistory(history: RoutineHistory): Promise<void>
