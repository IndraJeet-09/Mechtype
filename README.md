# MechType

**Type with the sound of your favorite mechanical keyboard.**

A typing experience built around real switch sound. Pick one of twenty-one
sound profiles — from the crisp click of Cherry MX Blue to the deep thock of
Topre — and every keystroke you type plays that keyboard.

[![License: GPL v3](https://img.shields.io/badge/license-GPL--3.0-blue.svg?style=for-the-badge)](./LICENSE)&nbsp;
[![AnimeJs](https://img.shields.io/badge/Anime.js-ff4b4b?style=for-the-badge&logo=animedotjs&logoColor=white)](https://animejs.com/)&nbsp;
[![ChartJs](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)&nbsp;
[![OXLint](https://img.shields.io/badge/oxlint-2b3c5a?style=for-the-badge&logo=oxc&logoColor=white)](https://oxc.rs/docs/guide/usage/linter.html)&nbsp;
[![PNPM](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)&nbsp;
[![SASS](https://img.shields.io/badge/SASS-CC6699?style=for-the-badge&logo=SASS&logoColor=white)](https://sass-lang.com/)&nbsp;
[![Solid](https://img.shields.io/badge/solid-2C4F7C?style=for-the-badge&logo=solid&logoColor=white)](https://www.solidjs.com/)&nbsp;
[![Tailwind](https://img.shields.io/badge/tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)&nbsp;
[![Tanstack](https://img.shields.io/badge/Tanstack-EDE8D1?style=for-the-badge&logo=tanstack&logoColor=3A3A38)](https://tanstack.com/)&nbsp;
[![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)&nbsp;
[![Vite](https://img.shields.io/badge/Vite-9135FF?style=for-the-badge&logo=Vite&logoColor=white)](https://vitejs.dev/)&nbsp;
[![Vitest](https://img.shields.io/badge/vitest-00FF74?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)&nbsp;
[![Zod](https://img.shields.io/badge/-Zod-408AFF?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)

## Overview

MechType is a focused typing test built around mechanical keyboard sound.
Type what you see, see what you type, and hear it on a real switch.

- Minimal, dark, keyboard-first interface
- Live wpm, accuracy, and error feedback
- Twenty-one real mechanical keyboard soundpacks (linear, tactile, clicky)
- Instant switch preview: selecting a sound plays a short typing sample
- Sound categories, per-key variation, stereo panning, and a sound toggle
- Test modes, languages, quotes, themes, and a smooth caret
- Account system, themes, and persistence for your configuration

## Keyboard sounds

The soundtrack selector sits directly under the typing area. Click a card to
make that switch your active typing sound; the circular button previews it.

Soundpacks are decoded lazily and cached, so only the pack you pick is loaded.
Each pack lists its recording credit in
`frontend/src/ts/sound/rustyvibes/catalog.ts`.

| Category  | Example switches                                  |
| --------- | ------------------------------------------------- |
| Linear    | Cherry MX Black/Red, Gateron Ink, Alpaca, Cream   |
| Tactile   | Cherry MX Brown, Holy Panda, Everglide            |
| Clicky    | Cherry MX Blue, Kailh Box Navy, Blue Alps, Buckling spring |

Non-mechanical typing sounds (clicks, errors, and the classic Monkeytype
effects) remain available through the regular sound settings.

## Quick start

Prerequisites: Node.js (see [`.nvmrc`](./.nvmrc)) and pnpm.

```bash
pnpm install
pnpm dev-fe   # frontend dev server
pnpm dev-be   # backend dev server
```

Self-hosting (docker, databases, configuration) is covered in
[docs/SELF_HOSTING.md](./docs/SELF_HOSTING.md). The full contributor workflow
is in [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md).

## Development commands

| Command                     | What it does                                  |
| --------------------------- | --------------------------------------------- |
| `pnpm dev-fe`               | Frontend dev server (Vite)                    |
| `pnpm dev-be`               | Backend dev server                            |
| `pnpm build`                | Build all workspaces                          |
| `pnpm lint-fe`              | Lint frontend (oxlint, type-aware)            |
| `pnpm lint-fix`             | Auto-fix lint issues                          |
| `pnpm lint-styles`          | Lint CSS/SCSS (stylelint)                     |
| `pnpm test-fe`              | Frontend tests (Vitest)                       |
| `pnpm storybook`            | Component storybook                           |
| `pnpm full-check`           | Lint, build, and test everything              |

Run a single test file with `pnpm vitest run path/to/test.ts`.

## Project structure

```
backend/                        API, auth, databases
frontend/
  src/ts/                       Typing test UI (SolidJS components + legacy TS)
  src/ts/sound/rustyvibes/      Browser .rvw sound engine
  static/sounds/rustyvibes/     21 switch soundpacks (.rvw)
  scripts/                      Catalog generation and asset checks
packages/                       Shared contracts and utilities
docs/                           Contributor, quoting, theming, and ops docs
docker/                         Self-hosting setup
```

## Documentation

- [Contributing](./docs/CONTRIBUTING.md) — setup, workflow, code standards
- [Self-hosting](./docs/SELF_HOSTING.md) — running your own instance
- [Quotes](./docs/QUOTES.md), [Languages](./docs/LANGUAGES.md),
  [Themes](./docs/THEMES.md), [Layouts](./docs/LAYOUTS.md),
  [Fonts](./docs/FONTS.md) — adding content
- [Code of conduct](./docs/CODE_OF_CONDUCT.md)

## Security

To report a security vulnerability, please refer to
[docs/SECURITY.md](./docs/SECURITY.md).

## License and attribution

MechType is free software distributed under the
[GNU General Public License v3.0](./LICENSE) — see `LICENSE` for the full
terms. It is a derivative work of
[Monkeytype](https://github.com/monkeytypegame/monkeytype) (GPL-3.0), with
MechType-original changes released under the same license.

Because this project mixes more than one upstream licensing context, component
level attribution is kept separately in
[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md), which documents:

- **Monkeytype** — base application, GPL-3.0
- **rustyvibes-v2** — browser `.rvw` sound engine, MIT
  (`frontend/src/ts/sound/rustyvibes/LICENSE`)
- **Mechvibes** and **kbsim** — soundpack recordings, MIT
- **Font Awesome Free** — icons and webfonts, MIT / CC BY 4.0 / SIL OFL 1.1
- which parts of the repository are MechType-original work

Upstream license files are preserved in place next to the code they cover, and
MechType-original work is distinguished from Monkeytype-derived code and
Rustyvibes-derived audio code in the same document.
