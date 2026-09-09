# src/types/routine.ts

- RoutineStatus · type · L1-L1 — type RoutineStatus = "queued" | "next" | "running" | "succeeded" | "failed" | "paused" | "missed";
- RoutineKind · type · L2-L2 — type RoutineKind = "built-in" | "placeholder";
- RoutineExecutionMode · type · L3-L3 — type RoutineExecutionMode = "manual" | "local_background";
- RoutineExecutionSource · type · L4-L4 — type RoutineExecutionSource = "manual" | "local_background";
- RoutineDefinition · type · L6-L19 — type RoutineDefinition = { id: string; name: string; description: string; scheduleLabel: string; kind: RoutineKind; executionMode: RoutineExecutionMode; status: RoutineStatus; skillId: string | null; repositoryId?: string | null; lastRunAt?: string | null; nextDueAt?: string | null; lastExecutionSource?: RoutineExecutionSource | null; };
- RoutineExecutionRecord · type · L21-L33 — type RoutineExecutionRecord = { id: string; routineId: string; status: RoutineStatus; startedAt: string; completedAt: string | null; artifactIds: string[]; skillRunId: string | null; error: string | null; source: RoutineExecutionSource; repositoryId?: string; repositoryRoot?: string; };
- RoutineRunResult · type · L35-L40 — type RoutineRunResult = { status: RoutineStatus; execution: RoutineExecutionRecord; artifactIds: string[]; error: string | null; };
- RoutineExecutorStatus · type · L42-L48 — type RoutineExecutorStatus = { running: boolean; leaseExpiresAt: string | null; lastTickAt: string | null; lastRunAt: string | null; lastError: string | null; };
