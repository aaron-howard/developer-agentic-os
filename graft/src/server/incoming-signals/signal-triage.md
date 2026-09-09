# src/server/incoming-signals/signal-triage.ts

- SignalTriageError · class · L6-L11 — class SignalTriageError extends Error
- constructor · method · L7-L10 — constructor(readonly code: "INVALID_INPUT" | "NOT_FOUND", message: string)
- triageSignal · function · L20-L30 — async function triageSignal(context: WorkspaceContext, signalId: string, input: SignalTriageAction, repositoryId: string): Promise<SignalTriageResult>
