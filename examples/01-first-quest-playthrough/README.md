# 01 — First automated quest playthrough

This example uses a local synthetic quest page to exercise a player's first-run path: start the quest, complete ordered objectives, and unlock a demo reward. It intentionally does not use real accounts, live APIs, location permissions, or production game data.

## Run it

Requires Node.js 20 or newer.

From this directory:

```sh
npm install --no-save @playwright/test@1.56.1
npx playwright install --with-deps chromium
npx playwright test
```

The spec opens `quest.html` directly using a local file URL, so no web server or external service is required.

## What the test asserts

- The quest starts in the expected state and later objectives begin disabled.
- Starting the quest enables the first objective.
- Completing the lantern objective enables the riddle.
- Completing the riddle marks the quest complete and reveals the demo reward.
- The start control can be activated from the keyboard.
- Status updates are exposed through a live status region.

## Adapt it to a real game

Keep selectors tied to stable roles, labels, or explicit test IDs. Test the public player path rather than internal implementation details. For a real quest, add explicit assertions for failure states, reload behavior, offline transitions, duplicate actions, and server-verified entitlements.

The reward in this fixture is presentation-only. It is not a payment, authorization, or fulfillment implementation. A browser test that observes an unlocked UI does not prove that the backend protects paid content.

## Limits

This is a synthetic fixture and Chromium-only smoke test. It does not establish compatibility with every browser, viewport, device, or production backend.
