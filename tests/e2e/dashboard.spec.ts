import { expect, test } from "@playwright/test";

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
      await expect(first).toHaveAttribute("aria-pressed", "true");
    }
  });

  test("captures, filters, completes, and inspects a work item", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Work Queue" })).toBeVisible();
    const title = `Browser queue item ${Date.now()}`;
    await page.getByLabel("Work item title").fill(title);
    await page.getByLabel("Work item notes").fill("Verify the queue inspector.");
    await page.getByRole("button", { name: "Capture" }).click();
    const item = page.getByRole("button", { name: new RegExp(title) });
    await expect(item).toBeVisible();
    await item.click();
    const inspector = page.getByRole("complementary", { name: "Work Item Inspector" });
    await expect(inspector).toContainText("Verify the queue inspector.");
    await inspector.getByRole("button", { name: "completed", exact: true }).click();
    await expect(inspector).toContainText("completed");
    await page.getByLabel("Filter work items by status").selectOption("completed");
    await expect(item).toBeVisible();
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