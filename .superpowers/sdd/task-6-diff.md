diff --git a/.superpowers/sdd/progress.md b/.superpowers/sdd/progress.md
new file mode 100644
index 0000000..f2050c2
--- /dev/null
+++ b/.superpowers/sdd/progress.md
@@ -0,0 +1,5 @@
+Task 1: complete (commits 4d13a3c..4ee600a, review clean)
+Task 2: complete (commits 4ee600a..b8cb4e6, review clean after fix)
+Task 3: complete (commits b8cb4e6..118b542, review clean)
+Task 4: complete (commits 118b542..8b5faf6, review pass; minors: hitbox alloc/step, double-onHit same step -> Task 6)
+Task 5: complete (commits 8b5faf6..fca5481, review pass; minors: float score display -> Task 6)
diff --git a/.superpowers/sdd/task-1-diff.md b/.superpowers/sdd/task-1-diff.md
new file mode 100644
index 0000000..4593583
--- /dev/null
+++ b/.superpowers/sdd/task-1-diff.md
@@ -0,0 +1,60 @@
+diff --git a/index.html b/index.html
+new file mode 100644
+index 0000000..9241916
+--- /dev/null
++++ b/index.html
+@@ -0,0 +1,38 @@
++<!DOCTYPE html>
++<html lang="en">
++<head>
++<meta charset="utf-8">
++<meta name="viewport" content="width=device-width,initial-scale=1">
++<title>Bullet Hell — Space Invaders</title>
++<link rel="stylesheet" href="style.css">
++</head>
++<body>
++<div id="game">
++  <div id="game-layer"></div>
++  <div id="hud-layer">
++    <span id="hud-timer">90.0</span>
++    <span id="hud-score">0</span>
++    <span id="hud-lives">3</span>
++    <span id="hud-fps">-- fps</span>
++  </div>
++  <div id="overlay-layer">
++    <div id="menu" class="overlay">
++      <h1>BULLET HELL</h1>
++      <p>Move: Arrows/WASD · Fire: Space (hold) · Pause: P/Esc</p>
++      <button id="btn-start">Start (Enter)</button>
++    </div>
++    <div id="pause-menu" class="overlay hidden">
++      <h1>PAUSED</h1>
++      <button id="btn-continue">Continue (P)</button>
++      <button id="btn-restart-pause">Restart</button>
++    </div>
++    <div id="gameover" class="overlay hidden">
++      <h1 id="gameover-title">GAME OVER</h1>
++      <p id="gameover-stats"></p>
++      <button id="btn-restart-over">Restart (Enter)</button>
++    </div>
++  </div>
++</div>
++<script type="module" src="js/main.js"></script>
++</body>
++</html>
+diff --git a/style.css b/style.css
+new file mode 100644
+index 0000000..9bb7e0f
+--- /dev/null
++++ b/style.css
+@@ -0,0 +1,10 @@
++*{box-sizing:border-box;margin:0;padding:0}
++body{background:#05060f;color:#e8ecff;font-family:system-ui,sans-serif;display:flex;justify-content:center;padding:16px}
++#game{position:relative;width:800px;height:600px;background:#0a0e24;overflow:hidden;border:1px solid #2a3566}
++#game-layer{position:absolute;inset:0;z-index:1}
++#hud-layer{position:absolute;top:0;left:0;right:0;z-index:2;display:flex;gap:16px;padding:8px 12px;font-variant-numeric:tabular-nums;pointer-events:none}
++#overlay-layer{position:absolute;inset:0;z-index:3;pointer-events:none}
++.overlay{position:absolute;inset:0;display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center;background:rgba(5,8,20,.82);pointer-events:auto}
++.hidden{display:none!important}
++button{padding:10px 18px;font-size:16px;cursor:pointer}
++.ent{position:absolute;top:0;left:0;will-change:transform}
diff --git a/.superpowers/sdd/task-1-report.md b/.superpowers/sdd/task-1-report.md
new file mode 100644
index 0000000..cd2da49
--- /dev/null
+++ b/.superpowers/sdd/task-1-report.md
@@ -0,0 +1,25 @@
+# Task 1 Report — Static shell HTML+CSS
+
+## What implemented
+- Created `index.html` verbatim from plan: `#game` 800x600 arena, exactly 3 layers (`#game-layer`, `#hud-layer`, `#overlay-layer`), HUD spans (`#hud-timer`, `#hud-score`, `#hud-lives`, `#hud-fps`), overlays (`#menu`, `#pause-menu.hidden`, `#gameover.hidden`) with buttons (`#btn-start`, `#btn-continue`, `#btn-restart-pause`, `#btn-restart-over`), plus `#gameover-title` / `#gameover-stats`, and `<script type="module" src="js/main.js">` stub for Task 5.
+- Created `style.css` verbatim from plan: arena sizing, layer z-index 1/2/3, overlay centering with `pointer-events` scoping, `.hidden`, `.ent` with `will-change:transform`.
+- No JS, no extra styling, no deviations from plan text.
+
+## Tests + TDD evidence
+- RED (before files existed): ran plan Step 2 check — FAILED with `Error: missing game-layer` as expected (file did not exist). Evidence: `node -e "...existsSync...throw missing..."` → exit non-zero, message `missing game-layer`.
+- GREEN (after implementation): ran plan Step 4 check — PASS `shell ok`.
+  Command: `node -e "const fs=require('fs'); const h=fs.readFileSync('index.html','utf8'); for(const id of ['game-layer','hud-timer','pause-menu']) if(!h.includes(id)) throw new Error('missing '+id); console.log('shell ok')"`
+- Extended self-check: verified all 17 interface ids (`game`, layers, HUD, overlays, buttons, gameover-title/stats) present in `index.html` → `all ids ok`. style.css 867 bytes.
+- Manual browser open not performed in this headless environment (noted as residual).
+
+## Files changed
+- `index.html` (new, 38 lines)
+- `style.css` (new, 10 lines)
+
+## Self-review (completeness / quality / YAGNI)
+- Completeness: all DOM ids Task 2–5 rely on exist; nothing missing vs Task 1 Interfaces list.
+- Quality: byte-identical to plan code; layering/z-index and pointer-events rules correct for later render + HUD + overlay work.
+- YAGNI: added nothing beyond plan (no JS, no extra CSS classes, no win overlay — `gameover` reused for win per Task 5 `ui.gameover(win)`).
+
+## Concerns
+- None blocking. Minor: CRLF/LF warning on commit (Windows git autocrlf) — harmless. `js/main.js` referenced but intentionally absent until Task 5; browser console will 404 on open until then.
diff --git a/.superpowers/sdd/task-2-diff.md b/.superpowers/sdd/task-2-diff.md
new file mode 100644
index 0000000..2d95553
--- /dev/null
+++ b/.superpowers/sdd/task-2-diff.md
@@ -0,0 +1,84 @@
+diff --git a/js/input.js b/js/input.js
+new file mode 100644
+index 0000000..e27e064
+--- /dev/null
++++ b/js/input.js
+@@ -0,0 +1,36 @@
++export function createInput() {
++  const keys = new Set();
++  const st = { onPause: null, onConfirm: null };
++  function kd(e) {
++    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)) e.preventDefault?.();
++    if (e.repeat) return;
++    keys.add(e.code);
++    if (e.code === 'KeyP' || e.code === 'Escape') st.onPause?.();
++    if (e.code === 'Enter' || e.code === 'Space') st.onConfirm?.();
++  }
++  function ku(e) { keys.delete(e.code); }
++  function blur() { keys.clear(); }
++  return {
++    keys,
++    get onPause() { return st.onPause; },
++    set onPause(fn) { st.onPause = fn; },
++    get onConfirm() { return st.onConfirm; },
++    set onConfirm(fn) { st.onConfirm = fn; },
++    isDown(c) { return keys.has(c); },
++    attach() {
++      if (typeof window !== 'undefined' && window.addEventListener) {
++        window.addEventListener('keydown', kd);
++        window.addEventListener('keyup', ku);
++        window.addEventListener('blur', blur);
++      }
++    },
++    detach() {
++      if (typeof window !== 'undefined' && window.removeEventListener) {
++        window.removeEventListener('keydown', kd);
++        window.removeEventListener('keyup', ku);
++        window.removeEventListener('blur', blur);
++      }
++    },
++    _kd: kd, _ku: ku, _blur: blur,
++  };
++}
+diff --git a/tests/input.test.mjs b/tests/input.test.mjs
+new file mode 100644
+index 0000000..ea504e7
+--- /dev/null
++++ b/tests/input.test.mjs
+@@ -0,0 +1,36 @@
++import assert from 'node:assert';
++import { createInput } from '../js/input.js';
++globalThis.window ??= { addEventListener(){}, removeEventListener(){} };
++const input = createInput();
++input._kd({ code: 'ArrowLeft', repeat: false, preventDefault(){} });
++input._kd({ code: 'ArrowLeft', repeat: true, preventDefault(){} });
++assert.ok(input.isDown('ArrowLeft'));
++assert.equal(input.keys.size, 1);
++input._ku({ code: 'ArrowLeft' });
++assert.ok(!input.isDown('ArrowLeft'));
++// onPause fires via _kd
++let pauseCount = 0;
++input.onPause = () => { pauseCount++; };
++input._kd({ code: 'KeyP', repeat: false, preventDefault(){} });
++assert.equal(pauseCount, 1);
++input._kd({ code: 'Escape', repeat: false, preventDefault(){} });
++assert.equal(pauseCount, 2);
++// onConfirm fires via _kd
++let confirmCount = 0;
++input.onConfirm = () => { confirmCount++; };
++input._kd({ code: 'Enter', repeat: false, preventDefault(){} });
++assert.equal(confirmCount, 1);
++input._kd({ code: 'Space', repeat: false, preventDefault(){} });
++assert.equal(confirmCount, 2);
++// preventDefault called for Space
++let pdCalled = false;
++input._ku({ code: 'Space' });
++input._kd({ code: 'Space', repeat: false, preventDefault(){ pdCalled = true; } });
++assert.ok(pdCalled);
++// blur clears keys
++input._kd({ code: 'ArrowRight', repeat: false, preventDefault(){} });
++assert.ok(input.isDown('ArrowRight'));
++input._blur();
++assert.ok(!input.isDown('ArrowRight'));
++assert.equal(input.keys.size, 0);
++console.log('input ok');
diff --git a/.superpowers/sdd/task-2-report.md b/.superpowers/sdd/task-2-report.md
new file mode 100644
index 0000000..2213ceb
--- /dev/null
+++ b/.superpowers/sdd/task-2-report.md
@@ -0,0 +1,33 @@
+# Task 2 Report — Input: smooth keyboard Set
+
+## Implementation
+- Created `js/input.js` verbatim from plan: `createInput()` returns `{ keys, onPause, onConfirm, isDown, attach, detach, _kd, _ku }`.
+- `kd` preventDefaults arrows/Space, ignores `e.repeat`, adds to Set; `KeyP`/`Escape` → `onPause`, `Enter`/`Space` → `onConfirm`; `ku` deletes; `blur` clears.
+- `attach`/`detach` guard on `typeof window` — node-testable, no DOM dependency.
+- Created `tests/input.test.mjs` verbatim from plan (full version with `window` shim, repeat-dedup assert, `keys.size === 1`).
+
+## Tests + TDD evidence
+- RED (before `js/input.js` existed):
+  - Cmd: `node tests/input.test.mjs`
+  - Output: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../js/input.js'`, EXIT 1. ✅ expected FAIL
+- GREEN (after implementation):
+  - Cmd: `node tests/input.test.mjs`
+  - Output: `input ok`, EXIT 0. ✅ PASS
+- Extra sanity check: Space keydown/keyup cycle works; `attach()`/`detach()` no-throw under node shim.
+
+## Files changed
+- `js/input.js` (new)
+- `tests/input.test.mjs` (new)
+
+## Self-review
+- Matches plan verbatim; interface `{ keys, isDown, attach, detach, _kd, _ku }` as specified; no DOM at import time.
+
+## Fix (2026-09-19) — settable callbacks via getters
+- Root cause: `return { ...st }` spread copied nulls; `kd` reads `st.*` so `input.onPause = fn` never fired.
+- Fix: replaced spread with `get/set onPause/onConfirm` closing over `st`; added `_blur` exposure. All other behavior identical.
+- Tests: extended `tests/input.test.mjs` — onPause fires (KeyP/Escape), onConfirm fires (Enter/Space), Space preventDefault called, `_blur()` clears keys. Kept existing asserts.
+- Verify: `node tests/input.test.mjs` → `input ok`, EXIT 0 ✅; Task 1 shell check → `shell ok`, EXIT 0 ✅ (no regression).
+- Commit: `b8cb4e6 fix: make input callbacks settable via getters` (js/input.js, tests/input.test.mjs).
+
+## Concerns (resolved by fix above)
+- **Load-bearing bug in plan code (kept verbatim per instructions):** `return { keys, ...st, ... }` spread-copies `onPause`/`onConfirm`, so later `input.onPause = fn` sets a property on the returned object but `kd` reads `st.onPause` (still `null`). Verified: assigning `onPause` then `_kd({code:'KeyP'})` does NOT fire it. **Task 5 (`input.onPause = togglePause`) will silently break** unless fixed — recommend Task 5 worker expose `onPause`/`onConfirm` via getter/setter closing over `st`, or return `st` by reference.
diff --git a/.superpowers/sdd/task-3-diff.md b/.superpowers/sdd/task-3-diff.md
new file mode 100644
index 0000000..efdcb91
--- /dev/null
+++ b/.superpowers/sdd/task-3-diff.md
@@ -0,0 +1,82 @@
+diff --git a/js/entities.js b/js/entities.js
+new file mode 100644
+index 0000000..522a85d
+--- /dev/null
++++ b/js/entities.js
+@@ -0,0 +1,42 @@
++function makeDiv(layer, cls, w, h, color) {
++  const el = typeof document !== 'undefined' ? document.createElement('div') : { style: {} };
++  el.className = 'ent ' + cls;
++  el.style.width = w + 'px'; el.style.height = h + 'px'; el.style.background = color;
++  el.style.display = 'none';
++  layer.appendChild?.(el);
++  return el;
++}
++function makePool(layer, cls, n, w, h, color) {
++  const arr = [];
++  for (let i = 0; i < n; i++) arr.push({ el: makeDiv(layer, cls, w, h, color), x: 0, y: 0, vx: 0, vy: 0, w, h, active: false, kind: cls });
++  return arr;
++}
++export function createWorld(layer) {
++  const player = { el: makeDiv(layer, 'player', 28, 20, '#4df3ff'), x: 386, y: 540, vx: 0, vy: 0, w: 28, h: 20, active: true, kind: 'player', invuln: 0 };
++  const enemies = makePool(layer, 'enemy', 12, 30, 22, '#ff4d6d');
++  const pBullets = makePool(layer, 'pb', 30, 4, 12, '#ffe14d');
++  const eBullets = makePool(layer, 'eb', 80, 7, 7, '#ff8b3d');
++  function get(pool) { return pool.find(e => !e.active); }
++  return {
++    player, enemies, pBullets, eBullets,
++    spawnEnemy(type, x) {
++      const e = get(enemies); if (!e) return null;
++      e.active = true; e.kind = type; e.x = x; e.y = -30; e.t = 0;
++      return e;
++    },
++    firePlayer() {
++      const b = get(pBullets); if (!b) return null;
++      b.active = true; b.x = player.x + player.w / 2 - 2; b.y = player.y - 12; b.vx = 0; b.vy = -600;
++      return b;
++    },
++    fireEnemy(x, y, vx, vy) {
++      const b = get(eBullets); if (!b) return null;
++      b.active = true; b.x = x; b.y = y; b.vx = vx; b.vy = vy;
++      return b;
++    },
++    reset() {
++      for (const p of [...enemies, ...pBullets, ...eBullets]) p.active = false;
++      player.x = 386; player.y = 540; player.invuln = 0; player.active = true;
++    },
++  };
++}
+diff --git a/style.css b/style.css
+index 9bb7e0f..87de5e2 100644
+--- a/style.css
++++ b/style.css
+@@ -1,10 +1,14 @@
+ *{box-sizing:border-box;margin:0;padding:0}
+ body{background:#05060f;color:#e8ecff;font-family:system-ui,sans-serif;display:flex;justify-content:center;padding:16px}
+ #game{position:relative;width:800px;height:600px;background:#0a0e24;overflow:hidden;border:1px solid #2a3566}
+ #game-layer{position:absolute;inset:0;z-index:1}
+ #hud-layer{position:absolute;top:0;left:0;right:0;z-index:2;display:flex;gap:16px;padding:8px 12px;font-variant-numeric:tabular-nums;pointer-events:none}
+ #overlay-layer{position:absolute;inset:0;z-index:3;pointer-events:none}
+ .overlay{position:absolute;inset:0;display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center;background:rgba(5,8,20,.82);pointer-events:auto}
+ .hidden{display:none!important}
+ button{padding:10px 18px;font-size:16px;cursor:pointer}
+ .ent{position:absolute;top:0;left:0;will-change:transform}
++.player{border-radius:6px}
++.enemy{border-radius:4px}
++.pb{border-radius:2px}
++.eb{border-radius:50%}
+diff --git a/tests/entities.test.mjs b/tests/entities.test.mjs
+new file mode 100644
+index 0000000..b4e6085
+--- /dev/null
++++ b/tests/entities.test.mjs
+@@ -0,0 +1,9 @@
++import assert from 'node:assert';
++import { createWorld } from '../js/entities.js';
++const layer = { appendChild(){}, clientWidth: 800, clientHeight: 600 };
++const w = createWorld(layer);
++w.firePlayer(); w.firePlayer();
++assert.equal(w.pBullets.filter(b => b.active).length, 2);
++w.reset();
++assert.equal(w.pBullets.filter(b => b.active).length, 0);
++console.log('entities ok');
diff --git a/.superpowers/sdd/task-3-report.md b/.superpowers/sdd/task-3-report.md
new file mode 100644
index 0000000..c28451f
--- /dev/null
+++ b/.superpowers/sdd/task-3-report.md
@@ -0,0 +1,23 @@
+# Task 3 Report — Entities (pooled DOM divs)
+
+## Implementation
+- Created `js/entities.js` verbatim from plan: `makeDiv`/`makePool` helpers with `document` fallback (`{ style: {} }`), Node-testable via `layer.appendChild?.(el)`.
+- `createWorld(layer)` returns `{ player, enemies, pBullets, eBullets, spawnEnemy, firePlayer, fireEnemy, reset }`; entity shape `{ el, x, y, vx, vy, w, h, active, kind }` (+ `player.invuln`, enemy `t`).
+- Pools: player 28x20 `#4df3ff` at (386,540); 12 enemies 30x22 `#ff4d6d`; 30 pBullets 4x12 `#ffe14d` (vy -600); 80 eBullets 7x7 `#ff8b3d`.
+- Appended to `style.css`: `.player/.enemy/.pb/.eb` border-radius rules verbatim. Did NOT modify `js/input.js`.
+
+## TDD RED/GREEN
+- RED: wrote `tests/entities.test.mjs` verbatim first; `node tests/entities.test.mjs` → FAIL `ERR_MODULE_NOT_FOUND .../js/entities.js` as expected.
+- GREEN: after implementation → `entities ok`; regression `node tests/input.test.mjs` → `input ok` (both with only typeless-package warnings).
+
+## Files
+- `js/entities.js` (new), `tests/entities.test.mjs` (new), `style.css` (+4 lines).
+
+## Self-review
+- Interfaces match plan exactly: names `createWorld`, `spawnEnemy(type,x)`, `firePlayer()`, `fireEnemy(x,y,vx,vy)`, `reset()`; shape consumed by Task 4 `physics.js`/`main.js`.
+- Node-testable: no `document` dependency (fallback), optional-chained `appendChild`.
+- `git status` pre-commit showed only the 3 intended files modified; `js/input.js` untouched.
+
+## Concerns
+- None blocking. Minor: `reset()` uses array spread (allocates) — plan Task 6 already flags this for perf pass; fine for now.
+- Minor: Node emits `MODULE_TYPELESS_PACKAGE_JSON` warning (no `"type": "module"`); harmless, out of scope.
diff --git a/.superpowers/sdd/task-4-diff.md b/.superpowers/sdd/task-4-diff.md
new file mode 100644
index 0000000..b960ee6
--- /dev/null
+++ b/.superpowers/sdd/task-4-diff.md
@@ -0,0 +1,68 @@
+diff --git a/js/physics.js b/js/physics.js
+new file mode 100644
+index 0000000..8507000
+--- /dev/null
++++ b/js/physics.js
+@@ -0,0 +1,50 @@
++export const STEP = 1 / 120;
++export const W = 800, H = 600;
++export function aabb(a, b) {
++  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
++}
++const DIRS = [['ArrowLeft','KeyA',-1,0],['ArrowRight','KeyD',1,0],['ArrowUp','KeyW',0,-1],['ArrowDown','KeyS',0,1]];
++export function step(world, input, dt, api) {
++  const p = world.player;
++  let dx = 0, dy = 0;
++  for (const [c1, c2, x, y] of DIRS) if (input.isDown(c1) || input.isDown(c2)) { dx += x; dy += y; }
++  if (dx && dy) { dx *= Math.SQRT1_2; dy *= Math.SQRT1_2; }
++  p.x = Math.min(W - p.w, Math.max(0, p.x + dx * 320 * dt));
++  p.y = Math.min(H - p.h, Math.max(0, p.y + dy * 320 * dt));
++  if (p.invuln > 0) p.invuln -= dt;
++  api.fireCd -= dt;
++  if ((input.isDown('Space')) && api.fireCd <= 0) { world.firePlayer(); api.fireCd = 0.125; }
++  for (const e of world.enemies) {
++    if (!e.active) continue;
++    e.t += dt;
++    if (e.kind === 'weaver') { e.x += Math.sin(e.t * 3) * 120 * dt; e.y += 60 * dt; }
++    else if (e.kind === 'diver') { e.y += 160 * dt; }
++    else { e.y += 45 * dt; }
++    if (e.y > H + 40) e.active = false;
++  }
++  for (const b of world.pBullets) {
++    if (!b.active) continue;
++    b.x += b.vx * dt; b.y += b.vy * dt;
++    if (b.y < -20) b.active = false;
++  }
++  for (const b of world.eBullets) {
++    if (!b.active) continue;
++    b.x += b.vx * dt; b.y += b.vy * dt;
++    if (b.y > H + 20 || b.x < -20 || b.x > W + 20) b.active = false;
++  }
++  for (const b of world.pBullets) {
++    if (!b.active) continue;
++    for (const e of world.enemies) {
++      if (e.active && aabb(b, e)) { b.active = false; e.active = false; api.onKill(e); break; }
++    }
++  }
++  if (p.invuln <= 0) {
++    const hitbox = { x: p.x + 9, y: p.y + 5, w: 10, h: 10 };
++    for (const b of world.eBullets) {
++      if (b.active && aabb(hitbox, b)) { b.active = false; api.onHit(); break; }
++    }
++    if (p.active) for (const e of world.enemies) {
++      if (e.active && aabb(hitbox, e)) { e.active = false; api.onHit(); break; }
++    }
++  }
++}
+diff --git a/tests/physics.test.mjs b/tests/physics.test.mjs
+new file mode 100644
+index 0000000..db8e759
+--- /dev/null
++++ b/tests/physics.test.mjs
+@@ -0,0 +1,6 @@
++import assert from 'node:assert';
++import { aabb, STEP } from '../js/physics.js';
++assert.equal(STEP, 1/120);
++assert.ok(aabb({x:0,y:0,w:10,h:10},{x:5,y:5,w:10,h:10}));
++assert.ok(!aabb({x:0,y:0,w:10,h:10},{x:20,y:20,w:10,h:10}));
++console.log('physics ok');
diff --git a/.superpowers/sdd/task-4-report.md b/.superpowers/sdd/task-4-report.md
new file mode 100644
index 0000000..99c510f
--- /dev/null
+++ b/.superpowers/sdd/task-4-report.md
@@ -0,0 +1,67 @@
+# Task 4 Review — Physics (fixed step, move, collide)
+
+**Verdict: PASS — spec-compliant, ready to proceed to Task 5. No blocking issues; 1 minor perf nit, 3 minor notes.**
+
+Reviewed: `js/physics.js` (50 lines) + `tests/physics.test.mjs` (6 lines), commit `8b5faf6` vs base `118b542`.
+Method: read-only. Plan spec (Task 4, `docs/superpowers/plans/2026-09-19-bullet-hell.md` lines 325–418) compared line-by-line
+against implementation; `node tests/physics.test.mjs` → `physics ok`; `node --check js/physics.js` clean;
+18-case functional harness (movement, normalize, fire rate, enemy rates, culling, collisions, hitbox, invuln) — all passed.
+
+### Spec Compliance
+
+| Requirement | Status | Evidence |
+|---|---|---|
+| `STEP = 1/120` export | ✅ | `js/physics.js:1`, test asserts `STEP == 1/120` |
+| `dt` in seconds, speeds in px/s | ✅ | All motion `* dt`: player 320, weaver 120/60, diver 160, gunner 45, bullets `v*dt` |
+| `aabb(a,b)` export, strict-overlap semantics | ✅ | `js/physics.js:3-5`, byte-identical to spec |
+| `step(world, input, dt, api)` signature, `api = { onKill, onHit, fireCd }` | ✅ | `js/physics.js:7`, consumes Task 3 `createWorld` shape + `input.isDown` |
+| `DIRS` arrows + WASD mapping | ✅ | `js/physics.js:6` — ArrowLeft/KeyA, ArrowRight/KeyD, ArrowUp/KeyW, ArrowDown/KeyS |
+| Diagonal normalize `SQRT1_2` | ✅ | `js/physics.js:11`; verified numerically: diagonal magnitude == cardinal (320.0000) |
+| Fire rate 8/s (`fireCd = 0.125`) | ✅ | `js/physics.js:16`; verified: fires once, cooldown blocks second shot within window |
+| Weaver: `sin(t*3)*120*dt` x, `60*dt` y | ✅ | `js/physics.js:20`; verified rate + sinusoid displacement |
+| Diver: `160*dt` y | ✅ | Verified exactly `160*STEP` per step |
+| Gunner (else branch): `45*dt` y | ✅ | Verified exactly `45*STEP` per step |
+| Bounds 800x600, player clamp, enemy cull `y > H+40` | ✅ | `W/H` exports; clamp `[0, W-p.w]`/`[0, H-p.h]` verified at both edges |
+| Bullet culling (p: `y<-20`; e: `y>H+20 \|\| x<-20 \|\| x>W+20`) | ✅ | Verified deactivation for both pools |
+| pBullet→enemy calls `onKill(e)`, deactivates both, `break` | ✅ | Verified `kills===1`, both inactive |
+| eBullet→player and enemy→player call `onHit()`, `break` | ✅ | Verified `hits===1`, bullet/enemy deactivated |
+| Invuln: decrement by `dt`, skip player-hit checks while `> 0` | ✅ | Verified decrement `1.0 → 1.0-STEP` and hit blocked at `invuln=1.0` |
+| Small player hitbox 10px (`x+9, y+5, 10x10`) | ✅ | Byte-identical to spec; verified grazing corner shot (full 28x20 body overlap, outside inset) misses while centered shot hits |
+| No alloc in loop | ⚠️ | One nit — see Issues #1 |
+
+### Strengths
+
+- **Byte-faithful to spec.** Implementation lines 1–50 match the plan's reference code exactly; zero drift from the reviewed design.
+- **Correct fixed-step math.** Every velocity is `dt`-scaled px/s; 120 Hz stepping preserves game speed across 60/120/165 Hz displays per global constraint.
+- **Hitbox done right.** 10x10 inset on a 28x20 sprite gives fair bullet-hell grazing; verified empirically, not just by reading.
+- **Cooldown gating correct.** `fireCd -= dt` unconditionally, fire only on `Space && fireCd <= 0`, reset to `0.125` — hold-to-fire at exactly 8/s.
+- **Collision termination.** `break` after first kill/hit per bullet keeps one bullet from multi-killing and bounds inner-loop cost.
+- **Clean interfaces.** Consumes only `world.player/enemies/pBullets/eBullets/spawnEnemy/firePlayer/fireEnemy` and `input.isDown` — no coupling to DOM or render.
+
+### Issues
+
+1. **Minor (perf): per-step `hitbox` allocation violates "no alloc in loop".** `js/physics.js:42` creates
+   `{ x: p.x + 9, y: p.y + 5, w: 10, h: 10 }` on every `step()` while vulnerable — 120 small objects/s of GC churn.
+   Task 6 explicitly requires "no allocation (reused pools…)". Fix (one line, suggested for Task 5/6, not blocking):
+   hoist to module scope, e.g. `const HITBOX = { x:0, y:0, w:10, h:10 };` and mutate fields per step.
+   (The `for (const [c1,c2,x,y] of DIRS)` destructuring also touches the iterator protocol per step, but that is
+   negligible and spec-prescribed — not flagged as a violation.)
+2. **Minor (gameplay, inherited from spec): double-`onHit` possible in one step.** If an eBullet and an enemy both
+   overlap the hitbox in the same `step()`, both `onHit()` calls fire: the `p.invuln <= 0` branch is entered once and
+   never re-checked, even though the real `onHit` (main.js) sets `invuln = 1.5` on the first hit. Net effect: 2 lives
+   lost in a single 1/120 s step. Spec reference code has the same structure, so compliant — but Task 5's `onHit`
+   should ideally early-return if `player.invuln > 0`, or physics should re-guard before the enemy loop.
+3. **Minor (consistency): `if (p.active)` guards the enemy-collision loop but not the eBullet loop** (`js/physics.js:43`
+   vs `:46`). Harmless today (`player.active` is always `true`; nothing ever deactivates it), but the asymmetry will
+   confuse future readers. Pick one guard for both.
+4. **Minor (coverage): test file checks only `STEP` + `aabb`, not `step()`.** This matches the plan's prescribed test
+   verbatim, so it is compliant — but movement, fire rate, collisions, and invuln have zero regression coverage.
+   Recommend extending `tests/physics.test.mjs` with the behaviors verified ad-hoc in this review (all 18 passed).
+
+### Assessment
+
+**Ready to proceed to Task 5 (main loop).** Logic, numbers, interfaces, and edge behavior (clamps, culls, cooldown,
+invuln, inset hitbox) all verified by execution, not just inspection. No Critical or Important issues.
+Suggested follow-ups, none blocking: hoist `HITBOX` (Issue #1) and add an `invuln` re-guard (Issue #2) when Task 5
+wires the real `api`; extend the physics test with `step()` cases (Issue #4). Diff file `task-4-diff.md` verified
+byte-identical to `git diff 118b542..HEAD`.
diff --git a/.superpowers/sdd/task-5-diff.md b/.superpowers/sdd/task-5-diff.md
new file mode 100644
index 0000000..a9f5d33
--- /dev/null
+++ b/.superpowers/sdd/task-5-diff.md
@@ -0,0 +1,126 @@
+diff --git a/js/main.js b/js/main.js
+new file mode 100644
+index 0000000..97b4d7d
+--- /dev/null
++++ b/js/main.js
+@@ -0,0 +1,90 @@
++import { createInput } from './input.js';
++import { createWorld } from './entities.js';
++import { step, STEP } from './physics.js';
++import { bindUI } from './ui.js';
++
++const layer = document.getElementById('game-layer');
++const world = createWorld(layer);
++const input = createInput();
++input.attach();
++const game = { state: 'menu', score: 0, lives: 3, timeLeft: 90, elapsed: 0, combo: 1, comboT: 0 };
++const ui = bindUI({ timer: hud('hud-timer'), score: hud('hud-score'), lives: hud('hud-lives'), fps: hud('hud-fps') }, game);
++function hud(id) { return document.getElementById(id); }
++
++const api = { fireCd: 0,
++  onKill() { game.score += 100 * game.combo; },
++  onHit() { if (game.lives <= 0 || world.player.invuln > 0) return; game.lives -= 1; world.player.invuln = 1.5; game.combo = 1; if (game.lives <= 0) end(false); },
++};
++let spawnT = 0, wave = 0, last = performance.now(), acc = 0;
++let fpsFrames = 0, fpsT = 0, fpsText = '-- fps';
++
++function reset() {
++  world.reset();
++  game.score = 0; game.lives = 3; game.timeLeft = 90; game.elapsed = 0; game.combo = 1; game.comboT = 0;
++  api.fireCd = 0; spawnT = 0; wave = 0; acc = 0;
++}
++function start() { reset(); game.state = 'playing'; ui.show(null); }
++function togglePause() {
++  if (game.state === 'playing') { game.state = 'paused'; ui.show('pause-menu'); }
++  else if (game.state === 'paused') { game.state = 'playing'; ui.show(null); last = performance.now(); }
++}
++function end(win) { game.state = win ? 'win' : 'gameover'; ui.gameover(win); ui.show('gameover'); }
++input.onPause = togglePause;
++input.onConfirm = () => { if (game.state === 'menu' || game.state === 'gameover' || game.state === 'win') start(); };
++document.getElementById('btn-start').onclick = start;
++document.getElementById('btn-continue').onclick = togglePause;
++document.getElementById('btn-restart-pause').onclick = start;
++document.getElementById('btn-restart-over').onclick = start;
++document.addEventListener('visibilitychange', () => { if (document.hidden && game.state === 'playing') togglePause(); });
++window.addEventListener('blur', () => { if (game.state === 'playing') togglePause(); });
++
++function spawner(dt) {
++  spawnT -= dt;
++  if (spawnT > 0) return;
++  spawnT = Math.max(1.2, 4 - wave * 0.15);
++  wave++;
++  const kinds = ['weaver', 'diver', 'gunner'];
++  for (let i = 0; i < Math.min(2 + (wave >> 2), 5); i++) {
++    const e = world.spawnEnemy(kinds[(wave + i) % 3], 60 + Math.random() * 620);
++    if (e && e.kind === 'gunner') {
++      const dx = (world.player.x - e.x) * 0.4, sp = 150 + wave * 4;
++      world.fireEnemy(e.x + 11, e.y + 22, dx, sp);
++    } else if (e) {
++      world.fireEnemy(e.x + 11, e.y + 22, (Math.random() - 0.5) * 80, 140 + wave * 3);
++    }
++  }
++}
++
++function render() {
++  const p = world.player;
++  p.el.style.display = 'block';
++  p.el.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
++  p.el.style.opacity = p.invuln > 0 && (performance.now() / 150 | 0) % 2 ? '0.25' : '1';
++  for (const arr of [world.enemies, world.pBullets, world.eBullets]) {
++    for (const e of arr) {
++      if (!e.active) { if (e.el.style.display !== 'none') e.el.style.display = 'none'; continue; }
++      if (e.el.style.display !== 'block') e.el.style.display = 'block';
++      e.el.style.transform = `translate3d(${e.x}px,${e.y}px,0)`;
++    }
++  }
++}
++
++function loop(now) {
++  requestAnimationFrame(loop);
++  let raw = (now - last) / 1000;
++  last = now;
++  fpsFrames++; fpsT += raw;
++  if (fpsT >= 0.5) { fpsText = `${Math.round(fpsFrames / fpsT)} fps`; ui.fps(fpsText); fpsFrames = 0; fpsT = 0; }
++  if (game.state !== 'playing') return;
++  if (raw > 0.033) raw = 0.033;
++  if (raw < 0) raw = 0;
++  acc += raw;
++  let n = 0;
++  while (acc >= STEP && n < 5) { spawner(STEP); step(world, input, STEP, api); game.timeLeft -= STEP; game.elapsed += STEP; game.comboT += STEP; if (game.comboT > 8) { game.comboT = 0; game.combo = Math.min(5, game.combo + 1); } acc -= STEP; n++; }
++  if (game.timeLeft <= 0) { game.timeLeft = 0; end(true); }
++  game.score += raw * 10;
++  render();
++  ui.frame(raw);
++}
++ui.show('menu');
++requestAnimationFrame((t) => { last = t; requestAnimationFrame(loop); });
+diff --git a/js/ui.js b/js/ui.js
+new file mode 100644
+index 0000000..3e468a5
+--- /dev/null
++++ b/js/ui.js
+@@ -0,0 +1,24 @@
++export function bindUI(els, game) {
++  const t = els.timer, s = els.score, l = els.lives, f = els.fps;
++  let acc = 0;
++  return {
++    frame(dt) {
++      acc += dt;
++      if (acc < 0.25) return;
++      acc = 0;
++      t.textContent = game.timeLeft.toFixed(1);
++      s.textContent = String(game.score);
++      l.textContent = String(game.lives);
++    },
++    fps(text) { f.textContent = text; },
++    show(id) {
++      for (const k of ['menu','pause-menu','gameover'])
++        document.getElementById(k).classList.toggle('hidden', k !== id);
++      if (!id) for (const k of ['menu','pause-menu','gameover']) document.getElementById(k).classList.add('hidden');
++    },
++    gameover(win) {
++      document.getElementById('gameover-title').textContent = win ? 'YOU WIN' : 'GAME OVER';
++      document.getElementById('gameover-stats').textContent = `Score ${game.score} · Time ${game.elapsed.toFixed(1)}s`;
++    },
++  };
++}
diff --git a/.superpowers/sdd/task-5-report.md b/.superpowers/sdd/task-5-report.md
new file mode 100644
index 0000000..d72dc73
--- /dev/null
+++ b/.superpowers/sdd/task-5-report.md
@@ -0,0 +1,22 @@
+# Task 5 Report — Main loop (states, spawner, render, FPS + UI)
+
+## Status
+Done. Created `js/ui.js` + `js/main.js` verbatim from plan Task 5, with one allowed deviation: `api.onHit` guard in `main.js` (early-return if `lives <= 0` or `player.invuln > 0`). No changes to Tasks 1–4 files.
+
+## Commit
+- `fca5481` — "feat: add main loop with states spawner render and FPS" (`js/main.js`, `js/ui.js`)
+
+## Tests
+- `node --check js/main.js && node --check js/ui.js` → `ok`
+- Regressions: `node tests/input.test.mjs` → `input ok`; `node tests/entities.test.mjs` → `entities ok`; `node tests/physics.test.mjs` → `physics ok`
+- DOM id check: all ids referenced in `main.js`/`ui.js` (`game-layer`, `btn-start`, `btn-continue`, `btn-restart-pause`, `btn-restart-over`, `gameover-title`, `gameover-stats`, `hud-timer`, `hud-score`, `hud-lives`, `hud-fps`, plus `menu`/`pause-menu`/`gameover` via `ui.show`) exist in `index.html` → `ids ok`
+- Manual browser check (per plan: Enter starts, hold-move, Space fires, P pauses, HUD countdown, FPS meter) NOT run — no browser in this environment.
+
+## Concerns
+- Double-hit guard lives in `api.onHit` (main.js) rather than `physics.js`, per brief constraint; physics still calls `onHit` twice per step in bullet+enemy overlap, but second call is now a no-op. Correct behavior.
+- `ui.show` string ids (`menu`, `pause-menu`, `gameover`) are dynamic lookups — covered by manual id grep, not the `getElementById('…')` regex.
+- Browser-only verification (60/165Hz smoothness, pause stability) left for Task 6 perf pass.
+
+## Path
+- Files: `js/main.js`, `js/ui.js`
+- Plan: `docs/superpowers/plans/2026-09-19-bullet-hell.md` (Task 5)
diff --git a/.superpowers/sdd/task-6-report.md b/.superpowers/sdd/task-6-report.md
new file mode 100644
index 0000000..05ea360
--- /dev/null
+++ b/.superpowers/sdd/task-6-report.md
@@ -0,0 +1,28 @@
+# Task 6 Report — Perf pass + audit verification
+
+## Changes (small, behavior-identical)
+- `js/physics.js`: hoisted per-step hitbox alloc to module-scope `const HITBOX = {x:0,y:0,w:10,h:10}`; `step()` now mutates `HITBOX.x/y` only. Zero allocs in hot path.
+- `js/entities.js`: `reset()` spread `[...enemies,...pBullets,...eBullets]` replaced with three plain `for...of` loops, no alloc.
+- `js/ui.js`: HUD `frame()` shows `String(Math.floor(game.score))`; `gameover()` shows `Score ${Math.floor(game.score)}`. Internal `game.score` stays float (`main.js:85` `+= raw*10` untouched).
+- `js/main.js`: no change needed (score display lives in `ui.js`); render loop already guarded.
+
+## Test outputs
+- `node tests/input.test.mjs` → `input ok` (PASS)
+- `node tests/entities.test.mjs` → `entities ok` (PASS)
+- `node tests/physics.test.mjs` → `physics ok` (PASS)
+- `node --check js/main.js` → PASS; `node --check js/ui.js` → PASS; `ALL-OK`
+- (Note: Node prints MODULE_TYPELESS_PACKAGE_JSON warnings — harmless, no `type:module` in package.json.)
+
+## Static audit
+- Grep `offsetWidth|offsetHeight|getBoundingClientRect|querySelector` in `js/` → **no hits**. No layout reads in loop.
+- Grep `\.style\.` in `js/` → only:
+  - `main.js` render: `display`, `transform: translate3d`, `opacity` (+ guarded display writes) — compliant.
+  - `entities.js` `makeDiv` (init-time only): `width/height/background/display` — not in loop.
+- HUD text writes throttled: `ui.frame` 4Hz, `ui.fps` 2Hz. Physics uses pooled arrays, cached `W/H` constants.
+
+## Manual browser checklist (for user — requires DevTools, not doable headless here)
+1. Open `index.html` → Enter starts, hold arrows/WASD smooth, Space fires, P/Esc pauses.
+2. DevTools Performance → record 30s heavy play → FPS avg ≥ 60 (≈165 on 165Hz), no long tasks, no dropped-frame gaps on pause/resume (Continue + Restart).
+3. Rendering → Paint flashing: only game-layer rects repaint; HUD/overlay static except 4Hz text.
+4. Test 60Hz vs 165Hz (or device emulation): same game speed (dt-clamped, 120Hz fixed step, max 5 substeps).
+5. Blur tab / switch away mid-play → auto-pauses; resume via Continue keeps timer/positions stable.
diff --git a/docs/superpowers/plans/2026-09-19-bullet-hell.md b/docs/superpowers/plans/2026-09-19-bullet-hell.md
new file mode 100644
index 0000000..c14c724
--- /dev/null
+++ b/docs/superpowers/plans/2026-09-19-bullet-hell.md
@@ -0,0 +1,620 @@
+# Bullet-Hell Implementation Plan
+
+> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
+
+**Goal:** Build a Space Invaders-genre bullet-hell shooter in plain JS/DOM that holds 60+ FPS on 60Hz and 165Hz screens.
+
+**Architecture:** Fixed-timestep (120Hz) physics decoupled from rAF render; pooled DOM divs moved only via `transform: translate3d`; 3 layers; state machine menu/playing/paused/gameover/win.
+
+**Tech Stack:** Plain HTML + CSS + JS (no frameworks, no canvas, no build step). Verification via browser + DevTools Performance.
+
+## Global Constraints
+
+- Plain JS/DOM and HTML only — no frameworks, no canvas, no external libs.
+- Game runs at least 60 FPS, no frame drops; proper `requestAnimationFrame` use.
+- Pause menu with Continue + Restart; pause must not drop frames.
+- Scoreboard shows timer (90s countdown), score, lives (3).
+- Layers minimal but not zero: exactly `#game-layer`, `#hud-layer`, `#overlay-layer`.
+- Keyboard only, smooth hold-to-move (no key-repeat dependence), multi-key OK.
+- Same game speed at 60Hz/120Hz/165Hz (dt-based, clamped).
+- Only `transform`/`opacity` in loop; no layout reads in loop.
+
+---
+
+### Task 1: Static shell — HTML + CSS + arena
+
+**Files:**
+- Create: `index.html`
+- Create: `style.css`
+- Test: manual browser open (no JS yet)
+
+**Interfaces:**
+- Consumes: nothing
+- Produces: DOM ids later tasks rely on — `#game` (800x600 arena), `#game-layer`, `#hud-layer`, `#overlay-layer`, HUD `#hud-timer #hud-score #hud-lives #hud-fps`, overlays `#menu #pause-menu #gameover` with buttons `#btn-start #btn-continue #btn-restart-pause #btn-restart-over`
+
+- [ ] **Step 1: Write the failing check**
+
+```html
+<!-- expected after implementation: index.html contains these ids -->
+<!-- #game #game-layer #hud-layer #overlay-layer #hud-timer #hud-score #hud-lives #hud-fps #menu #pause-menu #gameover -->
+```
+
+- [ ] **Step 2: Run check to verify it fails**
+
+Run: `node -e "const fs=require('fs'); const h=fs.existsSync('index.html')?fs.readFileSync('index.html','utf8'):''; for(const id of ['game-layer','hud-timer','pause-menu']) if(!h.includes(id)) throw new Error('missing '+id); console.log('shell ok')"`
+Expected: FAIL with "missing game-layer" (file does not exist yet)
+
+- [ ] **Step 3: Write minimal implementation**
+
+`index.html`:
+```html
+<!DOCTYPE html>
+<html lang="en">
+<head>
+<meta charset="utf-8">
+<meta name="viewport" content="width=device-width,initial-scale=1">
+<title>Bullet Hell — Space Invaders</title>
+<link rel="stylesheet" href="style.css">
+</head>
+<body>
+<div id="game">
+  <div id="game-layer"></div>
+  <div id="hud-layer">
+    <span id="hud-timer">90.0</span>
+    <span id="hud-score">0</span>
+    <span id="hud-lives">3</span>
+    <span id="hud-fps">-- fps</span>
+  </div>
+  <div id="overlay-layer">
+    <div id="menu" class="overlay">
+      <h1>BULLET HELL</h1>
+      <p>Move: Arrows/WASD · Fire: Space (hold) · Pause: P/Esc</p>
+      <button id="btn-start">Start (Enter)</button>
+    </div>
+    <div id="pause-menu" class="overlay hidden">
+      <h1>PAUSED</h1>
+      <button id="btn-continue">Continue (P)</button>
+      <button id="btn-restart-pause">Restart</button>
+    </div>
+    <div id="gameover" class="overlay hidden">
+      <h1 id="gameover-title">GAME OVER</h1>
+      <p id="gameover-stats"></p>
+      <button id="btn-restart-over">Restart (Enter)</button>
+    </div>
+  </div>
+</div>
+<script type="module" src="js/main.js"></script>
+</body>
+</html>
+```
+
+`style.css`:
+```css
+*{box-sizing:border-box;margin:0;padding:0}
+body{background:#05060f;color:#e8ecff;font-family:system-ui,sans-serif;display:flex;justify-content:center;padding:16px}
+#game{position:relative;width:800px;height:600px;background:#0a0e24;overflow:hidden;border:1px solid #2a3566}
+#game-layer{position:absolute;inset:0;z-index:1}
+#hud-layer{position:absolute;top:0;left:0;right:0;z-index:2;display:flex;gap:16px;padding:8px 12px;font-variant-numeric:tabular-nums;pointer-events:none}
+#overlay-layer{position:absolute;inset:0;z-index:3;pointer-events:none}
+.overlay{position:absolute;inset:0;display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center;background:rgba(5,8,20,.82);pointer-events:auto}
+.hidden{display:none!important}
+button{padding:10px 18px;font-size:16px;cursor:pointer}
+.ent{position:absolute;top:0;left:0;will-change:transform}
+```
+
+- [ ] **Step 4: Run check to verify it passes**
+
+Run: `node -e "const fs=require('fs'); const h=fs.readFileSync('index.html','utf8'); for(const id of ['game-layer','hud-timer','pause-menu']) if(!h.includes(id)) throw new Error('missing '+id); console.log('shell ok')"`
+Expected: PASS `shell ok`, plus open `index.html` in browser — menu visible, arena 800x600.
+
+- [ ] **Step 5: Commit**
+
+```bash
+git add index.html style.css
+git commit -m "feat: add static shell with HUD and overlays"
+```
+
+---
+
+### Task 2: Input — smooth keyboard Set
+
+**Files:**
+- Create: `js/input.js`
+- Test: `tests/input.test.mjs` (node, no DOM — uses fake window)
+
+**Interfaces:**
+- Consumes: nothing
+- Produces: `createInput()` returns `{ keys:Set, attach(), detach(), isDown(code:string):boolean }` — `main.js` uses `isDown('ArrowLeft')`, `'KeyA'`, `'Space'`, one-shot callbacks `onPause`, `onConfirm` set as properties.
+
+- [ ] **Step 1: Write the failing test**
+
+`tests/input.test.mjs`:
+```js
+import assert from 'node:assert';
+import { createInput } from '../js/input.js';
+const input = createInput();
+input.attach();
+window.__keydown({ code: 'ArrowLeft' });
+window.__keydown({ code: 'ArrowLeft' }); // repeat must stay single
+assert.ok(input.isDown('ArrowLeft'));
+window.__keyup({ code: 'ArrowLeft' });
+assert.ok(!input.isDown('ArrowLeft'));
+console.log('input ok');
+```
+
+- [ ] **Step 2: Run test to verify it fails**
+
+Run: `node tests/input.test.mjs`
+Expected: FAIL with "Cannot find module '../js/input.js'"
+
+- [ ] **Step 3: Write minimal implementation**
+
+`js/input.js`:
+```js
+export function createInput() {
+  const keys = new Set();
+  const st = { onPause: null, onConfirm: null };
+  function kd(e) {
+    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)) e.preventDefault?.();
+    if (e.repeat) return;
+    keys.add(e.code);
+    if (e.code === 'KeyP' || e.code === 'Escape') st.onPause?.();
+    if (e.code === 'Enter' || e.code === 'Space') st.onConfirm?.();
+  }
+  function ku(e) { keys.delete(e.code); }
+  function blur() { keys.clear(); }
+  return {
+    keys,
+    ...st,
+    isDown(c) { return keys.has(c); },
+    attach() {
+      if (typeof window !== 'undefined' && window.addEventListener) {
+        window.addEventListener('keydown', kd);
+        window.addEventListener('keyup', ku);
+        window.addEventListener('blur', blur);
+      }
+    },
+    detach() {
+      if (typeof window !== 'undefined' && window.removeEventListener) {
+        window.removeEventListener('keydown', kd);
+        window.removeEventListener('keyup', ku);
+        window.removeEventListener('blur', blur);
+      }
+    },
+    _kd: kd, _ku: ku,
+  };
+}
+```
+
+Test harness shim: run with `node --test` after adding to test file top:
+```js
+// shim for node (prepend to tests/input.test.mjs before import side-effects)
+globalThis.window = globalThis.window ?? { addEventListener(){}, removeEventListener(){} };
+```
+
+Full test file to write:
+```js
+import assert from 'node:assert';
+import { createInput } from '../js/input.js';
+globalThis.window ??= { addEventListener(){}, removeEventListener(){} };
+const input = createInput();
+input._kd({ code: 'ArrowLeft', repeat: false, preventDefault(){} });
+input._kd({ code: 'ArrowLeft', repeat: true, preventDefault(){} });
+assert.ok(input.isDown('ArrowLeft'));
+assert.equal(input.keys.size, 1);
+input._ku({ code: 'ArrowLeft' });
+assert.ok(!input.isDown('ArrowLeft'));
+console.log('input ok');
+```
+
+- [ ] **Step 4: Run test to verify it passes**
+
+Run: `node tests/input.test.mjs`
+Expected: PASS `input ok`
+
+- [ ] **Step 5: Commit**
+
+```bash
+git add js/input.js tests/input.test.mjs
+git commit -m "feat: add smooth keyboard input set"
+```
+
+---
+
+### Task 3: Entities — pooled DOM divs
+
+**Files:**
+- Create: `js/entities.js`
+- Modify: `style.css` (append entity styles)
+- Test: `tests/entities.test.mjs`
+
+**Interfaces:**
+- Consumes: `#game-layer` element (passed in)
+- Produces: `createWorld(layer)` returns `{ player, enemies[], pBullets[], eBullets[], spawnEnemy(type,x), firePlayer(), fireEnemy(x,y,vx,vy), reset() }`. Entity shape: `{ el, x,y,vx,vy,w,h,active, kind }`. `main.js` + `physics.js` use exactly these names.
+
+- [ ] **Step 1: Write the failing test**
+
+`tests/entities.test.mjs`:
+```js
+import assert from 'node:assert';
+import { createWorld } from '../js/entities.js';
+const layer = { appendChild(){}, clientWidth: 800, clientHeight: 600 };
+const w = createWorld(layer);
+w.firePlayer(); w.firePlayer();
+assert.equal(w.pBullets.filter(b => b.active).length, 2);
+w.reset();
+assert.equal(w.pBullets.filter(b => b.active).length, 0);
+console.log('entities ok');
+```
+
+- [ ] **Step 2: Run test to verify it fails**
+
+Run: `node tests/entities.test.mjs`
+Expected: FAIL "Cannot find module '../js/entities.js'"
+
+- [ ] **Step 3: Write minimal implementation**
+
+`js/entities.js`:
+```js
+function makeDiv(layer, cls, w, h, color) {
+  const el = typeof document !== 'undefined' ? document.createElement('div') : { style: {} };
+  el.className = 'ent ' + cls;
+  el.style.width = w + 'px'; el.style.height = h + 'px'; el.style.background = color;
+  el.style.display = 'none';
+  layer.appendChild?.(el);
+  return el;
+}
+function makePool(layer, cls, n, w, h, color) {
+  const arr = [];
+  for (let i = 0; i < n; i++) arr.push({ el: makeDiv(layer, cls, w, h, color), x: 0, y: 0, vx: 0, vy: 0, w, h, active: false, kind: cls });
+  return arr;
+}
+export function createWorld(layer) {
+  const player = { el: makeDiv(layer, 'player', 28, 20, '#4df3ff'), x: 386, y: 540, vx: 0, vy: 0, w: 28, h: 20, active: true, kind: 'player', invuln: 0 };
+  const enemies = makePool(layer, 'enemy', 12, 30, 22, '#ff4d6d');
+  const pBullets = makePool(layer, 'pb', 30, 4, 12, '#ffe14d');
+  const eBullets = makePool(layer, 'eb', 80, 7, 7, '#ff8b3d');
+  function get(pool) { return pool.find(e => !e.active); }
+  return {
+    player, enemies, pBullets, eBullets,
+    spawnEnemy(type, x) {
+      const e = get(enemies); if (!e) return null;
+      e.active = true; e.kind = type; e.x = x; e.y = -30; e.t = 0;
+      return e;
+    },
+    firePlayer() {
+      const b = get(pBullets); if (!b) return null;
+      b.active = true; b.x = player.x + player.w / 2 - 2; b.y = player.y - 12; b.vx = 0; b.vy = -600;
+      return b;
+    },
+    fireEnemy(x, y, vx, vy) {
+      const b = get(eBullets); if (!b) return null;
+      b.active = true; b.x = x; b.y = y; b.vx = vx; b.vy = vy;
+      return b;
+    },
+    reset() {
+      for (const p of [...enemies, ...pBullets, ...eBullets]) p.active = false;
+      player.x = 386; player.y = 540; player.invuln = 0; player.active = true;
+    },
+  };
+}
+```
+
+Append to `style.css`:
+```css
+.player{border-radius:6px}
+.enemy{border-radius:4px}
+.pb{border-radius:2px}
+.eb{border-radius:50%}
+```
+
+- [ ] **Step 4: Run test to verify it passes**
+
+Run: `node tests/entities.test.mjs`
+Expected: PASS `entities ok`
+
+- [ ] **Step 5: Commit**
+
+```bash
+git add js/entities.js style.css tests/entities.test.mjs
+git commit -m "feat: add pooled entities world"
+```
+
+---
+
+### Task 4: Physics — fixed step, move, collide
+
+**Files:**
+- Create: `js/physics.js`
+- Test: `tests/physics.test.mjs`
+
+**Interfaces:**
+- Consumes: `createWorld` shape from Task 3, `input.isDown`
+- Produces: `step(world, input, dt, api)` where `dt` seconds, `api = { onKill(), onHit(), fireCd }`. Mutates positions, handles bounds (800x600), player-enemy-bullet AABB. Export `aabb(a,b)` and `STEP = 1/120`.
+
+- [ ] **Step 1: Write the failing test**
+
+`tests/physics.test.mjs`:
+```js
+import assert from 'node:assert';
+import { aabb, STEP } from '../js/physics.js';
+assert.equal(STEP, 1/120);
+assert.ok(aabb({x:0,y:0,w:10,h:10},{x:5,y:5,w:10,h:10}));
+assert.ok(!aabb({x:0,y:0,w:10,h:10},{x:20,y:20,w:10,h:10}));
+console.log('physics ok');
+```
+
+- [ ] **Step 2: Run test to verify it fails**
+
+Run: `node tests/physics.test.mjs`
+Expected: FAIL "Cannot find module '../js/physics.js'"
+
+- [ ] **Step 3: Write minimal implementation**
+
+`js/physics.js`:
+```js
+export const STEP = 1 / 120;
+export const W = 800, H = 600;
+export function aabb(a, b) {
+  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
+}
+const DIRS = [['ArrowLeft','KeyA',-1,0],['ArrowRight','KeyD',1,0],['ArrowUp','KeyW',0,-1],['ArrowDown','KeyS',0,1]];
+export function step(world, input, dt, api) {
+  const p = world.player;
+  let dx = 0, dy = 0;
+  for (const [c1, c2, x, y] of DIRS) if (input.isDown(c1) || input.isDown(c2)) { dx += x; dy += y; }
+  if (dx && dy) { dx *= Math.SQRT1_2; dy *= Math.SQRT1_2; }
+  p.x = Math.min(W - p.w, Math.max(0, p.x + dx * 320 * dt));
+  p.y = Math.min(H - p.h, Math.max(0, p.y + dy * 320 * dt));
+  if (p.invuln > 0) p.invuln -= dt;
+  api.fireCd -= dt;
+  if ((input.isDown('Space')) && api.fireCd <= 0) { world.firePlayer(); api.fireCd = 0.125; }
+  for (const e of world.enemies) {
+    if (!e.active) continue;
+    e.t += dt;
+    if (e.kind === 'weaver') { e.x += Math.sin(e.t * 3) * 120 * dt; e.y += 60 * dt; }
+    else if (e.kind === 'diver') { e.y += 160 * dt; }
+    else { e.y += 45 * dt; }
+    if (e.y > H + 40) e.active = false;
+  }
+  for (const b of world.pBullets) {
+    if (!b.active) continue;
+    b.x += b.vx * dt; b.y += b.vy * dt;
+    if (b.y < -20) b.active = false;
+  }
+  for (const b of world.eBullets) {
+    if (!b.active) continue;
+    b.x += b.vx * dt; b.y += b.vy * dt;
+    if (b.y > H + 20 || b.x < -20 || b.x > W + 20) b.active = false;
+  }
+  for (const b of world.pBullets) {
+    if (!b.active) continue;
+    for (const e of world.enemies) {
+      if (e.active && aabb(b, e)) { b.active = false; e.active = false; api.onKill(e); break; }
+    }
+  }
+  if (p.invuln <= 0) {
+    const hitbox = { x: p.x + 9, y: p.y + 5, w: 10, h: 10 };
+    for (const b of world.eBullets) {
+      if (b.active && aabb(hitbox, b)) { b.active = false; api.onHit(); break; }
+    }
+    if (p.active) for (const e of world.enemies) {
+      if (e.active && aabb(hitbox, e)) { e.active = false; api.onHit(); break; }
+    }
+  }
+}
+```
+
+- [ ] **Step 4: Run test to verify it passes**
+
+Run: `node tests/physics.test.mjs`
+Expected: PASS `physics ok`
+
+- [ ] **Step 5: Commit**
+
+```bash
+git add js/physics.js tests/physics.test.mjs
+git commit -m "feat: add fixed-step physics and collisions"
+```
+
+---
+
+### Task 5: Main loop — states, spawner, render, FPS
+
+**Files:**
+- Create: `js/main.js`
+- Create: `js/ui.js`
+- Test: manual + `node --check`
+
+**Interfaces:**
+- Consumes: `createInput`, `createWorld`, `step/STEP` from Tasks 2–4
+- Produces: working game; `ui.js` exports `bindUI(els, game)` used by main. Game object: `{ state, score, lives, timeLeft, combo }`.
+
+- [ ] **Step 1: Write the failing check**
+
+Run: `node --check js/main.js`
+Expected: FAIL "Cannot open js/main.js"
+
+- [ ] **Step 2: Run check to verify it fails**
+
+Run: `node --check js/main.js`
+Expected: FAIL
+
+- [ ] **Step 3: Write minimal implementation**
+
+`js/ui.js`:
+```js
+export function bindUI(els, game) {
+  const t = els.timer, s = els.score, l = els.lives, f = els.fps;
+  let acc = 0;
+  return {
+    frame(dt) {
+      acc += dt;
+      if (acc < 0.25) return;
+      acc = 0;
+      t.textContent = game.timeLeft.toFixed(1);
+      s.textContent = String(game.score);
+      l.textContent = String(game.lives);
+    },
+    fps(text) { f.textContent = text; },
+    show(id) {
+      for (const k of ['menu','pause-menu','gameover'])
+        document.getElementById(k).classList.toggle('hidden', k !== id);
+      if (!id) for (const k of ['menu','pause-menu','gameover']) document.getElementById(k).classList.add('hidden');
+    },
+    gameover(win) {
+      document.getElementById('gameover-title').textContent = win ? 'YOU WIN' : 'GAME OVER';
+      document.getElementById('gameover-stats').textContent = `Score ${game.score} · Time ${game.elapsed.toFixed(1)}s`;
+    },
+  };
+}
+```
+
+`js/main.js`:
+```js
+import { createInput } from './input.js';
+import { createWorld } from './entities.js';
+import { step, STEP } from './physics.js';
+import { bindUI } from './ui.js';
+
+const layer = document.getElementById('game-layer');
+const world = createWorld(layer);
+const input = createInput();
+input.attach();
+const game = { state: 'menu', score: 0, lives: 3, timeLeft: 90, elapsed: 0, combo: 1, comboT: 0 };
+const ui = bindUI({ timer: hud('hud-timer'), score: hud('hud-score'), lives: hud('hud-lives'), fps: hud('hud-fps') }, game);
+function hud(id) { return document.getElementById(id); }
+
+const api = { fireCd: 0,
+  onKill() { game.score += 100 * game.combo; },
+  onHit() { game.lives -= 1; world.player.invuln = 1.5; game.combo = 1; if (game.lives <= 0) end(false); },
+};
+let spawnT = 0, wave = 0, last = performance.now(), acc = 0;
+let fpsFrames = 0, fpsT = 0, fpsText = '-- fps';
+
+function reset() {
+  world.reset();
+  game.score = 0; game.lives = 3; game.timeLeft = 90; game.elapsed = 0; game.combo = 1; game.comboT = 0;
+  api.fireCd = 0; spawnT = 0; wave = 0; acc = 0;
+}
+function start() { reset(); game.state = 'playing'; ui.show(null); }
+function togglePause() {
+  if (game.state === 'playing') { game.state = 'paused'; ui.show('pause-menu'); }
+  else if (game.state === 'paused') { game.state = 'playing'; ui.show(null); last = performance.now(); }
+}
+function end(win) { game.state = win ? 'win' : 'gameover'; ui.gameover(win); ui.show('gameover'); }
+input.onPause = togglePause;
+input.onConfirm = () => { if (game.state === 'menu' || game.state === 'gameover' || game.state === 'win') start(); };
+document.getElementById('btn-start').onclick = start;
+document.getElementById('btn-continue').onclick = togglePause;
+document.getElementById('btn-restart-pause').onclick = start;
+document.getElementById('btn-restart-over').onclick = start;
+document.addEventListener('visibilitychange', () => { if (document.hidden && game.state === 'playing') togglePause(); });
+window.addEventListener('blur', () => { if (game.state === 'playing') togglePause(); });
+
+function spawner(dt) {
+  spawnT -= dt;
+  if (spawnT > 0) return;
+  spawnT = Math.max(1.2, 4 - wave * 0.15);
+  wave++;
+  const kinds = ['weaver', 'diver', 'gunner'];
+  for (let i = 0; i < Math.min(2 + (wave >> 2), 5); i++) {
+    const e = world.spawnEnemy(kinds[(wave + i) % 3], 60 + Math.random() * 620);
+    if (e && e.kind === 'gunner') {
+      const dx = (world.player.x - e.x) * 0.4, sp = 150 + wave * 4;
+      world.fireEnemy(e.x + 11, e.y + 22, dx, sp);
+    } else if (e) {
+      world.fireEnemy(e.x + 11, e.y + 22, (Math.random() - 0.5) * 80, 140 + wave * 3);
+    }
+  }
+}
+
+function render() {
+  const p = world.player;
+  p.el.style.display = 'block';
+  p.el.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
+  p.el.style.opacity = p.invuln > 0 && (performance.now() / 150 | 0) % 2 ? '0.25' : '1';
+  for (const arr of [world.enemies, world.pBullets, world.eBullets]) {
+    for (const e of arr) {
+      if (!e.active) { if (e.el.style.display !== 'none') e.el.style.display = 'none'; continue; }
+      if (e.el.style.display !== 'block') e.el.style.display = 'block';
+      e.el.style.transform = `translate3d(${e.x}px,${e.y}px,0)`;
+    }
+  }
+}
+
+function loop(now) {
+  requestAnimationFrame(loop);
+  let raw = (now - last) / 1000;
+  last = now;
+  fpsFrames++; fpsT += raw;
+  if (fpsT >= 0.5) { fpsText = `${Math.round(fpsFrames / fpsT)} fps`; ui.fps(fpsText); fpsFrames = 0; fpsT = 0; }
+  if (game.state !== 'playing') return;
+  if (raw > 0.033) raw = 0.033;
+  if (raw < 0) raw = 0;
+  acc += raw;
+  let n = 0;
+  while (acc >= STEP && n < 5) { spawner(STEP); step(world, input, STEP, api); game.timeLeft -= STEP; game.elapsed += STEP; game.comboT += STEP; if (game.comboT > 8) { game.comboT = 0; game.combo = Math.min(5, game.combo + 1); } acc -= STEP; n++; }
+  if (game.timeLeft <= 0) { game.timeLeft = 0; end(true); }
+  game.score += raw * 10;
+  render();
+  ui.frame(raw);
+}
+ui.show('menu');
+requestAnimationFrame((t) => { last = t; requestAnimationFrame(loop); });
+```
+
+- [ ] **Step 4: Run checks to verify it passes**
+
+Run: `node --check js/main.js && node --check js/ui.js && echo ok`
+Expected: PASS `ok`. Then open `index.html`: Enter starts, arrows move smoothly on hold, Space fires, P pauses with Continue/Restart, HUD counts down from 90, FPS shows ~60 (or ~165 on 165Hz).
+
+- [ ] **Step 5: Commit**
+
+```bash
+git add js/main.js js/ui.js
+git commit -m "feat: add main loop with states spawner render and FPS"
+```
+
+---
+
+### Task 6: Perf pass + audit verification
+
+**Files:**
+- Modify: any hot path found
+- Test: DevTools Performance recording
+
+**Interfaces:**
+- Consumes: full game
+- Produces: 60+ FPS sustained, no layout thrash
+
+- [ ] **Step 1: Write the failing check**
+
+Run: open DevTools Performance, record 30s of heavy play, check FPS graph + long tasks.
+Expected before pass: possible GC churn if `display` toggling per frame or string allocs — fix if seen.
+
+- [ ] **Step 2: Apply perf guards (already in plan, verify)**
+
+```js
+// render() skips style writes when hidden; text HUD throttled to 4Hz (ui.frame);
+// physics uses no allocation (reused pools, no array spreads in loop except reset);
+// transform-only movement; bounds cached constants W/H.
+```
+
+- [ ] **Step 3: Verify it passes**
+
+Run: 30s profile → FPS avg >= 60 (reads ~165 on 165Hz), zero dropped-frame gaps on pause/resume, paint flashing shows only game-layer rects.
+Expected: PASS
+
+- [ ] **Step 4: Commit**
+
+```bash
+git add -A
+git commit -m "perf: verify 60fps and pause stability" || echo "nothing to commit"
+```
+
+## Self-Review
+
+- Spec coverage: shell/HUD/overlays (T1), input smoothness (T2), pools (T3), fixed-step+AABB+hitbox (T4), states/spawner/render/FPS/timer/score/lives/pause/restart/165Hz (T5), perf audit (T6). All covered.
+- No placeholders: exact paths, full code, exact commands.
+- Type consistency: `createInput().isDown`, `createWorld(layer).player/enemies/pBullets/eBullets/spawnEnemy/firePlayer/fireEnemy/reset`, `step(world,input,dt,api)`, `STEP=1/120`, `bindUI(els,game)` — same names across tasks.
diff --git a/js/entities.js b/js/entities.js
index 522a85d..ad20ca9 100644
--- a/js/entities.js
+++ b/js/entities.js
@@ -28,15 +28,17 @@ export function createWorld(layer) {
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
-      for (const p of [...enemies, ...pBullets, ...eBullets]) p.active = false;
+      for (const e of enemies) e.active = false;
+      for (const b of pBullets) b.active = false;
+      for (const b of eBullets) b.active = false;
       player.x = 386; player.y = 540; player.invuln = 0; player.active = true;
     },
   };
 }
diff --git a/js/physics.js b/js/physics.js
index 8507000..0333b77 100644
--- a/js/physics.js
+++ b/js/physics.js
@@ -1,16 +1,17 @@
 export const STEP = 1 / 120;
 export const W = 800, H = 600;
 export function aabb(a, b) {
   return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
 }
 const DIRS = [['ArrowLeft','KeyA',-1,0],['ArrowRight','KeyD',1,0],['ArrowUp','KeyW',0,-1],['ArrowDown','KeyS',0,1]];
+const HITBOX = { x: 0, y: 0, w: 10, h: 10 };
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
@@ -32,19 +33,19 @@ export function step(world, input, dt, api) {
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
-    const hitbox = { x: p.x + 9, y: p.y + 5, w: 10, h: 10 };
+    HITBOX.x = p.x + 9; HITBOX.y = p.y + 5;
     for (const b of world.eBullets) {
-      if (b.active && aabb(hitbox, b)) { b.active = false; api.onHit(); break; }
+      if (b.active && aabb(HITBOX, b)) { b.active = false; api.onHit(); break; }
     }
     if (p.active) for (const e of world.enemies) {
-      if (e.active && aabb(hitbox, e)) { e.active = false; api.onHit(); break; }
+      if (e.active && aabb(HITBOX, e)) { e.active = false; api.onHit(); break; }
     }
   }
 }
diff --git a/js/ui.js b/js/ui.js
index 3e468a5..014be64 100644
--- a/js/ui.js
+++ b/js/ui.js
@@ -1,24 +1,24 @@
 export function bindUI(els, game) {
   const t = els.timer, s = els.score, l = els.lives, f = els.fps;
   let acc = 0;
   return {
     frame(dt) {
       acc += dt;
       if (acc < 0.25) return;
       acc = 0;
       t.textContent = game.timeLeft.toFixed(1);
-      s.textContent = String(game.score);
+      s.textContent = String(Math.floor(game.score));
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
-      document.getElementById('gameover-stats').textContent = `Score ${game.score} · Time ${game.elapsed.toFixed(1)}s`;
+      document.getElementById('gameover-stats').textContent = `Score ${Math.floor(game.score)} · Time ${game.elapsed.toFixed(1)}s`;
     },
   };
 }
