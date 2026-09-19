# G7 Report — Perf pass + audit verification

## Tests (fresh run, this session)
```
node gungeon/tests/input.test.mjs    → input ok
node gungeon/tests/entities.test.mjs → entities ok
node gungeon/tests/room.test.mjs     → room ok
node gungeon/tests/physics.test.mjs  → physics ok
node --check gungeon/js/main.js      → OK
node --check gungeon/js/ui.js        → OK
ALL-OK
```
(Only warnings: MODULE_TYPELESS_PACKAGE_JSON reparsing notices, harmless.)

## Static audit
- Layout reads `offsetWidth|offsetHeight|getBoundingClientRect|querySelector|getComputedStyle|clientWidth|clientHeight` in `gungeon/js`: **0 hits** — PASS.
- `.style.` writes (9 matches):
  - `main.js` loop: `display` (guarded), `transform: translate3d` (hot path), `opacity` (player blink only) — allowed.
  - `entities.js` init only: `width/height/background/display`, wall init `display/transform` — allowed.
- Verdict: **PASS** — transform/opacity-only loop, no layout reads.

## Hot-path alloc review
- `physics.js step()`: `moveKeys()` returns one `{dx,dy}` per step (≤5/frame); `aimDir()` one small object per step; `Math.hypot` ≤10 enemies × 5 steps. No loop arrays. `HITBOX`/`MOVES` already hoisted. Trivial — no fix.
- `main.js render()`: per-entity template string for `translate3d`, guarded `display` writes. Expected, no fix.
- `room.js freeSpot()`: allocates only on spawn tick (0.5 s interval). No fix.
- Guards verified present: HUD 4 Hz (`ui.frame` acc 0.25 s), FPS text 0.5 s, dt clamp 33 ms, max 5 steps of 1/120, fixed pools (10/40/100), rAF always re-armed (pause-safe: early return after scheduling).

## Verdict
**Changed-or-clean: CLEAN — no code change.** No profile-evident issue found in static review; per brief, fix only if profile-evident. No DevTools profile available in this environment (headless), so no browser numbers claimed.

## Manual browser checklist (for operator)
1. `python -m http.server 8000` from repo root, open `http://localhost:8000/gungeon/`.
2. Record DevTools Performance 30 s heavy play (wave 3, rolling through spiral): expect avg ≥60 (reads ~165 on 165 Hz), no long-task >8 ms.
3. Paint flashing: only game-layer rects (HUD 4 Hz text).
4. Pause/resume (P, Esc, blur, visibilitychange): gapless, `last` reset on resume.
5. 60/165 Hz: same speed (dt clamp + fixed 120 Hz accumulator).
