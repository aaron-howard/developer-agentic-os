# src/server/handoffs/handoff-store.ts

- HandoffIndex · type · L13-L13 — type HandoffIndex = { handoffs: Handoff[] };
- HandoffError · class · L16-L21 — class HandoffError extends Error
- constructor · method · L17-L20 — constructor(readonly code: "INVALID_INPUT" | "NOT_FOUND" | "FINALIZED", message: string)
- HandoffStore · class · L27-L124 — class HandoffStore
- constructor · method · L28-L28 — constructor(private readonly root = process.cwd(), private readonly context?: WorkspaceContext)
- list · method · L30-L33 — async list(repositoryId?: string): Promise<Handoff[]>
- get · method · L35-L39 — async get(id: string, repositoryId?: string): Promise<Handoff>
- create · method · L41-L70 — async create(context: RepositoryContext, input: CreateHandoffInput = {}): Promise<Handoff>
- update · method · L72-L86 — async update(id: string, input: UpdateHandoffInput, repositoryId?: string): Promise<Handoff>
- finalize · method · L88-L111 — async finalize(id: string, repositoryId?: string): Promise<Handoff>
- save · method · L113-L118 — private async save(handoff: Handoff): Promise<void>
- readIndex · method · L120-L123 — private async readIndex(): Promise<HandoffIndex>
- validateInput · function · L128-L133 — function validateInput(input: CreateHandoffInput | UpdateHandoffInput): void
- cleanLines · function · L135-L137 — function cleanLines(lines: string[] | undefined): string[]
