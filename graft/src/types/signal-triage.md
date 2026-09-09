# src/types/signal-triage.ts

- SignalTriageAction · type · L6-L12 — type SignalTriageAction = | { action: "create_work_item"; title?: string; notes?: string; priority?: WorkItemPriority } | { action: "attach_work_item"; workItemId: string } | { action: "invoke_skill"; skillId: string; input?: Record<string, string> } | { action: "create_artifact"; name?: string; type?: string; content?: string; tags?: string[] } | { action: "dismiss" } | { action: "snooze"; snoozedUntil?: string };
- SignalTriageResult · type · L14-L20 — type SignalTriageResult = { action: SignalTriageAction["action"]; signal: IncomingSignal; workItem?: WorkItem; skillRun?: SkillRunRecord; artifact?: ArtifactIndexEntry; };
