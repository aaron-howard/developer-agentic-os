# src/server/routines/local-background-executor.ts

- ExecutorClock · type · L13-L13 — type ExecutorClock = { now(): Date };
- RoutineExecutorTrigger · type · L14-L14 — type RoutineExecutorTrigger = { repositoryId?: string };
- ExecutorState · type · L16-L16 — type ExecutorState = RoutineExecutorStatus & { leaseToken: string | null };
- LocalBackgroundExecutorOptions · type · L22-L27 — type LocalBackgroundExecutorOptions = { root?: string; clock?: ExecutorClock; leaseTtlMs?: number; intervalMs?: number; };
- createLocalBackgroundExecutor · function · L29-L168 — function createLocalBackgroundExecutor(options: LocalBackgroundExecutorOptions = {})
- getState · function · L38-L41 — async function getState(): Promise<ExecutorState>
- saveState · function · L43-L46 — async function saveState(state: ExecutorState): Promise<void>
- withProcessLock · function · L48-L61 — async function withProcessLock<T>(work: () => Promise<T>): Promise<T>
- acquireLease · function · L63-L72 — async function acquireLease(): Promise<string | null>
- releaseLease · function · L74-L80 — async function releaseLease(token: string, error: string | null = null): Promise<void>
- resolveContext · function · L82-L85 — async function resolveContext(repositoryId?: string): Promise<RepositoryContext>
- runDue · function · L87-L130 — async function runDue(trigger: RoutineExecutorTrigger = {}): Promise<number>
- isDue · function · L132-L140 — async function isDue(routine: RoutineDefinition, workspaceContext: Awaited<ReturnType<typeof createWorkspaceContext>>): Promise<boolean>
- start · method · L143-L149 — async start(trigger: RoutineExecutorTrigger = {}): Promise<RoutineExecutorStatus>
- stop · method · L150-L157 — async stop(): Promise<RoutineExecutorStatus>
- trigger · method · L158-L161 — async trigger(trigger: RoutineExecutorTrigger = {}): Promise<{ executed: number; status: RoutineExecutorStatus }>
- status · method · L162-L166 — async status(): Promise<RoutineExecutorStatus>
- utcWeek · function · L170-L173 — function utcWeek(date: Date): number
