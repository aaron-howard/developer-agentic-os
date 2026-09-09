# src/server/incoming-signals/incoming-signal-store.ts

- IncomingSignalError · class · L11-L16 — class IncomingSignalError extends Error
- constructor · method · L12-L15 — constructor(readonly code: "INVALID_INPUT" | "NOT_FOUND", message: string)
- IncomingSignalStore · class · L18-L71 — class IncomingSignalStore
- constructor · method · L19-L19 — constructor(private readonly root = process.cwd())
- list · method · L21-L26 — async list(options: ListIncomingSignalsOptions = {}): Promise<IncomingSignal[]>
- create · method · L28-L48 — async create(input: CreateIncomingSignalInput): Promise<IncomingSignal>
- update · method · L50-L61 — async update(id: string, input: UpdateIncomingSignalInput, repositoryId?: string): Promise<IncomingSignal>
- readSignals · method · L63-L66 — private async readSignals(): Promise<IncomingSignal[]>
- writeSignals · method · L68-L70 — private async writeSignals(signals: IncomingSignal[]): Promise<void>
- validateCreate · function · L75-L82 — function validateCreate(input: CreateIncomingSignalInput): void
- isProvider · function · L84-L86 — function isProvider(value: unknown): value is IncomingSignalProvider
- validateUpdate · function · L88-L92 — function validateUpdate(input: UpdateIncomingSignalInput): void
