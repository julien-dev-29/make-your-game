diff --git a/gungeon/js/main.js b/gungeon/js/main.js
new file mode 100644
index 0000000..7545873
--- /dev/null
+++ b/gungeon/js/main.js
@@ -0,0 +1,95 @@
+import { createInput } from './input.js';
+import { createWorld } from './entities.js';
+import { createRoom } from './room.js';
+import { step, STEP } from './physics.js';
+import { bindUI } from './ui.js';
+
+const layer = document.getElementById('game-layer');
+const world = createWorld(layer);
+const room = createRoom(world);
+const input = createInput();
+input.attach();
+const game = { state: 'menu', score: 0, hp: 3, wave: 0, elapsed: 0, rollCd: 0 };
+const ui = bindUI({
+  hearts: document.getElementById('hud-hearts'),
+  wave: document.getElementById('hud-wave'),
+  score: document.getElementById('hud-score'),
+  time: document.getElementById('hud-time'),
+  fps: document.getElementById('hud-fps'),
+  roll: document.getElementById('hud-roll'),
+}, game);
+
+const api = {
+  fireCd: 0,
+  onKill() { game.score += 100; },
+  onHit() {
+    if (game.hp <= 0 || world.player.invuln > 0) return;
+    game.hp -= 1; world.player.hp = game.hp; world.player.invuln = 1.0;
+    if (game.hp <= 0) end(false);
+  },
+};
+let last = performance.now(), acc = 0, fpsF = 0, fpsT = 0;
+
+function reset() {
+  world.reset(); room.reset();
+  game.score = 0; game.hp = 3; game.wave = 0; game.elapsed = 0; game.rollCd = 0;
+  api.fireCd = 0; acc = 0;
+}
+function start() { reset(); game.state = 'playing'; ui.show(null); }
+function togglePause() {
+  if (game.state === 'playing') { game.state = 'paused'; ui.show('pause-menu'); }
+  else if (game.state === 'paused') { game.state = 'playing'; ui.show(null); last = performance.now(); }
+}
+function end(win) { game.state = win ? 'win' : 'gameover'; ui.gameover(win); ui.show('gameover'); }
+input.onPause = togglePause;
+input.onConfirm = () => { if (game.state !== 'playing' && game.state !== 'paused') start(); };
+document.getElementById('btn-start').onclick = start;
+document.getElementById('btn-continue').onclick = togglePause;
+document.getElementById('btn-restart-pause').onclick = start;
+document.getElementById('btn-restart-over').onclick = start;
+document.addEventListener('visibilitychange', () => { if (document.hidden && game.state === 'playing') togglePause(); });
+window.addEventListener('blur', () => { if (game.state === 'playing') togglePause(); });
+
+const POOLS = [world.enemies, world.pBullets, world.eBullets];
+function render() {
+  const p = world.player;
+  p.el.style.display = 'block';
+  p.el.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
+  p.el.style.opacity = (p.rollT > 0 || p.invuln > 0) && ((performance.now() / 120 | 0) % 2) ? '0.4' : '1';
+  for (const arr of POOLS) {
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
+  fpsF++; fpsT += raw;
+  if (fpsT >= 0.5) { ui.fps(`${Math.round(fpsF / fpsT)} fps`); fpsF = 0; fpsT = 0; }
+  if (game.state !== 'playing') return;
+  if (raw > 0.033) raw = 0.033;
+  if (raw < 0) raw = 0;
+  acc += raw;
+  let n = 0;
+  while (acc >= STEP && n < 5) {
+    const st = room.update(STEP);
+    step(world, input, STEP, api);
+    game.elapsed += STEP;
+    game.wave = room.wave;
+    game.hp = world.player.hp;
+    game.rollCd = Math.max(0, world.player.rollCd);
+    game.score += STEP * 10;
+    if (st === 'cleared') { end(true); break; }
+    if (game.state !== 'playing') break;
+    acc -= STEP; n++;
+  }
+  render();
+  ui.frame(raw);
+}
+ui.show('menu');
+requestAnimationFrame((t) => { last = t; requestAnimationFrame(loop); });
diff --git a/gungeon/js/ui.js b/gungeon/js/ui.js
new file mode 100644
index 0000000..1983549
--- /dev/null
+++ b/gungeon/js/ui.js
@@ -0,0 +1,25 @@
+export function bindUI(els, game) {
+  let acc = 0;
+  return {
+    frame(dt) {
+      acc += dt;
+      if (acc < 0.25) return;
+      acc = 0;
+      els.hearts.textContent = String(Math.max(0, game.hp));
+      els.wave.textContent = `${Math.min(game.wave + 1, 3)}/3`;
+      els.score.textContent = String(Math.floor(game.score));
+      els.time.textContent = game.elapsed.toFixed(1);
+      els.roll.textContent = game.rollCd > 0 ? `roll ${game.rollCd.toFixed(1)}s` : 'roll ready';
+    },
+    fps(t) { els.fps.textContent = t; },
+    show(id) {
+      for (const k of ['menu', 'pause-menu', 'gameover'])
+        document.getElementById(k).classList.toggle('hidden', k !== id);
+      if (!id) for (const k of ['menu', 'pause-menu', 'gameover']) document.getElementById(k).classList.add('hidden');
+    },
+    gameover(win) {
+      document.getElementById('gameover-title').textContent = win ? 'CHAMBER CLEAR' : 'GAME OVER';
+      document.getElementById('gameover-stats').textContent = `Score ${Math.floor(game.score)} · Time ${game.elapsed.toFixed(1)}s · Wave ${Math.min(game.wave + 1, 3)}/3`;
+    },
+  };
+}
