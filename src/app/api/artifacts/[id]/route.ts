import { NextResponse } from "next/server";

import { ArtifactStore } from "@/server/artifacts/artifact-store";
import { repositoryContextForRequest } from "@/server/workspace/request-context";
import { WorkspaceError } from "@/server/workspace/workspace-store";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const context = await repositoryContextForRequest(_request);
    const artifact = await new ArtifactStore(context.path).getArtifact(id);
    if (!artifact) return NextResponse.json({ error: "Artifact not found" }, { status: 404 });

    return NextResponse.json(artifact);
  } catch (error) {
    if (error instanceof WorkspaceError) return NextResponse.json({ error: error.message }, { status: 404 });
    throw error;
  }
}