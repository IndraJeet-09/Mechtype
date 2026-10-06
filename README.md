# MechType

**MechType — Type with the sound of your favorite mechanical keyboard.**

A typing experience powered by real mechanical keyboard sounds. Pick one of
twenty-one real switch sound profiles, from the crisp click of Cherry MX Blue to
the deep thock of Topre, and every keystroke you type plays that keyboard.

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

# About

MechType is a focused typing test built around mechanical keyboard sound.
Type what you see, see what you type, and hear it on a real switch.

- Minimal, dark, keyboard-first interface
- Live wpm, accuracy, and error feedback
- Twenty-one real mechanical keyboard soundpacks (linear, tactile, clicky)
- Instant switch preview: selecting a sound plays a short typing sample
- Sound categories, per-key variation, stereo panning, and a sound toggle
- Test modes, languages, quotes, themes, and a smooth caret
- Account system, themes, and persistence for your configuration

# Keyboard sounds

The soundtrack selector sits directly under the typing area. Click a card to
make that switch your active typing sound; the circular button previews it.

Soundpacks are decoded lazily and cached, so only the pack you pick is loaded.

# Development

```bash
pnpm install
pnpm dev-fe
pnpm lint-fe
pnpm test-fe
pnpm build-fe
```

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for the full workflow.

# Attribution

MechType is a fork of [Monkeytype](https://github.com/monkeytypegame/monkeytype)
(GPL-3.0) with its product identity replaced and a mechanical keyboard
soundtrack layer added.

Sound assets and audio technology come from:

- [rustyvibes](https://github.com/withoutname/rustyvibes) — RVW soundpack
  format and switch sampling
- [Mechvibes](https://github.com/hai-ngo/HelloMechvibes) — soundpacks
- [kbsim](https://github.com/tluijkema/kbsim) — soundpacks

See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for full license
notices.

# Security

To report a security vulnerability, please refer to [SECURITY.md](./docs/SECURITY.md).
