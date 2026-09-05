import type { IntegrationAdapterStatus } from "@/types/integration";
import { LocalGitAdapter } from "../git/local-git-adapter";

export async function getIntegrationStatuses(root = process.cwd(), env: Record<string, string | undefined> = process.env): Promise<IntegrationAdapterStatus[]> {
  const git = await new LocalGitAdapter(root).getStatus();
  const hasGitHubToken = Boolean(env.GITHUB_TOKEN || env.GH_TOKEN);

  return [
    {
      id: "local-git",
      name: "Local Git",
      kind: "local",
      required: true,
      status: git.available ? "connected" : "error",
      capabilities: ["current branch", "recent commits", "changed files"],
      message: git.message,
    },
    {
      id: "github",
      name: "GitHub",
      kind: "scm",
      required: false,
      status: hasGitHubToken ? "connected" : "available",
      capabilities: ["PR metadata", "branch metadata"],
      setup: "Set GITHUB_TOKEN or GH_TOKEN to enable GitHub metadata.",
      message: hasGitHubToken ? "GitHub token detected." : "GitHub is available when token credentials are present.",
    },
    available("gitlab", "GitLab", "scm", ["merge request metadata", "branch metadata"], "Deferred from the first build."),
    available("jira", "Jira", "issue-tracker", ["issue state", "delivery context"], "Deferred from the first build."),
    available("linear", "Linear", "issue-tracker", ["issue state", "cycle context"], "Deferred from the first build."),
    available("slack", "Slack", "chat", ["routine notifications"], "Deferred from the first build."),
    available("email", "Email", "email", ["communication signals"], "Placeholder widget in the first build."),
    available("observability", "Observability", "observability", ["release risk signals"], "Deferred from the first build."),
    available("cloudflare", "Cloudflare", "cloud", ["edge sync", "D1 storage", "workflows"], "Deferred from the first build."),
  ];
}

function available(
  id: string,
  name: string,
  kind: IntegrationAdapterStatus["kind"],
  capabilities: string[],
  message: string,
): IntegrationAdapterStatus {
  return {
    id,
    name,
    kind,
    required: false,
    status: "available",
    capabilities,
    setup: "Not required for the first build.",
    message,
  };
}