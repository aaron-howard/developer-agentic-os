# src/types/github.ts

- GitHubFailureKind · type · L3-L3 — type GitHubFailureKind = "authentication" | "rate_limit" | "not_found" | "unavailable" | "invalid_response";
- GitHubFailure · type · L5-L8 — type GitHubFailure = { kind: GitHubFailureKind; message: string; };
- GitHubIssue · type · L10-L16 — type GitHubIssue = { number: number; title: string; state: string; url: string; updatedAt: string; };
- GitHubPullRequest · type · L18-L21 — type GitHubPullRequest = GitHubIssue & { draft: boolean; mergeable: "ready" | "blocked" | "unknown"; };
- GitHubActionRun · type · L23-L30 — type GitHubActionRun = { id: number; name: string; status: string; conclusion: string | null; url: string; createdAt: string; };
- GitHubMergeStatus · type · L32-L35 — type GitHubMergeStatus = { state: "ready" | "blocked" | "unavailable"; message: string; };
- GitHubOperations · type · L37-L47 — type GitHubOperations = { status: IntegrationStatus; repository: string | null; message: string; issues: GitHubIssue[]; pullRequests: GitHubPullRequest[]; actions: GitHubActionRun[]; mergeStatus: GitHubMergeStatus; failure: GitHubFailure | null; checkedAt: string; };
