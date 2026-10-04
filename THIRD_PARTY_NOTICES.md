# Third-party notices

This project bundles third-party code and soundpack recordings. Each is used under
the licence quoted here.

## Rustyvibes (mechanical keyboard sound engine)

The browser sound engine in `frontend/src/ts/sound/rustyvibes/` (`.rvw` decoding,
voice/mixer engine, key routing, sound math) and the catalog pipeline in
`frontend/scripts/generate-rustyvibes-catalog.ts` are adapted from
https://github.com/KunalBagaria/rustyvibes-v2 (commit used for this port: the state
of the repository when the files were vendored).

MIT License — Copyright (c) 2021–2026 Kunal Bagaria.

The full licence text is included at
`frontend/src/ts/sound/rustyvibes/LICENSE`.

## Soundpack recordings

The `.rvw` soundpacks in `frontend/static/sounds/rustyvibes/` are converted from the
soundpack catalog of rustyvibes-v2
(`scripts/data/rustyvibes-catalog.json` derives from its
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

Per-pack credits are also shown in the settings UI and stored in
`frontend/src/ts/sound/rustyvibes/catalog.ts`.
