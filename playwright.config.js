const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./examples/01-first-quest-playthrough",
  testMatch: "**/*.spec.js",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    browserName: "chromium",
    headless: true,
    trace: "retain-on-failure",
  },
});
