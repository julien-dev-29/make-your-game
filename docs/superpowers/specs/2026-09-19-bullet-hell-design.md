# Bullet-Hell (Space Invaders genre) — Design Spec

Date: 2026-09-19
Status: approved
Genre framing: Space Invaders (vertical shooter) with bullet-hell density — audit-safe.

## 1. Goal
Single-player DOM-only shooter. Survive 90s, destroy waves, keep 60+ FPS on 60Hz and 165Hz screens. Keyboard only. No frameworks, no canvas.

## 2. Architecture
- `index.html` — game container, HUD, overlays (menu / pause / gameover).
- `style.css` — 3 layers only: `#game-layer`, `#hud-layer`, `#overlay-layer`.
- `js/main.js` — rAF loop, state machine (`menu / playing / paused / gameover / win`), FPS meter.
- `js/input.js` — `Set` of pressed codes, keydown/keyup + blur clear, no key-repeat reliance.
- `js/entities.js` — object pools: player x1, enemies max 12, player bullets 30, enemy bullets 80.
- `js/physics.js` — fixed-timestep accumulator (120Hz), AABB + small hitbox, dt in seconds.
- `js/ui.js` — HUD update (throttled to 4Hz text), overlays, pause menu wiring.
- All movement via `transform: translate3d(x,y,0)` + `opacity` only. No layout reads in loop. Cached arena bounds.

## 3. Entities & gameplay
- Player: speed 320 px/s, 8-dir, hitbox 10px (sprite 28px), 3 lives, 1.5s invincibility blink.
- Enemies: weaver (sine), diver (rush), gunner (aimed shots). Spawner every ~4s, difficulty ramp.
- Player bullets: speed 600 px/s up, fire rate 8/s while Space held.
- Enemy bullets: speed 120–220 px/s, patterns aimed + spiral + wall.
- Score: +100 kill, +10/s survival, combo x1–x5 (no-hit streak 8s window).
- Timer: 90s countdown → win. 0 lives → gameover. Restart resets all pools.

## 4. Controls & states
- Move: Arrows / WASD (multi-key OK). Fire: Space (hold). Pause: P / Esc. Confirm: Enter.
- Pause: rAF keeps running but skips update (renders frozen frame, no drops). Continue / Restart buttons + same keys.
- HUD: timer, score, lives, FPS + frame-time. Start menu with controls help.

## 5. Performance (60 FPS + 165Hz-safe)
- Fixed timestep decoupled from rAF rate: same speed at 60/120/165Hz.
- `dt = min(rawDt, 33ms)` clamp; accumulator steps of 1/120s, max 5 steps/frame (spiral-of-death guard).
- Pools pre-allocated, `display:none` toggling via `opacity`/transform, no alloc in loop.
- Passive key listeners, no forced sync layout, `will-change: transform` only on active bullets.
- FPS meter: rolling 60-frame avg + worst-frame in last second. Target: avg >= 60 (will read ~165 on 165Hz), no long-task > 8ms.
- Verification: DevTools Performance recording + paint flashing, manual test at 60Hz and 165Hz.

## 6. Data flow
input Set → physics step (move, collide) → pools update transforms → ui (throttled text) → rAF.

## 7. Error handling / edges
- Blur / visibilitychange → auto-pause. Resize → recompute cached bounds, clamp positions.
- Tab-hidden large dt clamped, no tunneling (speeds < hitbox/step size at 120Hz).

## 8. Testing
- Manual: hold-move smoothness, hold-fire, pause/continue/restart, survive 90s, die 3x, resize, blur.
- Perf: 30s Performance profile, check FPS graph, long tasks, layout count ~0 in loop.

## Self-review
- No TBD. Consistent: 3 layers, fixed 120Hz, pools sized above. Scope single-plan. Unambiguous: speeds px/s, timer 90s, lives 3.
