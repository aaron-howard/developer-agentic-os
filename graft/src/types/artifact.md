# src/types/artifact.ts

- ArtifactContent · type · L1-L1 — type ArtifactContent = string | number | boolean | null | ArtifactContent[] | { [key: string]: ArtifactContent };
- ContextReference · type · L3-L6 — type ContextReference = { kind: "file" | "area" | "repo" | "repo_context" | "skill" | "work_item" | "routine" | "incoming_signal"; ref: string; };
- WorkflowReference · type · L8-L12 — type WorkflowReference = { kind: "skill" | "routine" | "work_item" | "incoming_signal" | "policy" | "operational_event" | "operational_incident"; ref: string; label?: string; };
- ArtifactProvenance · type · L14-L18 — type ArtifactProvenance = { repositoryId: string; repositoryRoot: string; workflowRefs: WorkflowReference[]; };
- Artifact · type · L20-L31 — type Artifact = { id: string; name: string; type: string; content: ArtifactContent; tags: string[]; contextRefs: ContextReference[]; createdAt: string; repositoryId?: string; repositoryRoot?: string; provenance?: ArtifactProvenance; };
- ArtifactIndexEntry · type · L33-L33 — type ArtifactIndexEntry = Omit<Artifact, "content">;
- CreateArtifactInput · type · L35-L44 — type CreateArtifactInput = { name: string; type: string; content: ArtifactContent; tags?: string[]; contextRefs?: ContextReference[]; repositoryId?: string; repositoryRoot?: string; provenance?: ArtifactProvenance; };
- ListArtifactsOptions · type · L46-L50 — type ListArtifactsOptions = { type?: string; tag?: string; limit?: number; };
