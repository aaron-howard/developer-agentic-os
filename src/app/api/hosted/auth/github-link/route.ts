import { NextResponse } from "next/server";

import { hostedIdentity } from "@/app/api/hosted/_shared";
import { getGitHubLinkStatus, verifyGitHubOrgMembership } from "@/server/hosted-auth/github-link";

export async function GET(request: Request) {
  const identity = await hostedIdentity(request);
  if (identity instanceof NextResponse) return identity;

  const link = await getGitHubLinkStatus(identity.userId);
  const requiredOrg = process.env.GITHUB_ORG?.trim() || null;
  const membership = link.connected && requiredOrg ? await verifyGitHubOrgMembership(identity.userId, requiredOrg) : null;

  return NextResponse.json({
    connected: link.connected,
    username: link.username,
    requiredOrg,
    orgVerified: requiredOrg ? membership?.verified ?? false : null,
    orgVerificationReason: membership?.reason ?? null,
  });
}
