# src/server/work-items/work-item-store.ts

- WorkItemError · class · L11-L16 — class WorkItemError extends Error
- constructor · method · L12-L15 — constructor(readonly code: "INVALID_INPUT" | "NOT_FOUND", message: string)
- WorkItemStore · class · L18-L88 — class WorkItemStore
- constructor · method · L19-L19 — constructor(private readonly root = process.cwd())
- list · method · L21-L26 — async list(options: ListWorkItemsOptions = {}): Promise<WorkItem[]>
- create · method · L28-L49 — async create(input: CreateWorkItemInput): Promise<WorkItem>
- update · method · L51-L78 — async update(id: string, input: UpdateWorkItemInput, repositoryId?: string): Promise<WorkItem>
- readItems · method · L80-L83 — private async readItems(): Promise<WorkItem[]>
- writeItems · method · L85-L87 — private async writeItems(items: WorkItem[]): Promise<void>
- validateCreate · function · L92-L96 — function validateCreate(input: CreateWorkItemInput): void
- validateUpdate · function · L98-L106 — function validateUpdate(input: UpdateWorkItemInput): void
- invalidReference · function · L108-L110 — function invalidReference(reference: WorkItemContextReference): boolean
