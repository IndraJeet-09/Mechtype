# Third-party notices

MechType is a **derivative project**. It combines GPL-3.0 code from
[Monkeytype](https://github.com/monkeytypegame/monkeytype) with MIT-licensed
sound-engine code and MIT-licensed soundpack recordings from other upstreams.
Those upstreams sit in different licensing contexts, so each is documented
separately here instead of being collapsed into a single statement.

- The root [`LICENSE`](./LICENSE) holds the verbatim **GNU GPL-3.0** text and
  governs this repository as a whole.
- Every component below keeps its **own** notice, and the upstream license file
  that belongs to it is preserved next to the code it covers.
- This file is a summary and a pointer. It does not replace the upstream
  license texts it references.

## Summary

| Component | Upstream | License | Where it lives |
| --- | --- | --- | --- |
| Monkeytype (base application) | [monkeytypegame/monkeytype](https://github.com/monkeytypegame/monkeytype) | GPL-3.0 | Whole repo except the rows below; [`LICENSE`](./LICENSE) |
| Rustyvibes browser sound engine | [KunalBagaria/rustyvibes-v2](https://github.com/KunalBagaria/rustyvibes-v2) | MIT | `frontend/src/ts/sound/rustyvibes/`, `frontend/scripts/generate-rustyvibes-catalog.ts`; `frontend/src/ts/sound/rustyvibes/LICENSE` |
| Mechvibes soundpacks (11 packs) | [hainguyents13/mechvibes](https://github.com/hainguyents13/mechvibes) | MIT | `frontend/static/sounds/rustyvibes/*.rvw`; notice below |
| kbsim soundpacks (10 packs) | [tplai/kbsim](https://github.com/tplai/kbsim) | MIT | `frontend/static/sounds/rustyvibes/*.rvw`; notice below |
| Font Awesome Free (icons, webfonts) | [FortAwesome/Font-Awesome](https://fontawesome.com/license/free) | MIT / CC BY 4.0 / SIL OFL 1.1 | `frontend/static/webfonts/`, `frontend/src/webfonts-generated/` |
| npm dependencies | various | various (MIT, Apache-2.0, BSD, …) | `package.json`, `pnpm-lock.yaml` (installed, not vendored) |

---

## Monkeytype (base application) — GPL-3.0

MechType is a fork of [Monkeytype](https://github.com/monkeytypegame/monkeytype),
the online typing test, with its product identity replaced and a mechanical
keyboard soundtrack layer added. Monkeytype is Copyright (c) Miodec and the
Monkeytype contributors, licensed under the GNU General Public License v3.0.

**Derived scope.** Essentially the entire repository:

- `frontend/`, `backend/`, `packages/`, `docker/`, `docs/`, `.github/`
- build, lint and test tooling (`turbo.json`, `oxlint`/`stylelint`/`vitest`
  configuration, release and asset scripts)
- data sets: quotes, languages, layouts, themes, challenges, funbox, default
  configuration
- the legacy UI sounds under `frontend/static/sounds/` (`click*`, `error*`,
  `fart-reverb.wav`, `timeWarning.wav`)

**MechType changes to that code** — branding, navigation and footer, the
`mechtype` theme, removal of Monkeytype-specific features and pages, and the
keyboard sound feature layered on top — are derivative works of GPL-3.0 code
and are themselves distributed under **GPL-3.0**.

**License text.** The verbatim GPL-3.0 text is kept at [`LICENSE`](./LICENSE),
the same text upstream distributes (byte-identical to
<https://www.gnu.org/licenses/gpl-3.0.txt>). GPL-3.0 requires that the
complete corresponding source of this project be distributed, and that both the
combined work and every derived file remain under GPL-3.0. Upstream copyright
and license statements are preserved in the files and in git history.

---

## Rustyvibes browser sound engine — MIT

The browser sound engine in `frontend/src/ts/sound/rustyvibes/` — `.rvw`
decoding, the voice/mixer engine, key routing and sound math — plus the catalog
pipeline in `frontend/scripts/generate-rustyvibes-catalog.ts` are adapted from
<https://github.com/KunalBagaria/rustyvibes-v2> (commit used for this port: the
state of the repository when the files were vendored). rustyvibes-v2 is itself
a port of the original `rustyvibes` project by `withoutname`, which introduced
the `.rvw` soundpack format.

Adapted files:

- `rvw.ts` — `.rvw` container decoding
- `engine.ts`, `voice.ts`, `sound-math.ts` — playback and mixing
- `key-router.ts`, `keys.ts` — key event to sample routing
- `packs.ts`, `catalog.ts` (generated) — pack loading and catalog metadata
- `frontend/scripts/generate-rustyvibes-catalog.ts` — catalog generator

MIT License — Copyright (c) 2021–2026 Kunal Bagaria.

The full license text is preserved at
`frontend/src/ts/sound/rustyvibes/LICENSE`, kept alongside the code it covers,
as MIT requires. MIT is permissive and compatible with this project's
GPL-3.0 distribution; the copyright line and permission notice are retained
unmodified.

---

## Soundpack recordings — MIT

The `.rvw` soundpacks in `frontend/static/sounds/rustyvibes/` are converted
from the soundpack catalog of rustyvibes-v2
(`frontend/scripts/data/rustyvibes-catalog.json` derives from its
`assets/soundpacks/catalog.json`), which ships the recordings below.

### Mechvibes

`cherry-mx-black-abs`, `cherry-mx-black-pbt`, `cherry-mx-red-abs`,
`cherry-mx-red-pbt`, `cherry-mx-brown-abs`, `cherry-mx-brown-pbt`,
`cherry-mx-blue-abs`, `cherry-mx-blue-pbt`, `topre-purple-hybrid-pbt`,
`everglide-crystal-purple`, `everglide-oreo` — from
https://github.com/hainguyents13/mechvibes (commit
`326252a13e7bef4f1c35d08ef0189b5af6f8ba02`).

```
MIT License

Copyright (c) 2021 Hai Nguyen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### kbsim

`gateron-black-ink`, `gateron-red-ink`, `novelkeys-cream`, `alpaca`,
`turquoise-tealios`, `holy-panda`, `topre`, `kailh-box-navy`, `skcm-blue-alps`,
`buckling-spring` — from https://github.com/tplai/kbsim (commit
`ba103f3b0afa9dab80447aa2e7e2ed80b6bd80e4`).

```
Copyright (c) Thomas Lai

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

Per-pack credits are stored with each pack in the `credit` field of
`frontend/src/ts/sound/rustyvibes/catalog.ts`, sourced from
`frontend/scripts/data/rustyvibes-catalog.json`.

---

## Font Awesome Free — MIT / CC BY 4.0 / SIL OFL 1.1

Icon fonts and SVG icons bundled under `frontend/static/webfonts/` and
`frontend/src/webfonts-generated/` come from Font Awesome Free:

- Font Awesome code — MIT License
- Font Awesome icons — CC BY 4.0
- Font Awesome fonts — SIL Open Font License 1.1

<https://fontawesome.com/license/free>

## npm dependencies

Runtime and tooling dependencies are declared in `package.json` and locked in
`pnpm-lock.yaml`. They are installed into `node_modules` at build time rather
than vendored into this repository, and each carries its own license (most are
MIT or Apache-2.0). Run `pnpm licenses ls` to enumerate the full set with
licenses.

---

## MechType-original work — GPL-3.0

Work written for MechType and not derived from any upstream includes:

- the mechanical keyboard sound feature and its integration with the typing
  test — `frontend/src/ts/sound/mechanical-keyboard-sound.ts`,
  `frontend/src/ts/components/pages/test/KeyboardSoundSelector.tsx`, the
  `mechanicalKeyboardSound` config option
- soundpack curation for the browser: selection, categories, descriptions,
  colors and preview copy
  (`frontend/scripts/data/rustyvibes-catalog.json`, generated metadata in
  `frontend/src/ts/sound/rustyvibes/catalog.ts`)
- the `mechtype` theme and other identity/branding changes
- UI and product changes: navigation, footer, account branding, removal of
  Monkeytype-specific features and pages
- MechType documentation (`README.md` and edits under `docs/`)

Copyright (c) 2026 IndraJeet09. Licensed under **GPL-3.0** — the same license
as the rest of the project, because this work is combined with and modifies
GPL-3.0 code.
