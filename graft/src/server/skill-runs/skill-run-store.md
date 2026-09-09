# src/server/skill-runs/skill-run-store.ts

- SkillRunIndex · type · L9-L11 — type SkillRunIndex = { runs: SkillRunRecord[]; };
- SkillRunStore · class · L15-L65 — class SkillRunStore
- constructor · method · L19-L22 — constructor(private readonly root = process.cwd())
- createRun · method · L24-L41 — async createRun(skill: SkillCommand, input: Record<string, string>): Promise<SkillRunRecord>
- updateRun · method · L43-L46 — async updateRun(run: SkillRunRecord): Promise<SkillRunRecord>
- listRuns · method · L48-L51 — async listRuns({ limit = 50, skillId }: { limit?: number; skillId?: string } = {}): Promise<SkillRunRecord[]>
- saveRun · method · L53-L59 — private async saveRun(run: SkillRunRecord): Promise<void>
- readIndex · method · L61-L64 — private async readIndex(): Promise<SkillRunIndex>
