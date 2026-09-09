import { NextResponse } from "next/server";

import { GitHubAdapter } from "@/server/integrations/github-adapter";
import { VercelAdapter } from "@/server/integrations/vercel-adapter";
import { OperationalStore, inputFingerprint } from "@/server/operational/operational-store";
import { repositoryContextForRequest } from "@/server/workspace/request-context";
import { WorkspaceError } from "@/server/workspace/workspace-store";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const body = await request.json();
    const context = await repositoryContextForRequest(request, body);
    const store = new OperationalStore(context.path);
    const runId = (await params).id;
    const run = (await store.listRuns({ repositoryId: context.id })).find((item) => item.id === runId);
    if (!run) return NextResponse.json({ error: "Automation run not found." }, { status: 404 });
    if (!run.approval || run.approval.inputFingerprint !== inputFingerprint(run.input)) return NextResponse.json({ error: "Automation run requires a current approval." }, { status: 409 });
    if (run.status !== "queued") return NextResponse.json({ error: "Automation run is not eligible for an action." }, { status: 409 });
    if (run.approval.action !== body.providerAction) return NextResponse.json({ error: "Requested action does not match the approved action." }, { status: 409 });
    let action: { ok: boolean; status: number; response: Record<string, unknown> } | null;
    try {
      action = body.providerAction === "github-rerun" ? await new GitHubAdapter(process.env, fetch, context.path).rerunFailedAction(String(run.input.actionRunId ?? "")) : body.providerAction === "vercel-redeploy" ? await new VercelAdapter(process.env, fetch, context.path).redeploy(String(run.input.deploymentId ?? ""), typeof run.input.projectId === "string" ? run.input.projectId : undefined) : null;
    } catch (error) {
      const response = { provider: body.providerAction, error: error instanceof Error ? error.message : "Provider action threw an exception." };
      const audit = await store.recordAudit({ repositoryId: context.id, runId: run.id, action: body.providerAction, approval: run.approval, request: run.input, response });
      await store.updateRun(run.id, context.id, { status: "failed", outputs: [audit.id], error: String(response.error) });
      return NextResponse.json({ action: { ok: false, status: 502, response }, audit }, { status: 502 });
    }
    if (!action) return NextResponse.json({ error: "Unsupported provider action." }, { status: 400 });
    const audit = await store.recordAudit({ repositoryId: context.id, runId: run.id, action: body.providerAction, approval: run.approval, request: run.input, response: action.response });
    await store.updateRun(run.id, context.id, { status: action.ok ? "succeeded" : "failed", outputs: [audit.id], error: action.ok ? null : `Provider action failed with HTTP ${action.status}.` });
    return NextResponse.json({ action, audit });
  } catch (error) {
    if (error instanceof WorkspaceError) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Provider action failed." }, { status: 400 });
  }
}
