export type GraphNodeType = "repo" | "area" | "file" | "artifact" | "skill" | "work_item" | "routine";
export type GraphLinkType = "contains" | "references" | "produced" | "used_context" | "triggers";

export type GraphNode = {
  id: string;
  type: GraphNodeType;
  label: string;
  path?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type GraphLink = {
  source: string;
  target: string;
  type: GraphLinkType;
};

export type SecondBrainGraph = {
  generatedAt: string;
  nodes: GraphNode[];
  links: GraphLink[];
};