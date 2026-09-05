import { NextResponse } from "next/server";

import { getFocusBoard } from "@/server/focus-board/focus-board";
import { repositoryContextForRequest } from "@/server/workspace/request-context";
import { WorkspaceError } from "@/server/workspace/workspace-store";

export async function GET(request: Request) {
  try {
    const context = await repositoryContextForRequest(request);
    const limit = Number(new URL(request.url).searchParams.get("limit") ?? 12);
    return NextResponse.json(await getFocusBoard(context.id, context.path, { limit: Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 50) : 12 }));
  } catch (error) {
    if (error instanceof WorkspaceError) return NextResponse.json({ error: error.message }, { status: 404 });
    throw error;
  }
}