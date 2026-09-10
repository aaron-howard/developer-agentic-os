import { clerkClient } from "@clerk/nextjs/server";

export type GitHubLinkStatus = {
  connected: boolean;
  username: string | null;
};

export async function getGitHubLinkStatus(userId: string): Promise<GitHubLinkStatus> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  // Clerk's backend API returns the provider prefixed ("oauth_github"); check both forms defensively.
  const account = user.externalAccounts.find((candidate) => candidate.provider === "oauth_github" || candidate.provider === "github");
  return { connected: Boolean(account), username: account?.username ?? null };
}

async function getGitHubAccessToken(userId: string): Promise<string | null> {
  const client = await clerkClient();
  const { data } = await client.users.getUserOauthAccessToken(userId, "github");
  return data[0]?.token ?? null;
}

export type GitHubOrgMembershipReason = "no_token" | "not_a_member" | "api_error";
export type GitHubOrgMembership = { verified: boolean; reason: GitHubOrgMembershipReason | null };

// The tenant's GitHub org is a separate entitlement check from Clerk org membership (see ADR 0002).
export async function verifyGitHubOrgMembership(userId: string, org: string): Promise<GitHubOrgMembership> {
  const token = await getGitHubAccessToken(userId);
  if (!token) return { verified: false, reason: "no_token" };
  try {
    const response = await fetch(`https://api.github.com/user/memberships/orgs/${encodeURIComponent(org)}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
    });
    if (!response.ok) return { verified: false, reason: response.status === 404 ? "not_a_member" : "api_error" };
    const membership = (await response.json()) as { state?: string };
    return membership.state === "active" ? { verified: true, reason: null } : { verified: false, reason: "not_a_member" };
  } catch {
    return { verified: false, reason: "api_error" };
  }
}
