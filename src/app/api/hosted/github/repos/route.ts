import { NextResponse } from "next/server";

import { hostedIdentity } from "@/app/api/hosted/_shared";
import { listGitHubRepos } from "@/server/hosted-auth/github-link";

export async function GET(request: Request) {
  const identity = await hostedIdentity(request);
  if (identity instanceof NextResponse) return identity;

  const result = await listGitHubRepos(identity.userId);
  return NextResponse.json(result);
}
