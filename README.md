# Playwright Cookbook

<!-- ZQM-START -->
<!-- markdownlint-disable MD033 -->
<p align="center">
  <strong>ZQM Labs</strong><br>
  <a href="https://github.com/ZQM-Labs">ZQM Labs</a>
</p>
<!-- markdownlint-enable MD033 -->
<!-- ZQM-END -->

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A **Playwright cookbook** for browser-game QA: automated quest playthroughs, flow assertions, and visual checks. Examples use synthetic players and local fixtures unless a recipe explicitly documents an external test environment. Never commit real player data, credentials, session cookies, or production traces.

## Repository role and status

**Status:** Active, public — first automated playthrough implemented.

**What this repository is:** Practical Playwright recipes for testing the public player path through browser games, from quest start and objective progression to completion and failure states.

**What it contributes:** Part of the ZQM Labs game-development portfolio. It complements ZQM Computing's geospatial cookbooks by validating interactive game behavior rather than spatial data processing.

**Quality bar:** Pin test tooling, use stable accessible selectors, assert visible outcomes, isolate fixtures from production services, and document what each test does not prove. A green synthetic fixture is not evidence that a live backend or paid fulfillment path works.

## Who this is for

Game developers building repeatable browser playtests and regression checks for quest-style games.

## Prerequisites

- Node.js 20+
- Chromium installed by Playwright
- No live accounts or external game services for the first example

## Patterns

### 01 — First quest playthrough (implemented)

[Open the example](examples/01-first-quest-playthrough/). Drives a synthetic quest through start, ordered objectives, completion, and demo reward visibility. Includes keyboard activation and live status assertions.

### 02 — Quest-flow checks (implemented foundation)

The first suite now verifies that later objectives stay disabled until prerequisites are met and that reloading resets the synthetic fixture. Duplicate objective events are now tested against the local fixture. Interrupted-session recovery and backend persistence remain future cases.

### 03 — Screenshots and viewports (planned)

Stable screenshots across chosen viewports, with explicit handling for animation, fonts, and nondeterministic content.

### 04 — CI headless runs (implemented foundation)

[Workflow](.github/workflows/examples.yml) installs the declared Playwright test package and Chromium, then runs the first playthrough on pull requests and pushes to main. Browser coverage is Chromium-only until additional projects are deliberately configured.

## Quick start

From the repository root:

```sh
npm install
npx playwright install chromium
npm test
```

The test opens a local HTML fixture directly; no web server or external service is required for the game fixture. Browser installation may require network access. The manifest pins the direct Playwright dependency; until a lockfile is committed, transitive dependency versions are not fully frozen.

## Repository layout

```text
playwright-cookbook/
├── .github/workflows/examples.yml
├── examples/
│   └── 01-first-quest-playthrough/
│       ├── quest.html
│       ├── first-playthrough.spec.js
│       └── README.md
├── package.json
├── playwright.config.js
└── README.md
```

## Engineering principles

- Prefer accessible roles and labels over brittle CSS selectors.
- Assert user-visible state and meaningful transitions, not implementation details alone.
- Test both permitted and denied flows as a game adds authorization-sensitive behavior.
- Keep demo fixtures synthetic and offline where possible.
- Never treat an unlocked client-side UI as proof of payment or server authorization.
- Capture traces on failure, but review them for tokens, personal data, and sensitive URLs before sharing.
- Distinguish fixture tests from live integration tests and production certification.

## Roadmap

1. Add interrupted-session recovery cases and a separate backend-persistence integration recipe.
2. Commit and maintain a lockfile for reproducible dependency resolution.
3. Add controlled screenshot testing at selected viewport sizes.
4. Add an integration recipe that runs against an explicitly configured local game build.
5. Expand browser coverage only when the CI runtime and test matrix are maintained.

## Contributing

Each recipe should include a runnable fixture or clearly defined test target, exact commands, expected outcomes, known limitations, and privacy-safe artifacts. Report security issues to <zqmcomputing@gmail.com> — please do not open a public issue for those.
