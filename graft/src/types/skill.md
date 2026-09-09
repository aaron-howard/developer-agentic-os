# src/types/skill.ts

- SkillKind · type · L3-L3 — type SkillKind = "built-in" | "placeholder";
- SkillRunStatus · type · L4-L4 — type SkillRunStatus = "queued" | "running" | "succeeded" | "failed";
- SkillInputField · type · L6-L10 — type SkillInputField = { name: string; label: string; required: boolean; };
- SkillCommand · type · L12-L22 — type SkillCommand = { id: string; command: string; label: string; description: string; model: string; effort: "low" | "medium" | "high" | "xhigh" | "max"; kind: SkillKind; inputs: SkillInputField[]; status: "ready" | "placeholder"; };
- SkillRunRecord · type · L24-L38 — type SkillRunRecord = { id: string; skillId: string; status: SkillRunStatus; model: string; effort: SkillCommand["effort"]; input: Record<string, string>; artifactId: string | null; error: string | null; startedAt: string; completedAt: string | null; repositoryId?: string; repositoryRoot?: string; workflowRefs?: WorkflowReference[]; };
- SkillHandlerResult · type · L40-L45 — type SkillHandlerResult = { name: string; type: string; content: ArtifactContent; tags?: string[]; };
- SkillRunResult · type · L47-L50 — type SkillRunResult = { status: SkillRunStatus; run: SkillRunRecord; };
