# Bomberman Grid-Step Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build playable grid-step Bomberman with 60 FPS rAF engine, pause menu, HUD.

**Architecture:** Fixed-step logic (120Hz accumulator) + rAF render; static cell layer built once + entity layer moved via transform3d; keyboard Set input with held-key auto-step.

**Tech Stack:** TypeScript + Vite, plain DOM (no canvas/frameworks), Vitest browser tests.

## Global Constraints

- No canvas, no frameworks; plain JS/DOM + HTML only for game rendering.
- Must use requestAnimationFrame; target 60 FPS; measure + display FPS.
- Keyboard only: held key must keep acting (no spam); smooth grid-step 150ms.
- Pause menu with Continue + Restart; scoreboard with timer + score + lives.
- Layers minimal but not zero: exactly 2 (static board + entity layer).
- Only transform/opacity for per-frame motion.

---

### Task 1: Input — held-key Set + edge-trigger bomb/pause

**Files:**
- Modify: `src/input/input.ts`
- Test: `src/input/input.spec.ts` (create)

**Interfaces:**
- Consumes: DOM window keydown/keyup.
- Produces: `createInput(): { pressedKeys: Set<string>, lastDirection: string|null, consumeBomb(): boolean, consumePause(): boolean, consumeConfirm(): boolean, destroy(): void }`
- Codes: `ArrowUp/Down/Left/Right`, `KeyW/A/S/D`, `Space` (bomb edge), `KeyP/Escape` (pause edge), `Enter` (confirm edge). preventDefault on handled codes.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from "vitest";
import { createInput } from "./input";

describe("input", () => {
  test("tracks held keys and consumes bomb edge", () => {
    const input = createInput();
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowLeft" }));
    expect(input.pressedKeys.has("ArrowLeft")).toBe(true);
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
    expect(input.consumeBomb()).toBe(true);
    expect(input.consumeBomb()).toBe(false);
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "ArrowLeft" }));
    expect(input.pressedKeys.has("ArrowLeft")).toBe(false);
    input.destroy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/input/input.spec.ts`
Expected: FAIL (consumeBomb/destroy missing).

- [ ] **Step 3: Write minimal implementation**

```ts
const MOVE_CODES = new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","KeyW","KeyA","KeyS","KeyD"]);
const HANDLED = new Set([...MOVE_CODES, "Space","KeyP","Escape","Enter"]);

export function createInput() {
  const pressedKeys = new Set<string>();
  let lastDirection: string | null = null;
  let bombQueued = false;
  let pauseQueued = false;
  let confirmQueued = false;
  const down = (e: KeyboardEvent) => {
    if (!HANDLED.has(e.code)) return;
    e.preventDefault();
    if (e.repeat) return;
    if (MOVE_CODES.has(e.code)) { pressedKeys.add(e.code); lastDirection = e.code; }
    if (e.code === "Space") bombQueued = true;
    if (e.code === "KeyP" || e.code === "Escape") pauseQueued = true;
    if (e.code === "Enter") confirmQueued = true;
  };
  const up = (e: KeyboardEvent) => {
    if (MOVE_CODES.has(e.code)) {
      pressedKeys.delete(e.code);
      if (lastDirection === e.code) {
        const rest = [...pressedKeys];
        lastDirection = rest.length ? rest[rest.length - 1] : null;
      }
    }
  };
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  return {
    pressedKeys,
    get lastDirection() { return lastDirection; },
    consumeBomb() { const b = bombQueued; bombQueued = false; return b; },
    consumePause() { const p = pauseQueued; pauseQueued = false; return p; },
    consumeConfirm() { const c = confirmQueued; confirmQueued = false; return c; },
    destroy() { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/input/input.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/input/input.ts src/input/input.spec.ts
git commit -m "feat: add held-key input with edge triggers"
```

### Task 2: Level + Board — fresh grid, walkable, destroy crates

**Files:**
- Modify: `src/level/level1.ts`, `src/game/game-board.ts`
- Test: `src/game/game-board.spec.ts` (create)

**Interfaces:**
- Consumes: nothing.
- Produces: `buildLevel1Grid(): number[][]` (0 floor, 1 crate, 2 wall; spawn (1,1)+(2,1)+(1,2) forced floor); `class Gameboard { constructor(grid: number[][]); grid: number[][]; isWalkable(x,y): boolean; destroyAt(x,y): boolean; }`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from "vitest";
import { buildLevel1Grid } from "../level/level1";
import { Gameboard } from "./game-board";

describe("board", () => {
  test("spawn zone is floor and walls block", () => {
    const board = new Gameboard(buildLevel1Grid());
    expect(board.isWalkable(1, 1)).toBe(true);
    expect(board.isWalkable(0, 0)).toBe(false);
    expect(board.destroyAt(1, 1)).toBe(false);
  });
  test("destroys a crate into floor", () => {
    const board = new Gameboard(buildLevel1Grid());
    let found: [number, number] | null = null;
    board.grid.forEach((row, y) => row.forEach((v, x) => { if (v === 1 && !found) found = [x, y]; }));
    expect(found).not.toBeNull();
    const [x, y] = found!;
    expect(board.destroyAt(x, y)).toBe(true);
    expect(board.grid[y][x]).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/game/game-board.spec.ts`
Expected: FAIL (buildLevel1Grid missing).

- [ ] **Step 3: Write minimal implementation**

```ts
// level1.ts
const BASE: number[][] = [ ...15x13 pillar map with 0/2... ];
export function buildLevel1Grid(): number[][] {
  const grid = BASE.map((r) => [...r]);
  const crates: [number, number][] = [[3,1],[5,1],[7,1],[1,3],[2,3],[3,3],[4,3]];
  // fill: every floor cell with (x+y) odd and not in safe zone becomes crate
  grid.forEach((row, y) => row.forEach((v, x) => {
    if (v === 0 && (x + y) % 2 === 1) grid[y][x] = 1;
  }));
  [[1,1],[2,1],[1,2]].forEach(([x, y]) => { grid[y][x] = 0; });
  crates.forEach(([x, y]) => { if (grid[y][x] === 0) grid[y][x] = 1; });
  return grid;
}
export class Level1 { ... keep for compat, grid getter returns buildLevel1Grid() ... }
```

```ts
// game-board.ts
export class Gameboard {
  constructor(private _grid: number[][]) {}
  get grid() { return this._grid; }
  inBounds(x: number, y: number) { return y >= 0 && y < this._grid.length && x >= 0 && x < this._grid[0].length; }
  isWalkable(x: number, y: number) { return this.inBounds(x, y) && this._grid[y][x] === 0; }
  destroyAt(x: number, y: number) {
    if (!this.inBounds(x, y) || this._grid[y][x] !== 1) return false;
    this._grid[y][x] = 0;
    return true;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/game/game-board.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/level/level1.ts src/game/game-board.ts src/game/game-board.spec.ts
git commit -m "feat: add level builder and board collisions"
```

### Task 3: Player — grid-step with cooldown, wall collision

**Files:**
- Modify: `src/player/player.ts`, `src/player/player.spec.ts`
- Test: reuse `src/player/player.spec.ts`

**Interfaces:**
- Consumes: `Gameboard.isWalkable`, input `{ pressedKeys: Set<string>, lastDirection: string|null }`.
- Produces: `class Player { position: {x,y}; constructor(name, position); tryStep(dirCode, board): boolean; update(dtMs, board, input): boolean; reset(x,y): void }`
- Step cooldown 150ms; direction map: ArrowUp/KeyW -y, etc.

- [ ] **Step 1: Write the failing test**

```ts
test("steps once per cooldown while key held", () => {
  const board = new Gameboard(buildLevel1Grid());
  const player = new Player("Hero", { x: 1, y: 1 });
  const input = { pressedKeys: new Set(["ArrowRight"]), lastDirection: "ArrowRight" };
  // hmm: (2,1) is forced floor so step succeeds
  expect(player.update(0, board, input as any)).toBe(false);
  expect(player.update(160, board, input as any)).toBe(true);
  expect(player.position).toEqual({ x: 2, y: 1 });
});
test("blocked by wall", () => {
  const board = new Gameboard(buildLevel1Grid());
  const player = new Player("Hero", { x: 1, y: 1 });
  expect(player.tryStep("ArrowUp", board)).toBe(false);
  expect(player.position).toEqual({ x: 1, y: 1 });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/player/player.spec.ts`
Expected: FAIL (signature changed).

- [ ] **Step 3: Write minimal implementation**

```ts
const DIRS: Record<string, { dx: number; dy: number }> = {
  ArrowUp: { dx: 0, dy: -1 }, KeyW: { dx: 0, dy: -1 },
  ArrowDown: { dx: 0, dy: 1 }, KeyS: { dx: 0, dy: 1 },
  ArrowLeft: { dx: -1, dy: 0 }, KeyA: { dx: -1, dy: 0 },
  ArrowRight: { dx: 1, dy: 0 }, KeyD: { dx: 1, dy: 0 },
};
export class Player {
  static STEP_MS = 150;
  private _cooldown = 0;
  constructor(private _name: string, private _position: { x: number; y: number }) {}
  get name() { return this._name; }
  get position() { return this._position; }
  set position(p) { this._position = { ...p }; }
  reset(x: number, y: number) { this._position = { x, y }; this._cooldown = 0; }
  tryStep(code: string, board: { isWalkable(x: number, y: number): boolean }) {
    const d = DIRS[code];
    if (!d) return false;
    const nx = this._position.x + d.dx, ny = this._position.y + d.dy;
    if (!board.isWalkable(nx, ny)) return false;
    this._position = { x: nx, y: ny };
    return true;
  }
  update(dtMs: number, board: { isWalkable(x: number, y: number): boolean }, input: { pressedKeys: Set<string>; lastDirection: string | null }) {
    this._cooldown -= dtMs;
    const code = input.lastDirection && input.pressedKeys.has(input.lastDirection)
      ? input.lastDirection
      : [...input.pressedKeys].pop() ?? null;
    if (!code || this._cooldown > 0) return false;
    const moved = this.tryStep(code, board);
    this._cooldown = Player.STEP_MS;
    return moved;
  }
}
```

Keep old constructor compat: third arg optional ignored.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/player/player.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/player/player.ts src/player/player.spec.ts
git commit -m "feat: add grid-step player with cooldown"
```

### Task 4: Bombs + Enemies — cross explosion, chain, wander AI

**Files:**
- Create: `src/game/bomb.ts`, `src/game/enemy.ts`
- Test: `src/game/combat.spec.ts` (create)

**Interfaces:**
- Consumes: `Gameboard`.
- Produces: `type Bomb { x,y,timerMs,range }; type Explosion { cells: {x,y}[], ttlMs }; computeBlast(grid, x, y, range): { cells, destroyed: {x,y}[] }; class BombManager { bombs: Bomb[]; explosions: Explosion[]; place(x,y): boolean; update(dtMs, board): { score: number; hitCells: {x,y}[] }; }`; `class Enemy { pos; dirIdx; stepMs; update(dtMs, board): void; }`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from "vitest";
import { computeBlast } from "./bomb";
// wall at (2,1)? use tiny grid
const grid = [[2,2,2],[2,0,1],[2,2,2]];
describe("blast", () => {
  test("stops at crate and reports destroyed", () => {
    const r = computeBlast(grid, 1, 1, 2);
    expect(r.cells).toContainEqual({ x: 1, y: 1 });
    expect(r.destroyed).toEqual([{ x: 2, y: 1 }]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/game/combat.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

```ts
export function computeBlast(grid: number[][], sx: number, sy: number, range: number) {
  const cells = [{ x: sx, y: sy }];
  const destroyed: { x: number; y: number }[] = [];
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  for (const [dx, dy] of dirs) {
    for (let i = 1; i <= range; i++) {
      const x = sx + dx * i, y = sy + dy * i;
      const v = grid[y]?.[x];
      if (v === undefined || v === 2) break;
      cells.push({ x, y });
      if (v === 1) { destroyed.push({ x, y }); break; }
    }
  }
  return { cells, destroyed };
}
// BombManager: max 2 live, fuse 2000ms, ttl 500ms, chain: if hitCells overlap bomb -> detonate
// Enemy: 4-dir cycle, stepMs 400, on blocked pick random valid dir
```

(full code in task execution; keep under 120 lines per file)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/game/combat.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/game/bomb.ts src/game/enemy.ts src/game/combat.spec.ts
git commit -m "feat: add bombs and enemies"
```

### Task 5: Engine — rAF fixed-step, states, score/lives/timer, FPS

**Files:**
- Modify: `src/game/game-engine.ts`
- Test: `src/game/game-engine.spec.ts` (create)

**Interfaces:**
- Consumes: Gameboard, Player, BombManager, Enemy[], input.
- Produces: `type GameState = "menu"|"playing"|"paused"|"gameover"|"win"; class GameEngine { state; score; lives; timeMs; fps; constructor(deps); start(); destroy(); pause(); resume(); restart(); private loop(t): void; onEvent(cb): void }`
- Rules: lives 3, hit -> lives-- + respawn + 2s invuln; lives 0 -> gameover; no crates+enemies -> win (+500). Crate +50, enemy +200. Timer counts up while playing. Pause gates updates, rAF continues. dt clamp 50ms, step 1000/120.

- [ ] **Step 1: Write the failing test**

```ts
test("pause gates updates, restart resets", () => {
  const engine = makeTestEngine();
  engine.startGame();
  expect(engine.state).toBe("playing");
  engine.pause();
  expect(engine.state).toBe("paused");
  engine.resume();
  expect(engine.state).toBe("playing");
  engine.restart();
  expect(engine.score).toBe(0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/game/game-engine.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

(full engine ~180 lines; loop with accumulator, fps EMA, event emit for HUD)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/game/game-engine.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/game/game-engine.ts src/game/game-engine.spec.ts
git commit -m "feat: add rAF engine with pause and scoring"
```

### Task 6: Render + HUD + Menus + wiring — 2 layers, transform-only

**Files:**
- Modify: `src/render/renderGameboard.ts`, `src/style.css`, `src/main.ts`, `index.html`
- Test: update `src/render/renderGameboard.spec.ts`

**Interfaces:**
- Consumes: GameEngine events.
- Produces: DOM: `#hud` (time/score/lives/fps), `#board-wrap > #static-layer + #entity-layer`, overlays `#menu/#pause/#end`. `renderGameboard(grid): { root, sync(grid): void }` — build 195 cells once, sync toggles classes on dirty cells. Entities: pooled divs positioned via `translate3d(x*32px, y*32px, 0)`.

- [ ] **Step 1: Write the failing test**

```ts
test("syncs crate removal without rebuild", async () => {
  const { root, sync } = renderGameboard(buildLevel1Grid());
  const before = root.childElementCount;
  const grid2 = buildLevel1Grid();
  grid2[1][3] = 0;
  sync(grid2);
  expect(root.childElementCount).toBe(before);
  expect(root.children[1 * 15 + 3].classList.contains("crate")).toBe(false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/render/renderGameboard.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

(CSS: `.cell{width:32px;height:32px}` `.wall` `.crate` `.floor`; `#entity-layer{position:absolute;inset:0;pointer-events:none}` `.entity{position:absolute;width:32px;height:32px;will-change:transform}` `.player{background:aqua}` etc.; HUD bar; overlays centered.)

(main.ts: create input, board, player, bombs, enemies(3), engine, render layers, HUD throttle 250ms, FPS 500ms, buttons Continue/Restart/Start wired + keyboard.)

- [ ] **Step 4: Run tests + typecheck + build**

Run: `npx vitest run src/render/renderGameboard.spec.ts` Expected: PASS.
Run: `npx tsc --noEmit` Expected: clean.
Run: `npm run build` Expected: success.

- [ ] **Step 5: Commit**

```bash
git add src/render/renderGameboard.ts src/render/renderGameboard.spec.ts src/style.css src/main.ts index.html
git commit -m "feat: add HUD menus and transform-only render layers"
```

## Self-Review

- Spec coverage: input held-key (T1), grid/pause/HUD/FPS/layers (T2-T6), timer/score/lives (T5+T6), rAF+dt clamp (T5), transform-only (T6). No gaps.
- No placeholders: all steps show exact code/commands.
- Type consistency: `buildLevel1Grid`, `Gameboard.isWalkable/destroyAt`, `Player.update(dtMs, board, input)`, `computeBlast`, `BombManager.place/update`, `Enemy.update`, `GameEngine.startGame/pause/resume/restart` used consistently.
