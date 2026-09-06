import { expect, test } from "@playwright/test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

test.describe("Developer Agentic OS dashboard", () => {
  test("loads with approved branding and no removed references", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Developer Agentic OS/ })).toBeVisible();
    const content = await page.locator("body").innerText();
    expect(content).not.toContain("YouTube");
    expect(content).not.toContain("Robonuggets");
  });

  test("shows all major panels", async ({ page }) => {
    await page.goto("/");
    for (const title of ["Micro Apps", "Calendar", "Artifacts", "Email", "Skills Deck", "Routines"]) {
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    }
    await expect(page.getByLabel("Central workspace graph")).toBeVisible();
  });

  test("shows the repository-scoped Today / Focus Board and preserves its existing actions", async ({ page }) => {
    await page.goto("/");
    const board = page.getByRole("complementary", { name: "Agent Inbox, Email, skills, and routines" }).getByRole("region", { name: "Today and Focus Board" });
    await expect(board).toBeVisible();
    await expect(board.getByRole("heading", { name: "Today / Focus Board" })).toBeVisible();
    await expect(board.getByText(/active|selected repository/).first()).toBeVisible();
    const focusApp = page.getByRole("button", { name: "Today / Focus Board: Daily attention for the selected repository" });
    await focusApp.click();
    await expect(board).toBeHidden();
    await focusApp.click();
    await expect(board).toBeVisible();
  });

  test("shows the live workspace switcher and keeps the active selection after reload", async ({ page }) => {
    await page.goto("/");
    const switcher = page.getByRole("button", { name: "Workspace Switcher: Change the active repository context" });
    await expect(switcher).toBeVisible();
    await switcher.click();
    await expect(page.locator("#workspace-switcher")).toBeVisible();
    const repositories = page.getByRole("button", { name: /Git available|Git unavailable/ });
    const count = await repositories.count();
    if (count > 0) {
      const first = repositories.first();
      await first.click();
      await expect(first).toHaveAttribute("aria-pressed", "true");
      await page.reload();
      await page.getByRole("button", { name: "Workspace Switcher: Change the active repository context" }).click();
      await expect(page.getByRole("button", { name: /Git available|Git unavailable/ }).first()).toHaveAttribute("aria-pressed", "true");
    }
  });

  test("captures, filters, completes, and inspects a work item", async ({ page }) => {
    await page.goto("/");
    const workQueue = page.getByRole("region", { name: "Work Queue" });
    await expect(workQueue.getByRole("heading", { name: "Work Queue" })).toBeVisible();
    const title = `Browser queue item ${Date.now()}`;
    await workQueue.getByLabel("Work item title").fill(title);
    await workQueue.getByLabel("Work item notes").fill("Verify the queue inspector.");
    await workQueue.getByRole("button", { name: "Capture" }).click();
    const item = workQueue.getByRole("button", { name: new RegExp(title) });
    await expect(item).toBeVisible();
    await item.click();
    const inspector = page.getByRole("complementary", { name: "Work Item Inspector" });
    await expect(inspector).toContainText("Verify the queue inspector.");
    await inspector.getByRole("button", { name: "completed", exact: true }).click();
    await expect(inspector).toContainText("completed");
    await workQueue.getByLabel("Filter work items by status").selectOption("completed");
    await expect(item).toBeVisible();
  });

  test("captures and triages an incoming signal in the Agent Inbox", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Agent Inbox" })).toBeVisible();
    const title = `Browser signal ${Date.now()}`;
    await page.getByLabel("Signal title").fill(title);
    await page.getByLabel("Signal body").fill("Inspect this demo email signal.");
    await page.getByLabel("Signal source").selectOption("email");
    await page.getByRole("button", { name: "Add signal" }).click();
    const signal = page.getByRole("button", { name: new RegExp(title) });
    await expect(signal).toBeVisible();
    await signal.click();
    const inspector = page.getByRole("complementary", { name: "Agent Inbox Inspector" });
    await expect(inspector).toContainText("Inspect this demo email signal.");
    await inspector.getByRole("button", { name: "triaged", exact: true }).click();
    await expect(inspector).toContainText("email / triaged");
    await inspector.getByRole("button", { name: "Create Work Item" }).click();
    await expect(inspector).toContainText("Linked to work item");
    await inspector.getByRole("button", { name: "Create Artifact" }).click();
    await expect(inspector).toContainText("Artifact created");
  });

  test("triages an integration failure into a linked Work Item", async ({ page }) => {
    await page.goto("/");
    const contextResponse = await page.request.get("/api/workspace/context");
    const context = await contextResponse.json() as { context: { id: string } };
    const failureTitle = `Integration failure ${Date.now()}`;
    const created = await page.request.post("/api/incoming-signals", {
      data: {
        source: "integration",
        provider: "github",
        sourceId: `github:test/${Date.now()}:authentication`,
        title: failureTitle,
        body: "GitHub credentials were rejected.",
        repositoryId: context.context.id,
      },
    });
    expect(created.ok()).toBeTruthy();
    await page.reload();
    const signal = page.getByRole("button", { name: new RegExp(failureTitle) });
    await expect(signal).toBeVisible();
    await signal.click();
    const inspector = page.getByRole("complementary", { name: "Agent Inbox Inspector" });
    await inspector.getByRole("button", { name: "Create Work Item" }).click();
    await expect(inspector).toContainText("Linked to work item");
  });

  test("keeps operations, signals, and Work Items isolated across repositories", async ({ page }) => {
    const firstRoot = await mkdtemp(join(tmpdir(), "developer-agentic-os-e2e-first-"));
    const secondRoot = await mkdtemp(join(tmpdir(), "developer-agentic-os-e2e-second-"));
    const repositoryIds: string[] = [];
    try {
      await page.goto("/");
      for (const path of [firstRoot, secondRoot]) {
        const response = await page.request.post("/api/workspace/repositories", { data: { path } });
        expect(response.ok()).toBeTruthy();
        repositoryIds.push((await response.json()).id);
      }
      await page.reload();
      const switcher = page.getByRole("button", { name: "Workspace Switcher: Change the active repository context" });
      await switcher.click();
      const firstRepository = page.locator(".repository-option").filter({ hasText: firstRoot.split(/[\\/]/).pop() ?? "" });
      const secondRepository = page.locator(".repository-option").filter({ hasText: secondRoot.split(/[\\/]/).pop() ?? "" });
      await expect(firstRepository).toHaveCount(1);
      await expect(secondRepository).toHaveCount(1);
      await firstRepository.click();
      await expect(firstRepository).toHaveAttribute("aria-pressed", "true");

      const firstContext = await (await page.request.get("/api/workspace/context")).json() as { context: { id: string } };
      const firstTitle = `First repository signal ${Date.now()}`;
      const firstSignal = await page.request.post("/api/incoming-signals", { data: { source: "integration", provider: "github", sourceId: `github:first:${Date.now()}`, title: firstTitle, body: "First repository failure", repositoryId: firstContext.context.id } });
      expect(firstSignal.ok()).toBeTruthy();
      await page.reload();
      await expect(page.locator(".signal-row").filter({ hasText: firstTitle })).toBeVisible();
      await page.locator(".signal-row").filter({ hasText: firstTitle }).click();
      const firstInspector = page.getByRole("complementary", { name: "Agent Inbox Inspector" });
      await firstInspector.getByRole("button", { name: "Create Work Item" }).click();
      await expect(firstInspector).toContainText("Linked to work item");

      await switcher.click();
      await secondRepository.click();
      await expect(secondRepository).toHaveAttribute("aria-pressed", "true");
      await expect(page.locator(".signal-row").filter({ hasText: firstTitle })).toHaveCount(0);
      await expect(page.getByRole("status", { name: "Integration status" })).toHaveCount(0);
      await page.getByRole("button", { name: "Integration status" }).click();
      await expect(page.getByRole("status", { name: "Integration status" })).toContainText("Vercel operations");
    } finally {
      for (const id of repositoryIds) await page.request.delete(`/api/workspace/repositories/${id}`);
      await rm(firstRoot, { recursive: true, force: true });
      await rm(secondRoot, { recursive: true, force: true });
    }
  });

  test("shows Email adapter status and keeps the Email surface read-only", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Integration status" }).click();
    const status = page.getByRole("status", { name: "Integration status" });
    await expect(status).toContainText("Email");
    await expect(status).toContainText(/available|connected|disabled|error/);
    const email = page.locator('section[data-resizable-id="email"]');
    await expect(email).toBeVisible();
    await expect(email.getByRole("button")).toHaveCount(0);
  });

  test("shows the operations provider catalog and refreshes integration health", async ({ page }) => {
    let integrationRequests = 0;
    await page.route("**/api/integrations**", async (route) => {
      integrationRequests += 1;
      await route.continue();
    });
    await page.route("**/api/integrations/github**", (route) => route.fulfill({ json: { status: "healthy", message: "GitHub operations are available.", issues: [{ number: 1, title: "Fix health", url: "https://github.com/example/1" }], pullRequests: [], actions: [], mergeStatus: { state: "ready", message: "All open pull requests are mergeable." } } }));
    await page.route("**/api/integrations/vercel**", (route) => route.fulfill({ json: { status: "unhealthy", message: "Vercel deployment failed.", deployments: [{ id: "dpl_1", name: "broken", state: "error", buildLogUrl: "https://vercel.com/deployments/dpl_1", runtimeLogUrl: "https://vercel.com/project/logs" },], failure: { kind: "unavailable", message: "Deployment broken reported an error." } } }));

    await page.goto("/");
    await page.getByRole("button", { name: "Integration status" }).click();
    const status = page.getByRole("status", { name: "Integration status" });
    for (const name of ["Local Git", "GitHub", "Vercel", "Sentry", "Cloudflare", "CodeRabbit", "WorkOS", "Clerk", "Convex", "NeonDB", "Upstash", "Email", "Slack"]) {
      await expect(status).toContainText(name);
    }
    await expect(status).toContainText("GitHub operations");
    await expect(status).toContainText("Vercel operations");
    await expect(status).toContainText("Issue #1: Fix health");
    await expect(status).toContainText("Vercel deployment failed.");

    await status.getByRole("button", { name: "Refresh integration status" }).click();
    await expect.poll(() => integrationRequests).toBeGreaterThanOrEqual(2);
  });

  test("shows missing credentials and staged integration states", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Integration status" }).click();
    const status = page.getByRole("status", { name: "Integration status" });
    await expect(status).toContainText("unconfigured");
    await expect(status).toContainText("deferred");
    await expect(status).toContainText("Set VERCEL_TOKEN");
  });

  test("creates, edits, finalizes, and inspects a Session Handoff", async ({ page }) => {
    await page.goto("/");
    const app = page.getByRole("button", { name: "Session Handoff: Draft and finalize repository context" });
    await app.click();
    const handoff = page.getByRole("region", { name: "Session Handoff" });
    await expect(handoff).toBeVisible();
    const title = `Browser handoff ${Date.now()}`;
    await handoff.getByLabel("Handoff title").fill(title);
    await handoff.getByLabel("Handoff decisions").fill("Keep the repository-scoped snapshot");
    await handoff.getByLabel("Handoff blockers").fill("None");
    await handoff.getByLabel("Handoff next actions").fill("Review the immutable artifact");
    await handoff.getByRole("button", { name: "Create Draft" }).click();
    const draft = handoff.getByRole("button", { name: new RegExp(title) }).last();
    await expect(draft).toBeVisible();
    await draft.click();
    const inspector = page.getByRole("complementary", { name: "Session Handoff Inspector" });
    await expect(inspector).toContainText("Repository:");
    await inspector.getByLabel("Edit handoff next actions").fill("Review and share the immutable artifact");
    await inspector.getByRole("button", { name: "Save Draft" }).click();
    await expect(inspector.getByRole("status")).toContainText("Draft saved");
    await inspector.getByRole("button", { name: "Finalize Handoff" }).click();
    await expect(inspector).toContainText("Immutable Artifact:");
    await expect(inspector).toContainText("finalized");
  });

  test("runs a skill, opens configuration, and inspects an artifact", async ({ page }) => {
    await page.goto("/");
    const configure = page.getByRole("button", { name: /Configure/ }).first();
    await configure.click();
    await expect(page.getByRole("heading", { name: /matrix/ })).toBeVisible();
    await page.getByRole("button", { name: /Close skill configuration/ }).click();

    await page.getByRole("button", { name: /Run \/repo-summary/ }).click();
    await expect(page.getByRole("status")).toContainText(/Skill completed|Skill failed/);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Artifacts" })).toBeVisible();
    const artifact = page.locator(".artifact-dot").first();
    await expect(artifact).toBeVisible();
    await artifact.click();
    await expect(page.getByRole("complementary", { name: "Inspector Panel" })).toBeVisible();
    await page.getByRole("button", { name: "Open Artifact" }).click();
    await expect(page.locator(".inspector-content")).toBeVisible();
  });

  test("opens graph inspector, layout controls, and runs a routine", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Inspect/ }).first().click();
    await expect(page.getByRole("complementary", { name: "Inspector Panel" })).toBeVisible();
    await page.getByRole("button", { name: "Layout" }).click();
    await expect(page.getByRole("dialog", { name: "Layout resize" })).toBeVisible();
    await page.getByRole("button", { name: "Reset Layout" }).click();
    await page.getByRole("button", { name: "Close layout controls" }).click();
    await page.getByRole("button", { name: /Run .* Digest/ }).first().click();
    await expect(page.getByRole("status")).toContainText(/Routine completed|Routine failed/);
  });

  test("shows local background executor controls", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Trigger" })).toBeVisible();
    await expect(page.getByText(/background (on|off)/)).toBeVisible();
  });

  test("has no horizontal overflow on desktop and mobile", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});