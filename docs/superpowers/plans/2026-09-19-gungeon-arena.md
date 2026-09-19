# Gungeon Arena v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a keyboard-only top-down arena shooter (Gungeon-like v1) in a new `gungeon/` folder: 1 room, 3 waves, dodge roll with i-frames.

**Architecture:** Fixed-timestep 120Hz physics decoupled from rAF render; pooled DOM divs moved only via `transform: translate3d`; 3 layers; states menu/playing/paused/gameover/win.

**Tech Stack:** Plain HTML + CSS + JS (no frameworks, no canvas, no build step). Tests via `node` asserts. Serve via `python -m http.server` (module scripts fail on `file://`).

## Global Constraints

- Plain JS/DOM and HTML only — no frameworks, no canvas, no external libs.
- Keyboard only: ZQSD/WASD move, Arrows aim, Space fire (hold), Shift dodge roll, P/Esc pause, Enter confirm.
- Game at least 60 FPS, no drops; proper `requestAnimationFrame`; pause must not drop frames.
- Pause menu with Continue + Restart; HUD shows hearts, wave, score, time, FPS, roll cooldown.
- Layers minimal but not zero: exactly `#game-layer`, `#hud-layer`, `#overlay-layer`.
- Same speed at 60/120/165Hz: dt-based, clamp raw to 33ms, accumulator STEP=1/120 max 5 steps.
- Only `transform`/`opacity` writes in loop; no layout reads in loop; pools pre-allocated.
- Player 260 px/s, roll 520 px/s 0.35s + i-frames, cooldown 0.9s; fire 6/s at 550 px/s; 3 hearts.
- Enemies max 10; waves 3/5/7; win after wave 3 cleared.

---

### Task 1: Shell — gungeon/index.html + style.css

**Files:**
- Create: `gungeon/index.html`
- Create: `gungeon/style.css`
- Test: node id check (no JS yet)

**Interfaces:**
- Consumes: nothing
- Produces: ids later tasks rely on — `#game` 800x600, `#game-layer`, `#hud-layer` (`#hud-hearts #hud-wave #hud-score #hud-time #hud-fps #hud-roll`), `#overlay-layer` (`#menu #pause-menu #gameover` + `#btn-start #btn-continue #btn-restart-pause #btn-restart-over #gameover-title #gameover-stats`)

- [ ] **Step 1: Write the failing check**

```js
// tests/gungeon-shell.check.mjs (temporary inline check, not committed):
// for(const id of ['game-layer','hud-hearts','hud-roll','pause-menu']) if(!html.includes(id)) throw new Error('missing '+id)
```

- [ ] **Step 2: Run check to verify it fails**

Run: `node -e "const fs=require('fs'); const h=fs.existsSync('gungeon/index.html')?fs.readFileSync('gungeon/index.html','utf8'):''; for(const id of ['game-layer','hud-hearts','pause-menu']) if(!h.includes(id)) throw new Error('missing '+id)"`
Expected: FAIL `missing game-layer`

- [ ] **Step 3: Write minimal implementation**

`gungeon/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gungeon Arena v1</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div id="game">
  <div id="game-layer"></div>
  <div id="hud-layer">
    <span id="hud-hearts">3</span>
    <span id="hud-wave">-/-</span>
    <span id="hud-score">0</span>
    <span id="hud-time">0.0</span>
    <span id="hud-fps">-- fps</span>
    <span id="hud-roll">roll ready</span>
  </div>
  <div id="overlay-layer">
    <div id="menu" class="overlay">
      <h1>GUNGEON ARENA</h1>
      <p>Move ZQSD/WASD · Aim Arrows · Fire Space · Roll Shift · Pause P/Esc</p>
      <button id="btn-start">Start (Enter)</button>
    </div>
    <div id="pause-menu" class="overlay hidden">
      <h1>PAUSED</h1>
      <button id="btn-continue">Continue (P)</button>
      <button id="btn-restart-pause">Restart</button>
    </div>
    <div id="gameover" class="overlay hidden">
      <h1 id="gameover-title">GAME OVER</h1>
      <p id="gameover-stats"></p>
      <button id="btn-restart-over">Restart (Enter)</button>
    </div>
  </div>
</div>
<script type="module" src="js/main.js"></script>
</body>
</html>
```

`gungeon/style.css`:
```css
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0b0a12;color:#f2ecff;font-family:system-ui,sans-serif;display:flex;justify-content:center;padding:16px}
#game{position:relative;width:800px;height:600px;background:#141222;overflow:hidden;border:1px solid #4a4480}
#game-layer{position:absolute;inset:0;z-index:1}
#hud-layer{position:absolute;top:0;left:0;right:0;z-index:2;display:flex;gap:14px;padding:8px 12px;font-variant-numeric:tabular-nums;pointer-events:none}
#overlay-layer{position:absolute;inset:0;z-index:3;pointer-events:none}
.overlay{position:absolute;inset:0;display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center;background:rgba(8,6,18,.85);pointer-events:auto}
.hidden{display:none!important}
button{padding:10px 18px;font-size:16px;cursor:pointer}
.ent{position:absolute;top:0;left:0;will-change:transform}
.wall{background:#3a3568!important}
```

- [ ] **Step 4: Run check to verify it passes**

Run: `node -e "const fs=require('fs'); const h=fs.readFileSync('gungeon/index.html','utf8'); for(const id of ['game-layer','hud-hearts','hud-roll','pause-menu','btn-start']) if(!h.includes(id)) throw new Error('missing '+id); console.log('shell ok')"`
Expected: PASS `shell ok`

- [ ] **Step 5: Commit**

```bash
git add gungeon/index.html gungeon/style.css
git commit -m "feat(gungeon): add static shell with HUD and overlays"
```

---

### Task 2: Input — move/aim/roll Set

**Files:**
- Create: `gungeon/js/input.js`
- Create: `gungeon/tests/input.test.mjs`
- Test: `gungeon/tests/input.test.mjs`

**Interfaces:**
- Consumes: nothing
- Produces: `createInput()` returns `{ keys:Set, onPause, onConfirm (getter/setter over internal), isDown(code), aimDir():{x,y}, attach(), detach(), _kd, _ku, _blur }`. `aimDir` reads Arrows (fallback `{x:0,y:0}`). `main.js`/`physics.js` use `isDown` + `aimDir`.

- [ ] **Step 1: Write the failing test**

`gungeon/tests/input.test.mjs`:
```js
import assert from 'node:assert';
import { createInput } from '../js/input.js';
const input = createInput();
input._kd({ code: 'KeyW', repeat: false, preventDefault(){} });
input._kd({ code: 'KeyW', repeat: true, preventDefault(){} });
assert.ok(input.isDown('KeyW'));
assert.equal(input.keys.size, 1);
input._kd({ code: 'ArrowRight', repeat: false, preventDefault(){} });
assert.deepEqual(input.aimDir(), { x: 1, y: 0 });
let paused = 0;
input.onPause = () => paused++;
input._kd({ code: 'KeyP', repeat: false, preventDefault(){} });
assert.equal(paused, 1);
input._blur();
assert.equal(input.keys.size, 0);
console.log('input ok');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node gungeon/tests/input.test.mjs`
Expected: FAIL `Cannot find module '../js/input.js'`

- [ ] **Step 3: Write minimal implementation**

`gungeon/js/input.js`:
```js
const GAME_KEYS = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'];
export function createInput() {
  const keys = new Set();
  const st = { onPause: null, onConfirm: null };
  function kd(e) {
    if (GAME_KEYS.includes(e.code)) e.preventDefault?.();
    if (e.repeat) return;
    keys.add(e.code);
    if (e.code === 'KeyP' || e.code === 'Escape') st.onPause?.();
    if (e.code === 'Enter') st.onConfirm?.();
  }
  function ku(e) { keys.delete(e.code); }
  function blur() { keys.clear(); }
  return {
    keys,
    get onPause() { return st.onPause; }, set onPause(fn) { st.onPause = fn; },
    get onConfirm() { return st.onConfirm; }, set onConfirm(fn) { st.onConfirm = fn; },
    isDown(c) { return keys.has(c); },
    aimDir() {
      const x = (keys.has('ArrowRight') ? 1 : 0) - (keys.has('ArrowLeft') ? 1 : 0);
      const y = (keys.has('ArrowDown') ? 1 : 0) - (keys.has('ArrowUp') ? 1 : 0);
      if (x && y) return { x: x * Math.SQRT1_2, y: y * Math.SQRT1_2 };
      return { x, y };
    },
    attach() {
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('keydown', kd);
        window.addEventListener('keyup', ku);
        window.addEventListener('blur', blur);
      }
    },
    detach() {
      if (typeof window !== 'undefined' && window.removeEventListener) {
        window.removeEventListener('keydown', kd);
        window.removeEventListener('keyup', ku);
        window.removeEventListener('blur', blur);
      }
    },
    _kd: kd, _ku: ku, _blur: blur,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node gungeon/tests/input.test.mjs`
Expected: PASS `input ok`

- [ ] **Step 5: Commit**

```bash
git add gungeon/js/input.js gungeon/tests/input.test.mjs
git commit -m "feat(gungeon): add keyboard input with aim direction"
```

---

### Task 3: Entities — player/enemy/bullet pools + walls

**Files:**
- Create: `gungeon/js/entities.js`
- Create: `gungeon/tests/entities.test.mjs`
- Test: `gungeon/tests/entities.test.mjs`

**Interfaces:**
- Consumes: `#game-layer` element
- Produces: `createWorld(layer)` returns `{ player, enemies, pBullets, eBullets, walls, spawnEnemy(kind,x,y), firePlayer(dx,dy), fireEnemy(x,y,vx,vy), reset() }`. Entity: `{ el,x,y,vx,vy,w,h,active,kind,t }`. Player extra: `{ hp, rollT, rollCd, faceX, faceY, invuln }`. Walls: static `{x,y,w,h,el}` array (2 obstacles + arena bounds handled in physics).

- [ ] **Step 1: Write the failing test**

`gungeon/tests/entities.test.mjs`:
```js
import assert from 'node:assert';
import { createWorld } from '../js/entities.js';
const layer = { appendChild(){} };
const w = createWorld(layer);
assert.equal(w.enemies.length, 10);
assert.equal(w.pBullets.length, 40);
assert.equal(w.eBullets.length, 100);
assert.equal(w.walls.length, 2);
w.firePlayer(1, 0);
assert.equal(w.pBullets.filter(b => b.active).length, 1);
for (let i = 0; i < 13; i++) w.spawnEnemy('blob', 100 + i * 10, 100);
assert.equal(w.enemies.filter(e => e.active).length, 10);
w.reset();
assert.equal(w.enemies.filter(e => e.active).length, 0);
assert.equal(w.player.hp, 3);
console.log('entities ok');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node gungeon/tests/entities.test.mjs`
Expected: FAIL `Cannot find module '../js/entities.js'`

- [ ] **Step 3: Write minimal implementation**

`gungeon/js/entities.js`:
```js
function makeDiv(layer, cls, w, h, color) {
  const el = typeof document !== 'undefined' ? document.createElement('div') : { style: {} };
  el.className = 'ent ' + cls;
  el.style.width = w + 'px'; el.style.height = h + 'px'; el.style.background = color;
  el.style.display = 'none';
  layer.appendChild?.(el);
  return el;
}
function makePool(layer, cls, n, w, h, color) {
  const arr = [];
  for (let i = 0; i < n; i++) arr.push({ el: makeDiv(layer, cls, w, h, color), x: 0, y: 0, vx: 0, vy: 0, w, h, active: false, kind: cls, t: 0 });
  return arr;
}
export function createWorld(layer) {
  const player = { el: makeDiv(layer, 'player', 24, 24, '#4df3ff'), x: 388, y: 300, vx: 0, vy: 0, w: 24, h: 24, active: true, kind: 'player', t: 0, hp: 3, rollT: 0, rollCd: 0, faceX: 1, faceY: 0, invuln: 0 };
  const enemies = makePool(layer, 'enemy', 10, 26, 26, '#ff4d6d');
  const pBullets = makePool(layer, 'pb', 40, 5, 5, '#ffe14d');
  const eBullets = makePool(layer, 'eb', 100, 7, 7, '#ff8b3d');
  const walls = [
    { x: 200, y: 220, w: 120, h: 30, el: makeDiv(layer, 'wall', 120, 30, '#3a3568') },
    { x: 480, y: 350, w: 120, h: 30, el: makeDiv(layer, 'wall', 120, 30, '#3a3568') },
  ];
  for (const wl of walls) { wl.el.style.display = 'block'; wl.el.style.transform = `translate3d(${wl.x}px,${wl.y}px,0)`; }
  function get(pool) { return pool.find(e => !e.active); }
  return {
    player, enemies, pBullets, eBullets, walls,
    spawnEnemy(kind, x, y) {
      const e = get(enemies); if (!e) return null;
      e.active = true; e.kind = kind; e.x = x; e.y = y; e.t = 0; e.fireT = kind === 'shooter' ? 1.0 : 2.0;
      return e;
    },
    firePlayer(dx, dy) {
      const b = get(pBullets); if (!b) return null;
      b.active = true; b.x = player.x + 9; b.y = player.y + 9; b.vx = dx * 550; b.vy = dy * 550;
      return b;
    },
    fireEnemy(x, y, vx, vy) {
      const b = get(eBullets); if (!b) return null;
      b.active = true; b.x = x; b.y = y; b.vx = vx; b.vy = vy;
      return b;
    },
    reset() {
      for (const e of enemies) e.active = false;
      for (const b of pBullets) b.active = false;
      for (const b of eBullets) b.active = false;
      player.x = 388; player.y = 300; player.hp = 3; player.rollT = 0; player.rollCd = 0;
      player.faceX = 1; player.faceY = 0; player.invuln = 0; player.active = true;
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node gungeon/tests/entities.test.mjs`
Expected: PASS `entities ok`

- [ ] **Step 5: Commit**

```bash
git add gungeon/js/entities.js gungeon/tests/entities.test.mjs
git commit -m "feat(gungeon): add pooled entities and walls"
```

---

### Task 4: Room — waves spawner

**Files:**
- Create: `gungeon/js/room.js`
- Create: `gungeon/tests/room.test.mjs`
- Test: `gungeon/tests/room.test.mjs`

**Interfaces:**
- Consumes: `createWorld` shape (Task 3)
- Produces: `createRoom(world)` returns `{ wave, waveSizes:[3,5,7], aliveTarget, update(dt):'cleared'|'spawning'|'fighting', isWaveCleared(), reset() }`. Spawns at random free positions away from player (>180px), kinds cycle blob/shooter/turret.

- [ ] **Step 1: Write the failing test**

`gungeon/tests/room.test.mjs`:
```js
import assert from 'node:assert';
import { createWorld } from '../js/entities.js';
import { createRoom } from '../js/room.js';
const world = createWorld({ appendChild(){} });
const room = createRoom(world);
assert.deepEqual(room.waveSizes, [3, 5, 7]);
room.update(0.1);
assert.ok(world.enemies.filter(e => e.active).length > 0);
room.reset();
assert.equal(room.wave, 0);
console.log('room ok');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node gungeon/tests/room.test.mjs`
Expected: FAIL `Cannot find module '../js/room.js'`

- [ ] **Step 3: Write minimal implementation**

`gungeon/js/room.js`:
```js
const SIZES = [3, 5, 7];
const KINDS = ['blob', 'shooter', 'turret'];
export function createRoom(world) {
  const room = { wave: 0, waveSizes: SIZES, spawned: 0, delay: 0 };
  function freeSpot() {
    for (let i = 0; i < 20; i++) {
      const x = 60 + Math.random() * 660, y = 60 + Math.random() * 460;
      const dx = x - world.player.x, dy = y - world.player.y;
      if (dx * dx + dy * dy > 180 * 180) return { x, y };
    }
    return { x: 80, y: 80 };
  }
  return {
    wave: 0, waveSizes: SIZES,
    reset() { room.wave = 0; room.spawned = 0; room.delay = 0; this.wave = 0; },
    isWaveCleared() {
      return room.spawned >= SIZES[room.wave] && !world.enemies.some(e => e.active);
    },
    update(dt) {
      this.wave = room.wave;
      if (room.spawned < SIZES[room.wave]) {
        room.delay -= dt;
        if (room.delay <= 0) {
          room.delay = 0.5;
          const s = freeSpot();
          world.spawnEnemy(KINDS[(room.spawned + room.wave) % 3], s.x, s.y);
          room.spawned++;
        }
        return 'spawning';
      }
      if (world.enemies.some(e => e.active)) return 'fighting';
      if (room.wave < SIZES.length - 1) { room.wave++; room.spawned = 0; room.delay = 1.0; this.wave = room.wave; return 'spawning'; }
      return 'cleared';
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node gungeon/tests/room.test.mjs`
Expected: PASS `room ok`

- [ ] **Step 5: Commit**

```bash
git add gungeon/js/room.js gungeon/tests/room.test.mjs
git commit -m "feat(gungeon): add wave room spawner"
```

---

### Task 5: Physics — move, roll, walls, collisions

**Files:**
- Create: `gungeon/js/physics.js`
- Create: `gungeon/tests/physics.test.mjs`
- Test: `gungeon/tests/physics.test.mjs`

**Interfaces:**
- Consumes: world (Task 3) + input `{isDown, aimDir}` (Task 2)
- Produces: `STEP=1/120`, `W=800,H=600`, `aabb(a,b)`, `step(world,input,dt,api)` with `api={fireCd,onKill(e),onHit()}`. Handles: 8-dir 260 px/s, roll dash 520 + i-frames 0.35 + cd 0.9, wall slide/clamp, enemy AI (blob seek 70, shooter keep 250 + aimed 140/1.6s, turret 3-branch/2.2s), bullets move+cull, player bullets kill, enemy bullets/hostile contact hit (10px hitbox, gated by roll/invuln).

- [ ] **Step 1: Write the failing test**

`gungeon/tests/physics.test.mjs`:
```js
import assert from 'node:assert';
import { aabb, STEP, step } from '../js/physics.js';
import { createWorld } from '../js/entities.js';
assert.equal(STEP, 1 / 120);
assert.ok(aabb({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 }));
const world = createWorld({ appendChild(){} });
const input = { isDown: (c) => c === 'KeyD', aimDir: () => ({ x: 0, y: 0 }) };
const api = { fireCd: 0, onKill() {}, onHit() {} };
const x0 = world.player.x;
step(world, input, STEP, api);
assert.ok(world.player.x > x0);
console.log('physics ok');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node gungeon/tests/physics.test.mjs`
Expected: FAIL `Cannot find module '../js/physics.js'`

- [ ] **Step 3: Write minimal implementation**

`gungeon/js/physics.js`:
```js
export const STEP = 1 / 120;
export const W = 800, H = 600;
export function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
const HITBOX = { x: 0, y: 0, w: 10, h: 10 };
const MOVES = [['KeyA', 'KeyQ', -1, 0], ['KeyD', 1, 0], ['KeyW', 'KeyZ', 0, -1], ['KeyS', 0, 1]];
function moveKeys(input) {
  let dx = 0, dy = 0;
  for (const m of MOVES) {
    const x = m[m.length - 2], y = m[m.length - 1];
    for (let i = 0; i < m.length - 2; i++) if (input.isDown(m[i])) { dx += x; dy += y; break; }
  }
  if (dx && dy) { dx *= Math.SQRT1_2; dy *= Math.SQRT1_2; }
  return { dx, dy };
}
export function step(world, input, dt, api) {
  const p = world.player;
  p.t += dt;
  if (p.invuln > 0) p.invuln -= dt;
  if (p.rollCd > 0) p.rollCd -= dt;
  const { dx, dy } = moveKeys(input);
  if (dx || dy) { p.faceX = dx; p.faceY = dy; }
  const wantRoll = input.isDown('ShiftLeft') || input.isDown('ShiftRight');
  if (wantRoll && p.rollT <= 0 && p.rollCd <= 0 && (dx || dy)) { p.rollT = 0.35; p.rollCd = 0.9; p.invuln = Math.max(p.invuln, 0.35); }
  const spd = p.rollT > 0 ? 520 : 260;
  if (p.rollT > 0) p.rollT -= dt;
  p.x += dx * spd * dt;
  p.y += dy * spd * dt;
  p.x = Math.min(W - p.w, Math.max(0, p.x));
  p.y = Math.min(H - p.h, Math.max(0, p.y));
  for (const wl of world.walls) {
    if (aabb(p, wl)) {
      const ox1 = (p.x + p.w) - wl.x, ox2 = (wl.x + wl.w) - p.x;
      const oy1 = (p.y + p.h) - wl.y, oy2 = (wl.y + wl.h) - p.y;
      const m = Math.min(ox1, ox2, oy1, oy2);
      if (m === ox1) p.x = wl.x - p.w; else if (m === ox2) p.x = wl.x + wl.w;
      else if (m === oy1) p.y = wl.y - p.h; else p.y = wl.y + wl.h;
    }
  }
  api.fireCd -= dt;
  const aim = input.aimDir();
  let ax = aim.x, ay = aim.y;
  if (!ax && !ay) { ax = p.faceX; ay = p.faceY; }
  if (input.isDown('Space') && api.fireCd <= 0) { world.firePlayer(ax, ay); api.fireCd = 1 / 6; }
  for (const e of world.enemies) {
    if (!e.active) continue;
    e.t += dt;
    const dxp = p.x - e.x, dyp = p.y - e.y;
    const d = Math.hypot(dxp, dyp) || 1;
    if (e.kind === 'blob') { e.x += (dxp / d) * 70 * dt; e.y += (dyp / d) * 70 * dt; }
    else if (e.kind === 'shooter') {
      if (d > 260) { e.x += (dxp / d) * 90 * dt; e.y += (dyp / d) * 90 * dt; }
      else if (d < 200) { e.x -= (dxp / d) * 60 * dt; e.y -= (dyp / d) * 60 * dt; }
      e.fireT -= dt;
      if (e.fireT <= 0) { e.fireT = 1.6; world.fireEnemy(e.x + 9, e.y + 9, (dxp / d) * 140, (dyp / d) * 140); }
    } else {
      e.fireT -= dt;
      if (e.fireT <= 0) {
        e.fireT = 2.2;
        for (let k = 0; k < 3; k++) {
          const a = e.t + (k * Math.PI * 2) / 3;
          world.fireEnemy(e.x + 9, e.y + 9, Math.cos(a) * 120, Math.sin(a) * 120);
        }
      }
    }
    e.x = Math.min(W - e.w, Math.max(0, e.x));
    e.y = Math.min(H - e.h, Math.max(0, e.y));
  }
  for (const b of world.pBullets) {
    if (!b.active) continue;
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.x < -20 || b.x > W + 20 || b.y < -20 || b.y > H + 20) b.active = false;
  }
  for (const b of world.eBullets) {
    if (!b.active) continue;
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.x < -20 || b.x > W + 20 || b.y < -20 || b.y > H + 20) b.active = false;
  }
  for (const b of world.pBullets) {
    if (!b.active) continue;
    for (const e of world.enemies) {
      if (e.active && aabb(b, e)) { b.active = false; e.active = false; api.onKill(e); break; }
    }
  }
  if (p.invuln <= 0 && p.rollT <= 0) {
    HITBOX.x = p.x + 7; HITBOX.y = p.y + 7;
    for (const b of world.eBullets) {
      if (b.active && aabb(HITBOX, b)) { b.active = false; api.onHit(); break; }
    }
    if (p.invuln <= 0) for (const e of world.enemies) {
      if (e.active && aabb(HITBOX, e)) { api.onHit(); break; }
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node gungeon/tests/physics.test.mjs`
Expected: PASS `physics ok`

- [ ] **Step 5: Commit**

```bash
git add gungeon/js/physics.js gungeon/tests/physics.test.mjs
git commit -m "feat(gungeon): add top-down physics with dodge roll"
```

---

### Task 6: Main + UI — states, render, FPS, HUD

**Files:**
- Create: `gungeon/js/ui.js`
- Create: `gungeon/js/main.js`
- Test: `node --check` + manual browser

**Interfaces:**
- Consumes: `createInput`, `createWorld`, `createRoom`, `step/STEP`
- Produces: playable game; `bindUI(els, game)` with `{ frame(dt), fps(t), show(id), gameover(win) }`; game `{ state, score, hp, wave, elapsed }`

- [ ] **Step 1: Write the failing check**

Run: `node --check gungeon/js/main.js`
Expected: FAIL `Cannot open`

- [ ] **Step 2: Run check to verify it fails**

Run: `node --check gungeon/js/main.js`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

`gungeon/js/ui.js`:
```js
export function bindUI(els, game) {
  let acc = 0;
  return {
    frame(dt) {
      acc += dt;
      if (acc < 0.25) return;
      acc = 0;
      els.hearts.textContent = String(Math.max(0, game.hp));
      els.wave.textContent = `${Math.min(game.wave + 1, 3)}/3`;
      els.score.textContent = String(Math.floor(game.score));
      els.time.textContent = game.elapsed.toFixed(1);
      els.roll.textContent = game.rollCd > 0 ? `roll ${game.rollCd.toFixed(1)}s` : 'roll ready';
    },
    fps(t) { els.fps.textContent = t; },
    show(id) {
      for (const k of ['menu', 'pause-menu', 'gameover'])
        document.getElementById(k).classList.toggle('hidden', k !== id);
      if (!id) for (const k of ['menu', 'pause-menu', 'gameover']) document.getElementById(k).classList.add('hidden');
    },
    gameover(win) {
      document.getElementById('gameover-title').textContent = win ? 'CHAMBER CLEAR' : 'GAME OVER';
      document.getElementById('gameover-stats').textContent = `Score ${Math.floor(game.score)} · Time ${game.elapsed.toFixed(1)}s · Wave ${Math.min(game.wave + 1, 3)}/3`;
    },
  };
}
```

`gungeon/js/main.js`:
```js
import { createInput } from './input.js';
import { createWorld } from './entities.js';
import { createRoom } from './room.js';
import { step, STEP } from './physics.js';
import { bindUI } from './ui.js';

const layer = document.getElementById('game-layer');
const world = createWorld(layer);
const room = createRoom(world);
const input = createInput();
input.attach();
const game = { state: 'menu', score: 0, hp: 3, wave: 0, elapsed: 0, rollCd: 0 };
const ui = bindUI({
  hearts: document.getElementById('hud-hearts'),
  wave: document.getElementById('hud-wave'),
  score: document.getElementById('hud-score'),
  time: document.getElementById('hud-time'),
  fps: document.getElementById('hud-fps'),
  roll: document.getElementById('hud-roll'),
}, game);

const api = {
  fireCd: 0,
  onKill() { game.score += 100; },
  onHit() {
    if (game.hp <= 0 || world.player.invuln > 0) return;
    game.hp -= 1; world.player.hp = game.hp; world.player.invuln = 1.0;
    if (game.hp <= 0) end(false);
  },
};
let last = performance.now(), acc = 0, fpsF = 0, fpsT = 0;

function reset() {
  world.reset(); room.reset();
  game.score = 0; game.hp = 3; game.wave = 0; game.elapsed = 0; game.rollCd = 0;
  api.fireCd = 0; acc = 0;
}
function start() { reset(); game.state = 'playing'; ui.show(null); }
function togglePause() {
  if (game.state === 'playing') { game.state = 'paused'; ui.show('pause-menu'); }
  else if (game.state === 'paused') { game.state = 'playing'; ui.show(null); last = performance.now(); }
}
function end(win) { game.state = win ? 'win' : 'gameover'; ui.gameover(win); ui.show('gameover'); }
input.onPause = togglePause;
input.onConfirm = () => { if (game.state !== 'playing' && game.state !== 'paused') start(); };
document.getElementById('btn-start').onclick = start;
document.getElementById('btn-continue').onclick = togglePause;
document.getElementById('btn-restart-pause').onclick = start;
document.getElementById('btn-restart-over').onclick = start;
document.addEventListener('visibilitychange', () => { if (document.hidden && game.state === 'playing') togglePause(); });
window.addEventListener('blur', () => { if (game.state === 'playing') togglePause(); });

const POOLS = [world.enemies, world.pBullets, world.eBullets];
function render() {
  const p = world.player;
  p.el.style.display = 'block';
  p.el.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
  p.el.style.opacity = (p.rollT > 0 || p.invuln > 0) && ((performance.now() / 120 | 0) % 2) ? '0.4' : '1';
  for (const arr of POOLS) {
    for (const e of arr) {
      if (!e.active) { if (e.el.style.display !== 'none') e.el.style.display = 'none'; continue; }
      if (e.el.style.display !== 'block') e.el.style.display = 'block';
      e.el.style.transform = `translate3d(${e.x}px,${e.y}px,0)`;
    }
  }
}

function loop(now) {
  requestAnimationFrame(loop);
  let raw = (now - last) / 1000;
  last = now;
  fpsF++; fpsT += raw;
  if (fpsT >= 0.5) { ui.fps(`${Math.round(fpsF / fpsT)} fps`); fpsF = 0; fpsT = 0; }
  if (game.state !== 'playing') return;
  if (raw > 0.033) raw = 0.033;
  if (raw < 0) raw = 0;
  acc += raw;
  let n = 0;
  while (acc >= STEP && n < 5) {
    const st = room.update(STEP);
    step(world, input, STEP, api);
    game.elapsed += STEP;
    game.wave = room.wave;
    game.hp = world.player.hp;
    game.rollCd = Math.max(0, world.player.rollCd);
    game.score += STEP * 10;
    if (st === 'cleared') { end(true); break; }
    if (game.state !== 'playing') break;
    acc -= STEP; n++;
  }
  render();
  ui.frame(raw);
}
ui.show('menu');
requestAnimationFrame((t) => { last = t; requestAnimationFrame(loop); });
```

- [ ] **Step 4: Run checks to verify it passes**

Run: `node --check gungeon/js/main.js && node --check gungeon/js/ui.js && node gungeon/tests/input.test.mjs && node gungeon/tests/entities.test.mjs && node gungeon/tests/room.test.mjs && node gungeon/tests/physics.test.mjs && echo ALL-OK`
Expected: PASS `ALL-OK`. Serve: `python -m http.server 8000`, open `http://localhost:8000/gungeon/` — Enter starts, ZQSD moves, arrows aim, Space fires, Shift rolls through bullets, P pauses.

- [ ] **Step 5: Commit**

```bash
git add gungeon/js/main.js gungeon/js/ui.js
git commit -m "feat(gungeon): add main loop with states render and HUD"
```

---

### Task 7: Perf pass + audit verification

**Files:**
- Modify: hot path only if profile shows issue
- Test: DevTools Performance 30s

**Interfaces:**
- Consumes: full game
- Produces: 60+ FPS sustained

- [ ] **Step 1: Write the failing check**

Run: DevTools Performance record 30s heavy play (wave 3, rolling through spiral).
Expected before pass: FPS avg >= 60, no long-task > 8ms, pause/resume gapless. If fail, fix render/physics.

- [ ] **Step 2: Apply guards (verify present)**

```js
// render skips hidden writes; HUD 4Hz; pools fixed; transform-only; dt clamp 33ms; max 5 steps.
```

- [ ] **Step 3: Verify it passes**

Run: profile → avg >= 60 (reads ~165 on 165Hz), paint flashing only game-layer rects.
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "perf(gungeon): verify 60fps and pause stability" || echo "nothing to commit"
```

## Self-Review

- Spec coverage: shell/HUD/overlays (T1), input+aim (T2), pools+walls (T3), waves (T4), move/roll/collisions/enemy AI (T5), states/render/FPS/HUD/timer/score/hearts/165Hz (T6), perf audit (T7). Timer = elapsed, wave display, roll cooldown bar — all covered.
- No placeholders: exact paths under `gungeon/`, full code, exact commands with `gungeon/` prefix.
- Type consistency: `createInput().isDown/aimDir`, `createWorld().player/enemies/pBullets/eBullets/walls/spawnEnemy(kind,x,y)/firePlayer(dx,dy)/fireEnemy(x,y,vx,vy)/reset`, `createRoom(world).wave/waveSizes/update(dt)/isWaveCleared/reset`, `step(world,input,dt,api)`, `STEP=1/120`, `bindUI(els,game)`. MOVES handles KeyA/KeyQ/KeyW/KeyZ AZERTY+QWERTY.
