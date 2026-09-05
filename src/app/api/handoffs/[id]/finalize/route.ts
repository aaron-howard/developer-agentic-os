import { NextResponse } from "next/server";

import { HandoffError, HandoffStore } from "@/server/handoffs/handoff-store";
import { repositoryContextForRequest } from "@/server/workspace/request-context";
import { WorkspaceError } from "@/server/workspace/workspace-store";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const context = await repositoryContextForRequest(request);
    return NextResponse.json(await new HandoffStore(context.path).finalize((await params).id, context.id));
  } catch (error) {
    if (error instanceof HandoffError || error instanceof WorkspaceError) return NextResponse.json({ error: error.message }, { status: 404 });
    throw error;
  }
}