const { test, expect } = require("@playwright/test");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const questUrl = pathToFileURL(path.join(__dirname, "quest.html")).href;

test("player can start and complete the synthetic quest", async ({ page }) => {
  await page.goto(questUrl);

  await expect(page.getByRole("heading", { name: "Lantern Trail: Test Quest" })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Quest not started.");
  await expect(page.getByRole("button", { name: "Find lantern" })).toBeDisabled();

  await page.getByRole("button", { name: "Start quest" }).click();
  await expect(page.getByRole("status")).toHaveText("Quest started. Find the lantern.");

  await page.getByRole("button", { name: "Find lantern" }).click();
  await expect(page.locator('[data-objective="lantern"]')).toHaveAttribute("data-complete", "true");
  await expect(page.getByRole("status")).toHaveText("Lantern found. Solve the riddle.");

  await page.getByRole("button", { name: "Solve riddle" }).click();
  await expect(page.locator('[data-objective="riddle"]')).toHaveAttribute("data-complete", "true");
  await expect(page.getByText("Demo reward unlocked.")).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Quest complete. Demo reward unlocked.");
});

test("quest controls support keyboard activation", async ({ page }) => {
  await page.goto(questUrl);
  const start = page.getByRole("button", { name: "Start quest" });
  await start.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Quest started. Find the lantern.");
});
