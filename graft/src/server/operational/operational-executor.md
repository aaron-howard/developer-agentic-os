# src/server/operational/operational-executor.ts

- createOperationalExecutor · function · L5-L85 — function createOperationalExecutor(root = process.cwd(), workspaceRoot = root)
- recoverInterruptedRuns · function · L7-L12 — async function recoverInterruptedRuns(repositoryId?: string): Promise<number>
- runPolicy · function · L14-L51 — async function runPolicy(policyId: string, repositoryId: string, trigger: "schedule" | "provider" = "schedule", input: Record<string, unknown> = {})
- runDueSchedule · method · L55-L83 — async runDueSchedule(repositoryId: string): Promise<number>
