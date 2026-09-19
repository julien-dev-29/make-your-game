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
