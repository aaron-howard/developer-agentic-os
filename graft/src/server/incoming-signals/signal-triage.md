# src/server/incoming-signals/signal-triage.ts

- SignalTriageError · class · L7-L12 — class SignalTriageError extends Error
- constructor · method · L8-L11 — constructor(readonly code: "INVALID_INPUT" | "NOT_FOUND", message: string)
- triageSignal · function · L14-L67 — async function triageSignal(root: string, signalId: string, input: SignalTriageAction, repositoryId: string): Promise<SignalTriageResult>
- markTriaged · function · L69-L72 — async function markTriaged(signal: Awaited<ReturnType<IncomingSignalStore["list"]>>[number], store: IncomingSignalStore, derivedRef: { kind: "work_item" | "skill_run" | "artifact"; ref: string })
- validateAction · function · L74-L81 — function validateAction(input: SignalTriageAction): void
- isTriageStoreError · function · L83-L85 — function isTriageStoreError(error: unknown): error is IncomingSignalError | WorkItemError
