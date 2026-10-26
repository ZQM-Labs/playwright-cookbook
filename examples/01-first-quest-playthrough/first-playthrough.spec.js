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
  await expect(page.locator("#reward")).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Quest complete. Demo reward unlocked.");
});

test("quest controls support keyboard activation", async ({ page }) => {
  await page.goto(questUrl);
  const start = page.getByRole("button", { name: "Start quest" });
  await start.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Quest started. Find the lantern.");
});

test("objectives cannot be skipped and reload resets the local fixture", async ({ page }) => {
  await page.goto(questUrl);

  const start = page.getByRole("button", { name: "Start quest" });
  const lantern = page.getByRole("button", { name: "Find lantern" });
  const riddle = page.getByRole("button", { name: "Solve riddle" });

  await expect(lantern).toBeDisabled();
  await expect(riddle).toBeDisabled();

  await start.click();
  await expect(lantern).toBeEnabled();
  await expect(riddle).toBeDisabled();

  await lantern.click();
  await expect(riddle).toBeEnabled();

  await page.reload();
  await expect(page.getByRole("status")).toHaveText("Quest not started.");
  await expect(start).toBeEnabled();
  await expect(lantern).toBeDisabled();
  await expect(riddle).toBeDisabled();
  await expect(page.locator("#reward")).toBeHidden();
});

test("duplicate objective events do not regress completed quest state", async ({ page }) => {
  await page.goto(questUrl);
  await page.getByRole("button", { name: "Start quest" }).click();
  const lantern = page.getByRole("button", { name: "Find lantern" });
  const riddle = page.getByRole("button", { name: "Solve riddle" });

  await lantern.click();
  await riddle.click();
  await expect(page.getByRole("status")).toHaveText("Quest complete. Demo reward unlocked.");
  await expect(page.locator("#reward")).toBeVisible();

  // Dispatch duplicate DOM events to exercise the handlers even after controls disable.
  await lantern.evaluate((button) => button.dispatchEvent(new MouseEvent("click", { bubbles: true })));
  await riddle.evaluate((button) => button.dispatchEvent(new MouseEvent("click", { bubbles: true })));

  await expect(page.locator('[data-objective="lantern"]')).toHaveAttribute("data-complete", "true");
  await expect(page.locator('[data-objective="riddle"]')).toHaveAttribute("data-complete", "true");
  await expect(page.getByRole("status")).toHaveText("Quest complete. Demo reward unlocked.");
  await expect(page.locator("#reward")).toBeVisible();
});
