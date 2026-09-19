diff --git a/js/entities.js b/js/entities.js
new file mode 100644
index 0000000..522a85d
--- /dev/null
+++ b/js/entities.js
@@ -0,0 +1,42 @@
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
diff --git a/style.css b/style.css
index 9bb7e0f..87de5e2 100644
--- a/style.css
+++ b/style.css
@@ -1,10 +1,14 @@
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
+.player{border-radius:6px}
+.enemy{border-radius:4px}
+.pb{border-radius:2px}
+.eb{border-radius:50%}
diff --git a/tests/entities.test.mjs b/tests/entities.test.mjs
new file mode 100644
index 0000000..b4e6085
--- /dev/null
+++ b/tests/entities.test.mjs
@@ -0,0 +1,9 @@
+import assert from 'node:assert';
+import { createWorld } from '../js/entities.js';
+const layer = { appendChild(){}, clientWidth: 800, clientHeight: 600 };
+const w = createWorld(layer);
+w.firePlayer(); w.firePlayer();
+assert.equal(w.pBullets.filter(b => b.active).length, 2);
+w.reset();
+assert.equal(w.pBullets.filter(b => b.active).length, 0);
+console.log('entities ok');
