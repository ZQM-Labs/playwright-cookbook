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

A **Playwright cookbook** for web game QA: automated playthroughs, quest-flow checks, and screenshots. Patterns are written for browser games, where the playtester is a script driving the real player path — quest start, objectives, unlocks, and leaderboards — headlessly. It is intended for game developers who want every build playtested before players touch it. Validate each pattern against your own game, Playwright version, and operating environment before adopting it. Examples use synthetic players only, never real player accounts or data.

## Repository role and status

**Status:** Active, public — seeding. Pattern passes land in follow-up work; the table below lists what is planned, not what is already written.

**What this repository is:** Playwright patterns for web game QA — playthroughs, flow checks, and screenshots.

**What it contributes:** Part of the ZQM Labs game-development portfolio, and a sibling to the ZQM Computing geospatial cookbook series.

**Standing:** This repository is maintained independently. Automated checks cover only the paths and environments configured in its workflows; they do not establish production readiness or operational certification.

## Who this is for

Game developers who want automated, repeatable playtesting for browser games.

## Prerequisites

- Node.js and Playwright (version pinned per pattern at fill time)
- A locally servable build of the game under test
- A headless-capable environment (CI or a dev machine)

## Patterns (planned)

| # | Example | What it will demonstrate |
|---|---------|--------------------------|
| 01 | `01-first-playthrough` | A first automated playthrough: launch, start, and finish a quest |
| 02 | `02-quest-flow-checks` | Assertions on quest state: objectives, unlocks, and leaderboard updates |
| 03 | `03-screenshots` | Visual regression screenshots across viewports and devices |
| 04 | `04-ci-headless` | Running the suite headlessly in CI on every build |

## Repository layout

```text
playwright-cookbook/
├── examples/  # one directory per pattern
├── README.md
└── LICENSE
```

## Roadmap

- First pattern pass: first playthrough (01), then quest-flow checks (02)
- Second pass: screenshots (03) and CI headless runs (04)

## Contributing

A contributing guide lands with the first pattern pass. Report security issues to <zqmcomputing@gmail.com> — please do not open a public issue for those.
