# src/server/focus-board/focus-board.ts

- FocusBoardOptions · type · L10-L14 — type FocusBoardOptions = { now?: () => Date; limit?: number; workItems?: WorkItemStore; };
- getFocusBoard · function · L16-L51 — async function getFocusBoard(repositoryId: string, repositoryRoot: string, options: FocusBoardOptions = {}): Promise<FocusBoard>
- attentionRank · function · L53-L55 — function attentionRank(item: FocusBoardWorkItem): number
- attentionFor · function · L57-L62 — function attentionFor(item: WorkItem, nowValue: number): FocusBoardWorkItem["attention"]
- priorityRank · function · L64-L66 — function priorityRank(priority: FocusBoardWorkItem["priority"]): number
