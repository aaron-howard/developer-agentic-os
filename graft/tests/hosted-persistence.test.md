# tests/hosted-persistence.test.ts

- emptyDomainState · function · L10-L10 — emptyDomainState = (): HostedState
- emptyWorkspaceState · function · L11-L11 — emptyWorkspaceState = (): HostedWorkspaceState
- MemoryDomainProvider · class · L13-L17 — class MemoryDomainProvider implements HostedStateProvider
- constructor · method · L14-L14 — constructor(private state: HostedState)
- read · method · L15-L15 — async read(): Promise<HostedState>
- write · method · L16-L16 — async write(state: HostedState): Promise<void>
- MemoryWorkspaceProvider · class · L19-L23 — class MemoryWorkspaceProvider implements HostedWorkspaceStateProvider
- constructor · method · L20-L20 — constructor(private state: HostedWorkspaceState)
- read · method · L21-L21 — async read(): Promise<HostedWorkspaceState>
- write · method · L22-L22 — async write(state: HostedWorkspaceState): Promise<void>
