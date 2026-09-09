# src/server/integrations/vercel-adapter.ts

- VercelFetch · type · L6-L6 — type VercelFetch = (input: string, init?: RequestInit) => Promise<Response>;
- VercelApiDeployment · type · L7-L7 — type VercelApiDeployment = { uid?: unknown; name?: unknown; url?: unknown; state?: unknown; created?: unknown; target?: unknown };
- VercelAdapter · class · L9-L97 — class VercelAdapter
- constructor · method · L16-L26 — constructor( private readonly env: Record<string, string | undefined> = process.env, fetcher: VercelFetch = fetch as VercelFetch, private readonly repositoryRoot?: string, )
- getOperations · method · L28-L51 — async getOperations(): Promise<VercelOperations>
- redeploy · method · L53-L61 — async redeploy(deploymentId: string, expectedProjectId?: string): Promise<{ ok: boolean; status: number; response: Record<string, unknown> }>
- projectForContext · method · L63-L75 — private async projectForContext(): Promise<{ id: string | null; teamId: string | undefined }>
- request · method · L77-L92 — private async request<T>(path: string): Promise<T>
- empty · method · L94-L96 — private empty(status: VercelOperations["status"], message: string): VercelOperations
- responseBody · function · L99-L101 — async function responseBody(response: Response): Promise<unknown>
- VercelRequestError · class · L103-L105 — class VercelRequestError extends Error
- constructor · method · L104-L104 — constructor(readonly failure: VercelFailure)
- failureForResponse · function · L107-L112 — function failureForResponse(response: Response): VercelFailure
- toDeployment · function · L114-L127 — function toDeployment(deployment: VercelApiDeployment, projectId: string): VercelDeployment
- deploymentState · function · L129-L135 — function deploymentState(value: unknown): VercelDeployment["state"]
