# src/server/routines/local-background-executor.ts

- ExecutorClock · type · L12-L12 — type ExecutorClock = { now(): Date };
- RoutineExecutorTrigger · type · L13-L13 — type RoutineExecutorTrigger = { repositoryId?: string };
- ExecutorState · type · L15-L15 — type ExecutorState = RoutineExecutorStatus & { leaseToken: string | null };
- LocalBackgroundExecutorOptions · type · L21-L26 — type LocalBackgroundExecutorOptions = { root?: string; clock?: ExecutorClock; leaseTtlMs?: number; intervalMs?: number; };
- createLocalBackgroundExecutor · function · L28-L154 — function createLocalBackgroundExecutor(options: LocalBackgroundExecutorOptions = {})
- getState · function · L37-L40 — async function getState(): Promise<ExecutorState>
- saveState · function · L42-L45 — async function saveState(state: ExecutorState): Promise<void>
- withProcessLock · function · L47-L60 — async function withProcessLock<T>(work: () => Promise<T>): Promise<T>
- acquireLease · function · L62-L71 — async function acquireLease(): Promise<string | null>
- releaseLease · function · L73-L79 — async function releaseLease(token: string, error: string | null = null): Promise<void>
- resolveContext · function · L81-L84 — async function resolveContext(repositoryId?: string): Promise<RepositoryContext>
- runDue · function · L86-L116 — async function runDue(trigger: RoutineExecutorTrigger = {}): Promise<number>
- isDue · function · L118-L126 — async function isDue(routine: RoutineDefinition, contextRoot: string): Promise<boolean>
- start · method · L129-L135 — async start(trigger: RoutineExecutorTrigger = {}): Promise<RoutineExecutorStatus>
- stop · method · L136-L143 — async stop(): Promise<RoutineExecutorStatus>
- trigger · method · L144-L147 — async trigger(trigger: RoutineExecutorTrigger = {}): Promise<{ executed: number; status: RoutineExecutorStatus }>
- status · method · L148-L152 — async status(): Promise<RoutineExecutorStatus>
- utcWeek · function · L156-L159 — function utcWeek(date: Date): number
