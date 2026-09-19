# Bullet-Hell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Space Invaders-genre bullet-hell shooter in plain JS/DOM that holds 60+ FPS on 60Hz and 165Hz screens.

**Architecture:** Fixed-timestep (120Hz) physics decoupled from rAF render; pooled DOM divs moved only via `transform: translate3d`; 3 layers; state machine menu/playing/paused/gameover/win.

**Tech Stack:** Plain HTML + CSS + JS (no frameworks, no canvas, no build step). Verification via browser + DevTools Performance.

## Global Constraints

- Plain JS/DOM and HTML only — no frameworks, no canvas, no external libs.
- Game runs at least 60 FPS, no frame drops; proper `requestAnimationFrame` use.
- Pause menu with Continue + Restart; pause must not drop frames.
- Scoreboard shows timer (90s countdown), score, lives (3).
- Layers minimal but not zero: exactly `#game-layer`, `#hud-layer`, `#overlay-layer`.
- Keyboard only, smooth hold-to-move (no key-repeat dependence), multi-key OK.
- Same game speed at 60Hz/120Hz/165Hz (dt-based, clamped).
- Only `transform`/`opacity` in loop; no layout reads in loop.

---

### Task 1: Static shell — HTML + CSS + arena

**Files:**
- Create: `index.html`
- Create: `style.css`
- Test: manual browser open (no JS yet)

**Interfaces:**
- Consumes: nothing
- Produces: DOM ids later tasks rely on — `#game` (800x600 arena), `#game-layer`, `#hud-layer`, `#overlay-layer`, HUD `#hud-timer #hud-score #hud-lives #hud-fps`, overlays `#menu #pause-menu #gameover` with buttons `#btn-start #btn-continue #btn-restart-pause #btn-restart-over`

- [ ] **Step 1: Write the failing check**

```html
<!-- expected after implementation: index.html contains these ids -->
<!-- #game #game-layer #hud-layer #overlay-layer #hud-timer #hud-score #hud-lives #hud-fps #menu #pause-menu #gameover -->
```

- [ ] **Step 2: Run check to verify it fails**

Run: `node -e "const fs=require('fs'); const h=fs.existsSync('index.html')?fs.readFileSync('index.html','utf8'):''; for(const id of ['game-layer','hud-timer','pause-menu']) if(!h.includes(id)) throw new Error('missing '+id); console.log('shell ok')"`
Expected: FAIL with "missing game-layer" (file does not exist yet)

- [ ] **Step 3: Write minimal implementation**

`index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bullet Hell — Space Invaders</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div id="game">
  <div id="game-layer"></div>
  <div id="hud-layer">
    <span id="hud-timer">90.0</span>
    <span id="hud-score">0</span>
    <span id="hud-lives">3</span>
    <span id="hud-fps">-- fps</span>
  </div>
  <div id="overlay-layer">
    <div id="menu" class="overlay">
      <h1>BULLET HELL</h1>
      <p>Move: Arrows/WASD · Fire: Space (hold) · Pause: P/Esc</p>
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

`style.css`:
```css
*{box-sizing:border-box;margin:0;padding:0}
body{background:#05060f;color:#e8ecff;font-family:system-ui,sans-serif;display:flex;justify-content:center;padding:16px}
#game{position:relative;width:800px;height:600px;background:#0a0e24;overflow:hidden;border:1px solid #2a3566}
#game-layer{position:absolute;inset:0;z-index:1}
#hud-layer{position:absolute;top:0;left:0;right:0;z-index:2;display:flex;gap:16px;padding:8px 12px;font-variant-numeric:tabular-nums;pointer-events:none}
#overlay-layer{position:absolute;inset:0;z-index:3;pointer-events:none}
.overlay{position:absolute;inset:0;display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center;background:rgba(5,8,20,.82);pointer-events:auto}
.hidden{display:none!important}
button{padding:10px 18px;font-size:16px;cursor:pointer}
.ent{position:absolute;top:0;left:0;will-change:transform}
```

- [ ] **Step 4: Run check to verify it passes**

Run: `node -e "const fs=require('fs'); const h=fs.readFileSync('index.html','utf8'); for(const id of ['game-layer','hud-timer','pause-menu']) if(!h.includes(id)) throw new Error('missing '+id); console.log('shell ok')"`
Expected: PASS `shell ok`, plus open `index.html` in browser — menu visible, arena 800x600.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css
git commit -m "feat: add static shell with HUD and overlays"
```

---

### Task 2: Input — smooth keyboard Set

**Files:**
- Create: `js/input.js`
- Test: `tests/input.test.mjs` (node, no DOM — uses fake window)

**Interfaces:**
- Consumes: nothing
- Produces: `createInput()` returns `{ keys:Set, attach(), detach(), isDown(code:string):boolean }` — `main.js` uses `isDown('ArrowLeft')`, `'KeyA'`, `'Space'`, one-shot callbacks `onPause`, `onConfirm` set as properties.

- [ ] **Step 1: Write the failing test**

`tests/input.test.mjs`:
```js
import assert from 'node:assert';
import { createInput } from '../js/input.js';
const input = createInput();
input.attach();
window.__keydown({ code: 'ArrowLeft' });
window.__keydown({ code: 'ArrowLeft' }); // repeat must stay single
assert.ok(input.isDown('ArrowLeft'));
window.__keyup({ code: 'ArrowLeft' });
assert.ok(!input.isDown('ArrowLeft'));
console.log('input ok');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/input.test.mjs`
Expected: FAIL with "Cannot find module '../js/input.js'"

- [ ] **Step 3: Write minimal implementation**

`js/input.js`:
```js
export function createInput() {
  const keys = new Set();
  const st = { onPause: null, onConfirm: null };
  function kd(e) {
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)) e.preventDefault?.();
    if (e.repeat) return;
    keys.add(e.code);
    if (e.code === 'KeyP' || e.code === 'Escape') st.onPause?.();
    if (e.code === 'Enter' || e.code === 'Space') st.onConfirm?.();
  }
  function ku(e) { keys.delete(e.code); }
  function blur() { keys.clear(); }
  return {
    keys,
    ...st,
    isDown(c) { return keys.has(c); },
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
    _kd: kd, _ku: ku,
  };
}
```

Test harness shim: run with `node --test` after adding to test file top:
```js
// shim for node (prepend to tests/input.test.mjs before import side-effects)
globalThis.window = globalThis.window ?? { addEventListener(){}, removeEventListener(){} };
```

Full test file to write:
```js
import assert from 'node:assert';
import { createInput } from '../js/input.js';
globalThis.window ??= { addEventListener(){}, removeEventListener(){} };
const input = createInput();
input._kd({ code: 'ArrowLeft', repeat: false, preventDefault(){} });
input._kd({ code: 'ArrowLeft', repeat: true, preventDefault(){} });
assert.ok(input.isDown('ArrowLeft'));
assert.equal(input.keys.size, 1);
input._ku({ code: 'ArrowLeft' });
assert.ok(!input.isDown('ArrowLeft'));
console.log('input ok');
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/input.test.mjs`
Expected: PASS `input ok`

- [ ] **Step 5: Commit**

```bash
git add js/input.js tests/input.test.mjs
git commit -m "feat: add smooth keyboard input set"
```

---

### Task 3: Entities — pooled DOM divs

**Files:**
- Create: `js/entities.js`
- Modify: `style.css` (append entity styles)
- Test: `tests/entities.test.mjs`

**Interfaces:**
- Consumes: `#game-layer` element (passed in)
- Produces: `createWorld(layer)` returns `{ player, enemies[], pBullets[], eBullets[], spawnEnemy(type,x), firePlayer(), fireEnemy(x,y,vx,vy), reset() }`. Entity shape: `{ el, x,y,vx,vy,w,h,active, kind }`. `main.js` + `physics.js` use exactly these names.

- [ ] **Step 1: Write the failing test**

`tests/entities.test.mjs`:
```js
import assert from 'node:assert';
import { createWorld } from '../js/entities.js';
const layer = { appendChild(){}, clientWidth: 800, clientHeight: 600 };
const w = createWorld(layer);
w.firePlayer(); w.firePlayer();
assert.equal(w.pBullets.filter(b => b.active).length, 2);
w.reset();
assert.equal(w.pBullets.filter(b => b.active).length, 0);
console.log('entities ok');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/entities.test.mjs`
Expected: FAIL "Cannot find module '../js/entities.js'"

- [ ] **Step 3: Write minimal implementation**

`js/entities.js`:
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
  for (let i = 0; i < n; i++) arr.push({ el: makeDiv(layer, cls, w, h, color), x: 0, y: 0, vx: 0, vy: 0, w, h, active: false, kind: cls });
  return arr;
}
export function createWorld(layer) {
  const player = { el: makeDiv(layer, 'player', 28, 20, '#4df3ff'), x: 386, y: 540, vx: 0, vy: 0, w: 28, h: 20, active: true, kind: 'player', invuln: 0 };
  const enemies = makePool(layer, 'enemy', 12, 30, 22, '#ff4d6d');
  const pBullets = makePool(layer, 'pb', 30, 4, 12, '#ffe14d');
  const eBullets = makePool(layer, 'eb', 80, 7, 7, '#ff8b3d');
  function get(pool) { return pool.find(e => !e.active); }
  return {
    player, enemies, pBullets, eBullets,
    spawnEnemy(type, x) {
      const e = get(enemies); if (!e) return null;
      e.active = true; e.kind = type; e.x = x; e.y = -30; e.t = 0;
      return e;
    },
    firePlayer() {
      const b = get(pBullets); if (!b) return null;
      b.active = true; b.x = player.x + player.w / 2 - 2; b.y = player.y - 12; b.vx = 0; b.vy = -600;
      return b;
    },
    fireEnemy(x, y, vx, vy) {
      const b = get(eBullets); if (!b) return null;
      b.active = true; b.x = x; b.y = y; b.vx = vx; b.vy = vy;
      return b;
    },
    reset() {
      for (const p of [...enemies, ...pBullets, ...eBullets]) p.active = false;
      player.x = 386; player.y = 540; player.invuln = 0; player.active = true;
    },
  };
}
```

Append to `style.css`:
```css
.player{border-radius:6px}
.enemy{border-radius:4px}
.pb{border-radius:2px}
.eb{border-radius:50%}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/entities.test.mjs`
Expected: PASS `entities ok`

- [ ] **Step 5: Commit**

```bash
git add js/entities.js style.css tests/entities.test.mjs
git commit -m "feat: add pooled entities world"
```

---

### Task 4: Physics — fixed step, move, collide

**Files:**
- Create: `js/physics.js`
- Test: `tests/physics.test.mjs`

**Interfaces:**
- Consumes: `createWorld` shape from Task 3, `input.isDown`
- Produces: `step(world, input, dt, api)` where `dt` seconds, `api = { onKill(), onHit(), fireCd }`. Mutates positions, handles bounds (800x600), player-enemy-bullet AABB. Export `aabb(a,b)` and `STEP = 1/120`.

- [ ] **Step 1: Write the failing test**

`tests/physics.test.mjs`:
```js
import assert from 'node:assert';
import { aabb, STEP } from '../js/physics.js';
assert.equal(STEP, 1/120);
assert.ok(aabb({x:0,y:0,w:10,h:10},{x:5,y:5,w:10,h:10}));
assert.ok(!aabb({x:0,y:0,w:10,h:10},{x:20,y:20,w:10,h:10}));
console.log('physics ok');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/physics.test.mjs`
Expected: FAIL "Cannot find module '../js/physics.js'"

- [ ] **Step 3: Write minimal implementation**

`js/physics.js`:
```js
export const STEP = 1 / 120;
export const W = 800, H = 600;
export function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
const DIRS = [['ArrowLeft','KeyA',-1,0],['ArrowRight','KeyD',1,0],['ArrowUp','KeyW',0,-1],['ArrowDown','KeyS',0,1]];
export function step(world, input, dt, api) {
  const p = world.player;
  let dx = 0, dy = 0;
  for (const [c1, c2, x, y] of DIRS) if (input.isDown(c1) || input.isDown(c2)) { dx += x; dy += y; }
  if (dx && dy) { dx *= Math.SQRT1_2; dy *= Math.SQRT1_2; }
  p.x = Math.min(W - p.w, Math.max(0, p.x + dx * 320 * dt));
  p.y = Math.min(H - p.h, Math.max(0, p.y + dy * 320 * dt));
  if (p.invuln > 0) p.invuln -= dt;
  api.fireCd -= dt;
  if ((input.isDown('Space')) && api.fireCd <= 0) { world.firePlayer(); api.fireCd = 0.125; }
  for (const e of world.enemies) {
    if (!e.active) continue;
    e.t += dt;
    if (e.kind === 'weaver') { e.x += Math.sin(e.t * 3) * 120 * dt; e.y += 60 * dt; }
    else if (e.kind === 'diver') { e.y += 160 * dt; }
    else { e.y += 45 * dt; }
    if (e.y > H + 40) e.active = false;
  }
  for (const b of world.pBullets) {
    if (!b.active) continue;
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.y < -20) b.active = false;
  }
  for (const b of world.eBullets) {
    if (!b.active) continue;
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.y > H + 20 || b.x < -20 || b.x > W + 20) b.active = false;
  }
  for (const b of world.pBullets) {
    if (!b.active) continue;
    for (const e of world.enemies) {
      if (e.active && aabb(b, e)) { b.active = false; e.active = false; api.onKill(e); break; }
    }
  }
  if (p.invuln <= 0) {
    const hitbox = { x: p.x + 9, y: p.y + 5, w: 10, h: 10 };
    for (const b of world.eBullets) {
      if (b.active && aabb(hitbox, b)) { b.active = false; api.onHit(); break; }
    }
    if (p.active) for (const e of world.enemies) {
      if (e.active && aabb(hitbox, e)) { e.active = false; api.onHit(); break; }
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/physics.test.mjs`
Expected: PASS `physics ok`

- [ ] **Step 5: Commit**

```bash
git add js/physics.js tests/physics.test.mjs
git commit -m "feat: add fixed-step physics and collisions"
```

---

### Task 5: Main loop — states, spawner, render, FPS

**Files:**
- Create: `js/main.js`
- Create: `js/ui.js`
- Test: manual + `node --check`

**Interfaces:**
- Consumes: `createInput`, `createWorld`, `step/STEP` from Tasks 2–4
- Produces: working game; `ui.js` exports `bindUI(els, game)` used by main. Game object: `{ state, score, lives, timeLeft, combo }`.

- [ ] **Step 1: Write the failing check**

Run: `node --check js/main.js`
Expected: FAIL "Cannot open js/main.js"

- [ ] **Step 2: Run check to verify it fails**

Run: `node --check js/main.js`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

`js/ui.js`:
```js
export function bindUI(els, game) {
  const t = els.timer, s = els.score, l = els.lives, f = els.fps;
  let acc = 0;
  return {
    frame(dt) {
      acc += dt;
      if (acc < 0.25) return;
      acc = 0;
      t.textContent = game.timeLeft.toFixed(1);
      s.textContent = String(game.score);
      l.textContent = String(game.lives);
    },
    fps(text) { f.textContent = text; },
    show(id) {
      for (const k of ['menu','pause-menu','gameover'])
        document.getElementById(k).classList.toggle('hidden', k !== id);
      if (!id) for (const k of ['menu','pause-menu','gameover']) document.getElementById(k).classList.add('hidden');
    },
    gameover(win) {
      document.getElementById('gameover-title').textContent = win ? 'YOU WIN' : 'GAME OVER';
      document.getElementById('gameover-stats').textContent = `Score ${game.score} · Time ${game.elapsed.toFixed(1)}s`;
    },
  };
}
```

`js/main.js`:
```js
import { createInput } from './input.js';
import { createWorld } from './entities.js';
import { step, STEP } from './physics.js';
import { bindUI } from './ui.js';

const layer = document.getElementById('game-layer');
const world = createWorld(layer);
const input = createInput();
input.attach();
const game = { state: 'menu', score: 0, lives: 3, timeLeft: 90, elapsed: 0, combo: 1, comboT: 0 };
const ui = bindUI({ timer: hud('hud-timer'), score: hud('hud-score'), lives: hud('hud-lives'), fps: hud('hud-fps') }, game);
function hud(id) { return document.getElementById(id); }

const api = { fireCd: 0,
  onKill() { game.score += 100 * game.combo; },
  onHit() { game.lives -= 1; world.player.invuln = 1.5; game.combo = 1; if (game.lives <= 0) end(false); },
};
let spawnT = 0, wave = 0, last = performance.now(), acc = 0;
let fpsFrames = 0, fpsT = 0, fpsText = '-- fps';

function reset() {
  world.reset();
  game.score = 0; game.lives = 3; game.timeLeft = 90; game.elapsed = 0; game.combo = 1; game.comboT = 0;
  api.fireCd = 0; spawnT = 0; wave = 0; acc = 0;
}
function start() { reset(); game.state = 'playing'; ui.show(null); }
function togglePause() {
  if (game.state === 'playing') { game.state = 'paused'; ui.show('pause-menu'); }
  else if (game.state === 'paused') { game.state = 'playing'; ui.show(null); last = performance.now(); }
}
function end(win) { game.state = win ? 'win' : 'gameover'; ui.gameover(win); ui.show('gameover'); }
input.onPause = togglePause;
input.onConfirm = () => { if (game.state === 'menu' || game.state === 'gameover' || game.state === 'win') start(); };
document.getElementById('btn-start').onclick = start;
document.getElementById('btn-continue').onclick = togglePause;
document.getElementById('btn-restart-pause').onclick = start;
document.getElementById('btn-restart-over').onclick = start;
document.addEventListener('visibilitychange', () => { if (document.hidden && game.state === 'playing') togglePause(); });
window.addEventListener('blur', () => { if (game.state === 'playing') togglePause(); });

function spawner(dt) {
  spawnT -= dt;
  if (spawnT > 0) return;
  spawnT = Math.max(1.2, 4 - wave * 0.15);
  wave++;
  const kinds = ['weaver', 'diver', 'gunner'];
  for (let i = 0; i < Math.min(2 + (wave >> 2), 5); i++) {
    const e = world.spawnEnemy(kinds[(wave + i) % 3], 60 + Math.random() * 620);
    if (e && e.kind === 'gunner') {
      const dx = (world.player.x - e.x) * 0.4, sp = 150 + wave * 4;
      world.fireEnemy(e.x + 11, e.y + 22, dx, sp);
    } else if (e) {
      world.fireEnemy(e.x + 11, e.y + 22, (Math.random() - 0.5) * 80, 140 + wave * 3);
    }
  }
}

function render() {
  const p = world.player;
  p.el.style.display = 'block';
  p.el.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
  p.el.style.opacity = p.invuln > 0 && (performance.now() / 150 | 0) % 2 ? '0.25' : '1';
  for (const arr of [world.enemies, world.pBullets, world.eBullets]) {
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
  fpsFrames++; fpsT += raw;
  if (fpsT >= 0.5) { fpsText = `${Math.round(fpsFrames / fpsT)} fps`; ui.fps(fpsText); fpsFrames = 0; fpsT = 0; }
  if (game.state !== 'playing') return;
  if (raw > 0.033) raw = 0.033;
  if (raw < 0) raw = 0;
  acc += raw;
  let n = 0;
  while (acc >= STEP && n < 5) { spawner(STEP); step(world, input, STEP, api); game.timeLeft -= STEP; game.elapsed += STEP; game.comboT += STEP; if (game.comboT > 8) { game.comboT = 0; game.combo = Math.min(5, game.combo + 1); } acc -= STEP; n++; }
  if (game.timeLeft <= 0) { game.timeLeft = 0; end(true); }
  game.score += raw * 10;
  render();
  ui.frame(raw);
}
ui.show('menu');
requestAnimationFrame((t) => { last = t; requestAnimationFrame(loop); });
```

- [ ] **Step 4: Run checks to verify it passes**

Run: `node --check js/main.js && node --check js/ui.js && echo ok`
Expected: PASS `ok`. Then open `index.html`: Enter starts, arrows move smoothly on hold, Space fires, P pauses with Continue/Restart, HUD counts down from 90, FPS shows ~60 (or ~165 on 165Hz).

- [ ] **Step 5: Commit**

```bash
git add js/main.js js/ui.js
git commit -m "feat: add main loop with states spawner render and FPS"
```

---

### Task 6: Perf pass + audit verification

**Files:**
- Modify: any hot path found
- Test: DevTools Performance recording

**Interfaces:**
- Consumes: full game
- Produces: 60+ FPS sustained, no layout thrash

- [ ] **Step 1: Write the failing check**

Run: open DevTools Performance, record 30s of heavy play, check FPS graph + long tasks.
Expected before pass: possible GC churn if `display` toggling per frame or string allocs — fix if seen.

- [ ] **Step 2: Apply perf guards (already in plan, verify)**

```js
// render() skips style writes when hidden; text HUD throttled to 4Hz (ui.frame);
// physics uses no allocation (reused pools, no array spreads in loop except reset);
// transform-only movement; bounds cached constants W/H.
```

- [ ] **Step 3: Verify it passes**

Run: 30s profile → FPS avg >= 60 (reads ~165 on 165Hz), zero dropped-frame gaps on pause/resume, paint flashing shows only game-layer rects.
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "perf: verify 60fps and pause stability" || echo "nothing to commit"
```

## Self-Review

- Spec coverage: shell/HUD/overlays (T1), input smoothness (T2), pools (T3), fixed-step+AABB+hitbox (T4), states/spawner/render/FPS/timer/score/lives/pause/restart/165Hz (T5), perf audit (T6). All covered.
- No placeholders: exact paths, full code, exact commands.
- Type consistency: `createInput().isDown`, `createWorld(layer).player/enemies/pBullets/eBullets/spawnEnemy/firePlayer/fireEnemy/reset`, `step(world,input,dt,api)`, `STEP=1/120`, `bindUI(els,game)` — same names across tasks.
