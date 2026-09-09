# src/types/work-item.ts

- WorkItemStatus · type · L1-L1 — type WorkItemStatus = "open" | "in_progress" | "blocked" | "completed";
- WorkItemPriority · type · L2-L2 — type WorkItemPriority = "low" | "normal" | "high" | "urgent";
- WorkItemContextReference · type · L4-L8 — type WorkItemContextReference = { kind: "file" | "area" | "artifact" | "skill" | "routine" | "incoming_signal" | "integration_event"; ref: string; label?: string; };
- WorkItemStatusChange · type · L10-L13 — type WorkItemStatusChange = { status: WorkItemStatus; changedAt: string; };
- WorkItem · type · L15-L29 — type WorkItem = { id: string; title: string; notes: string; status: WorkItemStatus; priority: WorkItemPriority; dueAt: string | null; dueNote: string | null; repositoryId: string; contextRefs: WorkItemContextReference[]; createdAt: string; updatedAt: string; completedAt: string | null; statusHistory: WorkItemStatusChange[]; };
- CreateWorkItemInput · type · L31-L40 — type CreateWorkItemInput = { title: string; notes?: string; status?: WorkItemStatus; priority?: WorkItemPriority; dueAt?: string | null; dueNote?: string | null; repositoryId: string; contextRefs?: WorkItemContextReference[]; };
- UpdateWorkItemInput · type · L42-L42 — type UpdateWorkItemInput = Partial<Pick<WorkItem, "title" | "notes" | "status" | "priority" | "dueAt" | "dueNote" | "contextRefs">>;
- ListWorkItemsOptions · type · L44-L47 — type ListWorkItemsOptions = { repositoryId?: string; status?: WorkItemStatus; };
