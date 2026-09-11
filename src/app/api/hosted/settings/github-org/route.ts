import { NextResponse } from "next/server";

import { hostedIdentity } from "@/app/api/hosted/_shared";

export async function GET(request: Request) {
  const identity = await hostedIdentity(request);
  if (identity instanceof NextResponse) return identity;
  const githubOrg = await identity.workspaceStore.getGitHubOrg();
  return NextResponse.json({ githubOrg, canEdit: identity.orgRole === "org:admin" });
}

export async function POST(request: Request) {
  const identity = await hostedIdentity(request);
  if (identity instanceof NextResponse) return identity;
  if (identity.orgRole !== "org:admin") return NextResponse.json({ error: "Only an organization admin can change this setting." }, { status: 403 });

  const body = (await request.json().catch(() => ({}))) as { githubOrg?: unknown };
  const githubOrg = typeof body.githubOrg === "string" ? body.githubOrg : null;
  await identity.workspaceStore.setGitHubOrg(identity.userId, githubOrg);
  return NextResponse.json({ githubOrg: await identity.workspaceStore.getGitHubOrg() });
}
