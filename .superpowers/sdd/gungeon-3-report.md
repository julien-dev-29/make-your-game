# Gungeon G3 Report — Entities

- Task: G3 Entities — player/enemy/bullet pools + walls (plan 2026-09-19-gungeon-arena.md Task 3, verbatim).
- Files: `gungeon/js/entities.js`, `gungeon/tests/entities.test.mjs` (only files touched).
- RED first: `node gungeon/tests/entities.test.mjs` → FAIL `Cannot find module '../js/entities.js'` (verified).
- GREEN after: `node gungeon/tests/entities.test.mjs` → `entities ok`.
- Regression: `node gungeon/tests/input.test.mjs` → `input ok`.
- Commit: `9d476dc feat(gungeon): add pooled entities and walls`.
- Implementation: `createWorld(layer)` with player (hp 3, rollT/rollCd, face 1,0, invuln 0), pools 10/40/100, 2 walls, `spawnEnemy`/`firePlayer@550`/`fireEnemy`/`reset` with 3 plain for-loops; Node-testable via `document` fallback + optional `appendChild`.
- Concerns: none. Module-typeless warning only (pre-existing, no package.json change per do-not-touch rule).
