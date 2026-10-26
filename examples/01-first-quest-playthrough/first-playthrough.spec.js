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

test("objectives cannot be skipped and reload restores saved local progress", async ({ page }) => {
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
  await expect(page.getByRole("status")).toHaveText("Lantern found. Solve the riddle.");
  await expect(start).toBeDisabled();
  await expect(lantern).toBeDisabled();
  await expect(riddle).toBeEnabled();
  await expect(page.locator('[data-objective="lantern"]')).toHaveAttribute("data-complete", "true");
  await expect(page.locator('[data-objective="riddle"]')).toHaveAttribute("data-complete", "false");
  await expect(page.locator("#reward")).toBeHidden();
});

test("completed quest state survives reload without duplicating the reward", async ({ page }) => {
  await page.goto(questUrl);
  await page.getByRole("button", { name: "Start quest" }).click();
  await page.getByRole("button", { name: "Find lantern" }).click();
  await page.getByRole("button", { name: "Solve riddle" }).click();

  await page.reload();
  await expect(page.getByRole("status")).toHaveText("Quest complete. Demo reward unlocked.");
  await expect(page.locator("#reward")).toBeVisible();
  await expect(page.locator('[data-objective="lantern"]')).toHaveAttribute("data-complete", "true");
  await expect(page.locator('[data-objective="riddle"]')).toHaveAttribute("data-complete", "true");
  await expect(page.getByRole("button", { name: "Solve riddle" })).toBeDisabled();
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


test("malformed or impossible saved progress fails closed to a fresh quest", async ({ page }) => {
  await page.goto(questUrl);

  await page.evaluate(() => {
    localStorage.setItem("zqm-playwright-cookbook.quest.v1", "{not-json");
  });
  await page.reload();
  await expect(page.getByRole("status")).toHaveText("Quest not started.");
  await expect(page.getByRole("button", { name: "Start quest" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Find lantern" })).toBeDisabled();
  await expect(page.locator("#reward")).toBeHidden();

  await page.evaluate(() => {
    localStorage.setItem("zqm-playwright-cookbook.quest.v1", JSON.stringify({
      version: 1,
      started: true,
      lanternComplete: false,
      riddleComplete: true,
    }));
  });
  await page.reload();
  await expect(page.getByRole("status")).toHaveText("Quest not started.");
  await expect(page.getByRole("button", { name: "Start quest" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Find lantern" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Solve riddle" })).toBeDisabled();
  await expect(page.locator("#reward")).toBeHidden();
});


test("quest remains usable when browser storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("Storage access blocked", "SecurityError");
      },
    });
  });

  await page.goto(questUrl);
  await expect(page.getByRole("status")).toHaveText("Quest not started.");

  await page.getByRole("button", { name: "Start quest" }).click();
  await expect(page.getByRole("status")).toHaveText("Quest started. Find the lantern.");
  await page.getByRole("button", { name: "Find lantern" }).click();
  await expect(page.getByRole("status")).toHaveText("Lantern found. Solve the riddle.");
  await page.getByRole("button", { name: "Solve riddle" }).click();
  await expect(page.getByRole("status")).toHaveText("Quest complete. Demo reward unlocked.");

  // Progress is intentionally in-memory only when storage is blocked.
  await page.reload();
  await expect(page.getByRole("status")).toHaveText("Quest not started.");
  await expect(page.locator("#reward")).toBeHidden();
});
