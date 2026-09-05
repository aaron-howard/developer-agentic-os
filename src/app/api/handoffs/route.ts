import { NextResponse } from "next/server";

import { HandoffError, HandoffStore } from "@/server/handoffs/handoff-store";
import { repositoryContextForRequest } from "@/server/workspace/request-context";
import { WorkspaceError } from "@/server/workspace/workspace-store";

export async function GET(request: Request) {
  try {
    const context = await repositoryContextForRequest(request);
    return NextResponse.json({ handoffs: await new HandoffStore(context.path).list(context.id) });
  } catch (error) {
    if (error instanceof WorkspaceError) return NextResponse.json({ error: error.message }, { status: 404 });
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const context = await repositoryContextForRequest(request, body);
    return NextResponse.json(await new HandoffStore(context.path).create(context, body), { status: 201 });
  } catch (error) {
    if (error instanceof HandoffError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof WorkspaceError) return NextResponse.json({ error: error.message }, { status: 404 });
    throw error;
  }
}