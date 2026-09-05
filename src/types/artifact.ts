export type ArtifactContent = string | number | boolean | null | ArtifactContent[] | { [key: string]: ArtifactContent };

export type ContextReference = {
  kind: "file" | "area" | "repo" | "skill" | "work_item" | "routine";
  ref: string;
};

export type WorkflowReference = {
  kind: "skill" | "routine" | "work_item";
  ref: string;
  label?: string;
};

export type ArtifactProvenance = {
  repositoryId: string;
  repositoryRoot: string;
  workflowRefs: WorkflowReference[];
};

export type Artifact = {
  id: string;
  name: string;
  type: string;
  content: ArtifactContent;
  tags: string[];
  contextRefs: ContextReference[];
  createdAt: string;
  repositoryId?: string;
  repositoryRoot?: string;
  provenance?: ArtifactProvenance;
};

export type ArtifactIndexEntry = Omit<Artifact, "content">;

export type CreateArtifactInput = {
  name: string;
  type: string;
  content: ArtifactContent;
  tags?: string[];
  contextRefs?: ContextReference[];
  repositoryId?: string;
  repositoryRoot?: string;
  provenance?: ArtifactProvenance;
};

export type ListArtifactsOptions = {
  type?: string;
  tag?: string;
  limit?: number;
};