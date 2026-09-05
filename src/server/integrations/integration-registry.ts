import type { IntegrationAdapterStatus } from "@/types/integration";
import { LocalEmailAdapter } from "../email/email-adapter";
import { LocalGitAdapter } from "../git/local-git-adapter";

export async function getIntegrationStatuses(root = process.cwd(), env: Record<string, string | undefined> = process.env): Promise<IntegrationAdapterStatus[]> {
  const git = await new LocalGitAdapter(root).getStatus();
  const email = new LocalEmailAdapter(root, env).getStatus();
  const hasGitHubToken = Boolean(env.GITHUB_TOKEN || env.GH_TOKEN);
  const hasVercelToken = Boolean(env.VERCEL_TOKEN || env.VERCEL_API_TOKEN);
  const hasVercelProject = Boolean(env.VERCEL_PROJECT_ID);

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
      status: hasGitHubToken ? "connected" : "unconfigured",
      capabilities: ["issues", "pull requests", "Actions", "merge status"],
      setup: "Set GITHUB_TOKEN or GH_TOKEN and GITHUB_REPOSITORY to enable GitHub operations.",
      message: hasGitHubToken ? "GitHub credentials detected." : "GitHub credentials are not configured.",
    },
    env.VERCEL_INTEGRATION_ENABLED === "false" ? {
      id: "vercel",
      name: "Vercel",
      kind: "cloud",
      required: false,
      status: "disabled",
      capabilities: ["deployments", "build logs", "runtime logs"],
      setup: "Set VERCEL_INTEGRATION_ENABLED=true to enable Vercel operations.",
      message: "Vercel integration is disabled by configuration.",
    } : {
      id: "vercel",
      name: "Vercel",
      kind: "cloud",
      required: false,
      status: hasVercelToken && hasVercelProject ? "connected" : "unconfigured",
      capabilities: ["deployments", "build logs", "runtime logs"],
      setup: "Set VERCEL_TOKEN or VERCEL_API_TOKEN and VERCEL_PROJECT_ID to enable Vercel operations.",
      message: hasVercelToken && hasVercelProject ? "Vercel credentials detected." : "Vercel credentials or project configuration are missing.",
    },
    deferred("sentry", "Sentry", "observability", ["events and outages", "breached metrics", "warnings", "traces", "errors"]),
    deferred("cloudflare", "Cloudflare", "cloud", ["domains", "workers"]),
    deferred("coderabbit", "CodeRabbit", "observability", ["code review insights"]),
    deferred("workos", "WorkOS", "identity", ["identity health"]),
    deferred("clerk", "Clerk", "identity", ["authentication health"]),
    deferred("convex", "Convex", "database", ["health"]),
    deferred("neondb", "NeonDB", "database", ["health"]),
    deferred("upstash", "Upstash", "database", ["health"]),
    email,
    deferred("slack", "Slack", "chat", ["routine notifications"]),
  ];
}

function deferred(
  id: string,
  name: string,
  kind: IntegrationAdapterStatus["kind"],
  capabilities: string[],
): IntegrationAdapterStatus {
  return {
    id,
    name,
    kind,
    required: false,
    status: "deferred",
    capabilities,
    setup: "This integration is staged for a later milestone.",
    message: "Health monitoring is staged for a later milestone.",
  };
}