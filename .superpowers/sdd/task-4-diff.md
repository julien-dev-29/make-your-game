diff --git a/js/physics.js b/js/physics.js
new file mode 100644
index 0000000..8507000
--- /dev/null
+++ b/js/physics.js
@@ -0,0 +1,50 @@
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
diff --git a/tests/physics.test.mjs b/tests/physics.test.mjs
new file mode 100644
index 0000000..db8e759
--- /dev/null
+++ b/tests/physics.test.mjs
@@ -0,0 +1,6 @@
+import assert from 'node:assert';
+import { aabb, STEP } from '../js/physics.js';
+assert.equal(STEP, 1/120);
+assert.ok(aabb({x:0,y:0,w:10,h:10},{x:5,y:5,w:10,h:10}));
+assert.ok(!aabb({x:0,y:0,w:10,h:10},{x:20,y:20,w:10,h:10}));
+console.log('physics ok');
