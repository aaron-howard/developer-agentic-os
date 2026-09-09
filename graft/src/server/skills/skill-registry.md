# src/server/skills/skill-registry.ts

- SkillRegistryOptions · type · L9-L13 — type SkillRegistryOptions = { root?: string; artifactStore?: ArtifactStore; runStore?: SkillRunStore; };
- SkillHandler · type · L15-L15 — type SkillHandler = (input: Record<string, string>) => Promise<SkillHandlerResult>;
- createSkillRegistry · function · L36-L139 — function createSkillRegistry(options: SkillRegistryOptions = {})
- listSkills · method · L101-L103 — listSkills(): SkillCommand[]
- runSkill · method · L105-L137 — async runSkill(id: string, input: Record<string, string> = {}, options: { workflowRefs?: WorkflowReference[] } = {}): Promise<SkillRunResult>
- command · function · L143-L145 — function command(id: string, commandText: string, label: string, description: string, inputs: SkillCommand["inputs"]): SkillCommand
- placeholder · function · L147-L149 — function placeholder(id: string, commandText: string, label: string): SkillCommand
- artifact · function · L151-L153 — function artifact(name: string, type: string, content: SkillHandlerResult["content"], tags: string[]): SkillHandlerResult
- requireInput · function · L155-L157 — function requireInput(input: Record<string, string>, key: string, message: string): void
- failRun · function · L159-L162 — async function failRun(runStore: SkillRunStore, run: Awaited<ReturnType<SkillRunStore["createRun"]>>, error: string): Promise<SkillRunResult>
