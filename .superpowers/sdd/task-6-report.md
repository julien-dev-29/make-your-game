# Task 6 Report — Perf pass + audit verification

## Changes (small, behavior-identical)
- `js/physics.js`: hoisted per-step hitbox alloc to module-scope `const HITBOX = {x:0,y:0,w:10,h:10}`; `step()` now mutates `HITBOX.x/y` only. Zero allocs in hot path.
- `js/entities.js`: `reset()` spread `[...enemies,...pBullets,...eBullets]` replaced with three plain `for...of` loops, no alloc.
- `js/ui.js`: HUD `frame()` shows `String(Math.floor(game.score))`; `gameover()` shows `Score ${Math.floor(game.score)}`. Internal `game.score` stays float (`main.js:85` `+= raw*10` untouched).
- `js/main.js`: no change needed (score display lives in `ui.js`); render loop already guarded.

## Test outputs
- `node tests/input.test.mjs` → `input ok` (PASS)
- `node tests/entities.test.mjs` → `entities ok` (PASS)
- `node tests/physics.test.mjs` → `physics ok` (PASS)
- `node --check js/main.js` → PASS; `node --check js/ui.js` → PASS; `ALL-OK`
- (Note: Node prints MODULE_TYPELESS_PACKAGE_JSON warnings — harmless, no `type:module` in package.json.)

## Static audit
- Grep `offsetWidth|offsetHeight|getBoundingClientRect|querySelector` in `js/` → **no hits**. No layout reads in loop.
- Grep `\.style\.` in `js/` → only:
  - `main.js` render: `display`, `transform: translate3d`, `opacity` (+ guarded display writes) — compliant.
  - `entities.js` `makeDiv` (init-time only): `width/height/background/display` — not in loop.
- HUD text writes throttled: `ui.frame` 4Hz, `ui.fps` 2Hz. Physics uses pooled arrays, cached `W/H` constants.

## Manual browser checklist (for user — requires DevTools, not doable headless here)
1. Open `index.html` → Enter starts, hold arrows/WASD smooth, Space fires, P/Esc pauses.
2. DevTools Performance → record 30s heavy play → FPS avg ≥ 60 (≈165 on 165Hz), no long tasks, no dropped-frame gaps on pause/resume (Continue + Restart).
3. Rendering → Paint flashing: only game-layer rects repaint; HUD/overlay static except 4Hz text.
4. Test 60Hz vs 165Hz (or device emulation): same game speed (dt-clamped, 120Hz fixed step, max 5 substeps).
5. Blur tab / switch away mid-play → auto-pauses; resume via Continue keeps timer/positions stable.
