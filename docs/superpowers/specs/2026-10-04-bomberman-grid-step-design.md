# Bomberman (Grid-Step) — Design Spec

Date: 2026-10-04
Status: Approved (user chose A: grid-step)
Genre: Bomberman (pre-approved list)

## Goal
Single-player Bomberman clone. Plain JS/DOM + HTML, no canvas/frameworks.
60 FPS via requestAnimationFrame, keyboard-only, pause menu with
Continue/Restart, HUD with timer/score/lives + FPS meter.

## Architecture
- `src/input/input.ts` — `createInput()`: Set of held codes, listeners for
  Arrows + WASD + Space (bomb) + P/Escape (pause) + Enter (confirm).
  Exposes `pressedKeys`, `consumePressed()` for edge-trigger, `destroy()`.
  Movement reads held set every update (no key-repeat dependence).
- `src/level/level1.ts` — base 15x13 pillar grid. Tiles: 0 floor, 1 soft crate,
  2 hard wall/pillar, 4 player spawn marker (resolved at init).
  `buildLevel1Grid()` returns fresh grid with deterministic crates + spawn
  safe zone kept clear.
- `src/game/game-board.ts` — `Gameboard`: owns mutable grid copy,
  `isWalkable(x,y)`, `destroyAt(x,y)` (crate -> floor + score), bomb
  occupancy check.
- `src/player/player.ts` — `Player`: grid `position {x,y}`, `moveCooldown`,
  `update(dt, board, input)`: if cooldown elapsed, pick one held direction
  (priority: last-pressed), step 1 cell if walkable. Grid-step, no spam needed.
- `src/game/bomb.ts` — `Bomb {x,y,timer,range}`, `Explosion {cells,ttl}`.
  Tick timers in engine; cross-pattern blocked by hard walls, stops after
  first crate (destroys it), chain-triggers other bombs.
- `src/game/enemy.ts` — `Enemy {x,y,dir,stepTimer}`: grid-step wanderer,
  reverses/picks random valid dir on blocked cell. Killed by explosion cells.
- `src/game/game-engine.ts` — `GameEngine`: rAF loop, `dt = clamp(now-last, 50ms)`,
  accumulator fixed-step update (120Hz logic) + render every rAF.
  FPS EMA + frame-drop counter. States: `menu | playing | paused | gameover | win`.
  Pause keeps rAF alive but skips updates (no frame drops).
  Score, lives=3, timeMs count-up, crates/enemies remaining for win.
- `src/render/*` — static layer built once (195 `.cell` divs, classes per tile),
  updated via class toggles only on change. Dynamic layer: absolutely-positioned
  entities (`#entity-layer`) moved with `transform: translate3d`, opacity for
  explosion fade. 2 layers total. HUD + overlays as DOM.
- `src/main.ts` — wires HUD/menus/engine, keyboard shortcuts.

## Data flow
input Set -> engine.update(dt): player.tryStep -> bombs.tick -> explosions.tick
-> enemies.step -> collisions (player vs enemy/explosion) -> win/lose check
-> render: sync changed cells + entity transforms + HUD text (throttled 4Hz for
timer/score text, FPS 2Hz).

## 60 FPS strategy
- Never rebuild grid DOM per frame; static cells cached, dirty-cell updates only.
- Entities use `transform: translate3d()` + `opacity` (compositor only).
- No layout reads in loop; grid math on integers; `dt` clamp avoids spiral.
- `will-change: transform` on moving entities; max ~10 dynamic nodes.
- Perf HUD: FPS EMA + worst-frame + update/render ms via performance.now().

## Controls
- Arrows / ZQSD-WASD: hold to keep stepping (repeat via update, 150ms/step).
- Space: drop bomb (max 2 live, snap to player cell, edge-trigger).
- P or Escape: pause/resume. Enter: start/restart/confirm. R: restart when ended.
- preventDefault on game keys to avoid scroll.

## HUD / Menus
- HUD: TIME (mm:ss count-up), SCORE (+50 crate, +200 enemy, +500 win bonus),
  LIVES (3 hearts), FPS + frame ms.
- Pause overlay: Continue, Restart buttons (clickable + keyboard). Game never
  drops frames while paused (rAF continues, updates gated).
- Start overlay: title + controls + Start. GameOver/Win overlays: stats + Restart.

## Tiles
0 floor, 1 crate (destructible), 2 wall, bomb/explosion/enemy as entities, not tiles.

## Error handling
- Out-of-bounds treated as wall. Bomb on non-floor rejected. Restart fully
  resets grid/entities/timers/score (except lives reset to 3).
- Player spawn invulnerability 2s + safe zone clear of crates/enemies.

## Testing
- Vitest: player grid-step + cooldown + wall collision; board walkable/destroy;
  bomb cross blocked by wall/stops at crate; enemy reversal; engine state
  transitions pause/restart; renderGameboard cell classes.
- Manual: DevTools Performance recording, paint flashing, FPS meter.

## Self-review
- No TBDs. Scope is one level, one enemy type, fixed range=2 — fits single plan.
- Grid-step matches user choice; held-key auto-step satisfies "smooth, no spam".
- Two layers (static + entity) satisfies "minimal but not zero".
