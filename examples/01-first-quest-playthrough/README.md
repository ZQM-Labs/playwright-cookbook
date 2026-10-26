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
- Started and completed progress is restored from versioned browser local storage after reload.
- Invalid or structurally inconsistent saved progress is ignored and the fixture starts cleanly.
- Status updates are exposed through a live status region.

## Adapt it to a real game

Keep selectors tied to stable roles, labels, or explicit test IDs. Test the public player path rather than internal implementation details. For a real quest, add explicit assertions for failure states, offline transitions, duplicate actions, and server-verified entitlements. This fixture uses versioned browser local storage to demonstrate interrupted-session recovery, but it does not synchronize progress across devices or establish backend persistence.

The reward in this fixture is presentation-only. It is not a payment, authorization, or fulfillment implementation. A browser test that observes an unlocked UI does not prove that the backend protects paid content.

## Limits

This is a synthetic fixture and Chromium-only smoke test. Browser storage may be unavailable in some contexts; the fixture safely falls back to in-memory progress in that case. It does not establish compatibility with every browser, viewport, device, or production backend.
