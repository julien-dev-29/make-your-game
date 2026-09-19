diff --git a/js/main.js b/js/main.js
new file mode 100644
index 0000000..97b4d7d
--- /dev/null
+++ b/js/main.js
@@ -0,0 +1,90 @@
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
+  onHit() { if (game.lives <= 0 || world.player.invuln > 0) return; game.lives -= 1; world.player.invuln = 1.5; game.combo = 1; if (game.lives <= 0) end(false); },
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
diff --git a/js/ui.js b/js/ui.js
new file mode 100644
index 0000000..3e468a5
--- /dev/null
+++ b/js/ui.js
@@ -0,0 +1,24 @@
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
