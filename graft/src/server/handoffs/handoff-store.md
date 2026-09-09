# src/server/handoffs/handoff-store.ts

- HandoffIndex · type · L13-L13 — type HandoffIndex = { handoffs: Handoff[] };
- HandoffError · class · L16-L21 — class HandoffError extends Error
- constructor · method · L17-L20 — constructor(readonly code: "INVALID_INPUT" | "NOT_FOUND" | "FINALIZED", message: string)
- HandoffStore · class · L23-L120 — class HandoffStore
- constructor · method · L24-L24 — constructor(private readonly root = process.cwd())
- list · method · L26-L29 — async list(repositoryId?: string): Promise<Handoff[]>
- get · method · L31-L35 — async get(id: string, repositoryId?: string): Promise<Handoff>
- create · method · L37-L66 — async create(context: RepositoryContext, input: CreateHandoffInput = {}): Promise<Handoff>
- update · method · L68-L82 — async update(id: string, input: UpdateHandoffInput, repositoryId?: string): Promise<Handoff>
- finalize · method · L84-L107 — async finalize(id: string, repositoryId?: string): Promise<Handoff>
- save · method · L109-L114 — private async save(handoff: Handoff): Promise<void>
- readIndex · method · L116-L119 — private async readIndex(): Promise<HandoffIndex>
- validateInput · function · L124-L129 — function validateInput(input: CreateHandoffInput | UpdateHandoffInput): void
- cleanLines · function · L131-L133 — function cleanLines(lines: string[] | undefined): string[]
