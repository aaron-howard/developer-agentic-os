import { NextResponse } from "next/server";

import { emailAdapter } from "@/server/email/email-adapter";
import { repositoryContextForRequest } from "@/server/workspace/request-context";
import { WorkspaceError } from "@/server/workspace/workspace-store";

export async function GET(request: Request) {
  try {
    const context = await repositoryContextForRequest(request);
    return NextResponse.json(await emailAdapter.sync(context.id));
  } catch (error) {
    if (error instanceof WorkspaceError) return NextResponse.json({ error: error.message }, { status: 404 });
    throw error;
  }
}