# Task 5 Report — Main loop (states, spawner, render, FPS + UI)

## Status
Done. Created `js/ui.js` + `js/main.js` verbatim from plan Task 5, with one allowed deviation: `api.onHit` guard in `main.js` (early-return if `lives <= 0` or `player.invuln > 0`). No changes to Tasks 1–4 files.

## Commit
- `fca5481` — "feat: add main loop with states spawner render and FPS" (`js/main.js`, `js/ui.js`)

## Tests
- `node --check js/main.js && node --check js/ui.js` → `ok`
- Regressions: `node tests/input.test.mjs` → `input ok`; `node tests/entities.test.mjs` → `entities ok`; `node tests/physics.test.mjs` → `physics ok`
- DOM id check: all ids referenced in `main.js`/`ui.js` (`game-layer`, `btn-start`, `btn-continue`, `btn-restart-pause`, `btn-restart-over`, `gameover-title`, `gameover-stats`, `hud-timer`, `hud-score`, `hud-lives`, `hud-fps`, plus `menu`/`pause-menu`/`gameover` via `ui.show`) exist in `index.html` → `ids ok`
- Manual browser check (per plan: Enter starts, hold-move, Space fires, P pauses, HUD countdown, FPS meter) NOT run — no browser in this environment.

## Concerns
- Double-hit guard lives in `api.onHit` (main.js) rather than `physics.js`, per brief constraint; physics still calls `onHit` twice per step in bullet+enemy overlap, but second call is now a no-op. Correct behavior.
- `ui.show` string ids (`menu`, `pause-menu`, `gameover`) are dynamic lookups — covered by manual id grep, not the `getElementById('…')` regex.
- Browser-only verification (60/165Hz smoothness, pause stability) left for Task 6 perf pass.

## Path
- Files: `js/main.js`, `js/ui.js`
- Plan: `docs/superpowers/plans/2026-09-19-bullet-hell.md` (Task 5)
