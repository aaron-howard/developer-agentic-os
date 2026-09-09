# src/types/second-brain.ts

- GraphNodeType · type · L1-L1 — type GraphNodeType = "repo" | "repo_context" | "area" | "file" | "artifact" | "skill" | "work_item" | "incoming_signal" | "handoff" | "routine";
- GraphLinkType · type · L2-L2 — type GraphLinkType = "contains" | "references" | "produced" | "used_context" | "triggers" | "scoped_to" | "includes" | "finalized_as";
- GraphNode · type · L4-L10 — type GraphNode = { id: string; type: GraphNodeType; label: string; path?: string; metadata?: Record<string, string | number | boolean | null>; };
- GraphLink · type · L12-L16 — type GraphLink = { source: string; target: string; type: GraphLinkType; };
- SecondBrainGraph · type · L18-L22 — type SecondBrainGraph = { generatedAt: string; nodes: GraphNode[]; links: GraphLink[]; };
