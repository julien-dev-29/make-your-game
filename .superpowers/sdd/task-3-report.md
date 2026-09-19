# Task 3 Report — Entities (pooled DOM divs)

## Implementation
- Created `js/entities.js` verbatim from plan: `makeDiv`/`makePool` helpers with `document` fallback (`{ style: {} }`), Node-testable via `layer.appendChild?.(el)`.
- `createWorld(layer)` returns `{ player, enemies, pBullets, eBullets, spawnEnemy, firePlayer, fireEnemy, reset }`; entity shape `{ el, x, y, vx, vy, w, h, active, kind }` (+ `player.invuln`, enemy `t`).
- Pools: player 28x20 `#4df3ff` at (386,540); 12 enemies 30x22 `#ff4d6d`; 30 pBullets 4x12 `#ffe14d` (vy -600); 80 eBullets 7x7 `#ff8b3d`.
- Appended to `style.css`: `.player/.enemy/.pb/.eb` border-radius rules verbatim. Did NOT modify `js/input.js`.

## TDD RED/GREEN
- RED: wrote `tests/entities.test.mjs` verbatim first; `node tests/entities.test.mjs` → FAIL `ERR_MODULE_NOT_FOUND .../js/entities.js` as expected.
- GREEN: after implementation → `entities ok`; regression `node tests/input.test.mjs` → `input ok` (both with only typeless-package warnings).

## Files
- `js/entities.js` (new), `tests/entities.test.mjs` (new), `style.css` (+4 lines).

## Self-review
- Interfaces match plan exactly: names `createWorld`, `spawnEnemy(type,x)`, `firePlayer()`, `fireEnemy(x,y,vx,vy)`, `reset()`; shape consumed by Task 4 `physics.js`/`main.js`.
- Node-testable: no `document` dependency (fallback), optional-chained `appendChild`.
- `git status` pre-commit showed only the 3 intended files modified; `js/input.js` untouched.

## Concerns
- None blocking. Minor: `reset()` uses array spread (allocates) — plan Task 6 already flags this for perf pass; fine for now.
- Minor: Node emits `MODULE_TYPELESS_PACKAGE_JSON` warning (no `"type": "module"`); harmless, out of scope.
