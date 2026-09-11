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

export type GitHubRepoSummary = {
  fullName: string;
  private: boolean;
  htmlUrl: string;
  updatedAt: string | null;
};

export type GitHubRepoList = { connected: boolean; repos: GitHubRepoSummary[] };

// Uses the linked account's own token, so results are scoped to whatever repos that GitHub user can see.
export async function listGitHubRepos(userId: string): Promise<GitHubRepoList> {
  const token = await getGitHubAccessToken(userId);
  if (!token) return { connected: false, repos: [] };
  const response = await fetch("https://api.github.com/user/repos?per_page=50&sort=updated", {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
  });
  if (!response.ok) return { connected: true, repos: [] };
  const payload = (await response.json()) as Array<{ full_name?: string; private?: boolean; html_url?: string; updated_at?: string }>;
  const repos = payload
    .filter((repo): repo is { full_name: string; private: boolean; html_url: string; updated_at?: string } => typeof repo.full_name === "string" && typeof repo.html_url === "string")
    .map((repo) => ({ fullName: repo.full_name, private: Boolean(repo.private), htmlUrl: repo.html_url, updatedAt: repo.updated_at ?? null }));
  return { connected: true, repos };
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
