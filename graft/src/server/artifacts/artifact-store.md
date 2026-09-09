# src/server/artifacts/artifact-store.ts

- ArtifactIndex · type · L10-L12 — type ArtifactIndex = { artifacts: ArtifactIndexEntry[]; };
- ArtifactStore · class · L17-L113 — class ArtifactStore
- constructor · method · L22-L26 — constructor(root = process.cwd())
- initialize · method · L28-L32 — async initialize()
- createArtifact · method · L34-L57 — async createArtifact(input: CreateArtifactInput): Promise<ArtifactIndexEntry>
- listArtifacts · method · L59-L68 — async listArtifacts(options: ListArtifactsOptions = {}): Promise<ArtifactIndexEntry[]>
- getArtifact · method · L70-L82 — async getArtifact(id: string): Promise<Artifact | null>
- toIndexEntry · method · L84-L96 — private toIndexEntry(artifact: Artifact): ArtifactIndexEntry
- readIndex · method · L98-L103 — private async readIndex(): Promise<ArtifactIndex>
- writeIndex · method · L105-L108 — private async writeIndex(index: ArtifactIndex): Promise<void>
- isSafeArtifactId · method · L110-L112 — private isSafeArtifactId(id: string): boolean
