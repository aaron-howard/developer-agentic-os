import { NextResponse } from "next/server";

import { GitHubAdapter } from "@/server/integrations/github-adapter";
import { repositoryContextForRequest } from "@/server/workspace/request-context";
import { WorkspaceError } from "@/server/workspace/workspace-store";

export async function GET(request: Request = new Request("http://localhost")) {
  try {
    const context = await repositoryContextForRequest(request);
    const operations = await new GitHubAdapter(process.env, fetch, context.path).getOperations();
    return NextResponse.json({ ...operations, repositoryId: context.id });
  } catch (error) {
    if (error instanceof WorkspaceError) return NextResponse.json({ error: error.message }, { status: 404 });
    throw error;
  }
}
