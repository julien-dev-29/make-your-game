diff --git a/gungeon/js/room.js b/gungeon/js/room.js
new file mode 100644
index 0000000..57f58b8
--- /dev/null
+++ b/gungeon/js/room.js
@@ -0,0 +1,36 @@
+const SIZES = [3, 5, 7];
+const KINDS = ['blob', 'shooter', 'turret'];
+export function createRoom(world) {
+  const room = { wave: 0, waveSizes: SIZES, spawned: 0, delay: 0 };
+  function freeSpot() {
+    for (let i = 0; i < 20; i++) {
+      const x = 60 + Math.random() * 660, y = 60 + Math.random() * 460;
+      const dx = x - world.player.x, dy = y - world.player.y;
+      if (dx * dx + dy * dy > 180 * 180) return { x, y };
+    }
+    return { x: 80, y: 80 };
+  }
+  return {
+    wave: 0, waveSizes: SIZES,
+    reset() { room.wave = 0; room.spawned = 0; room.delay = 0; this.wave = 0; },
+    isWaveCleared() {
+      return room.spawned >= SIZES[room.wave] && !world.enemies.some(e => e.active);
+    },
+    update(dt) {
+      this.wave = room.wave;
+      if (room.spawned < SIZES[room.wave]) {
+        room.delay -= dt;
+        if (room.delay <= 0) {
+          room.delay = 0.5;
+          const s = freeSpot();
+          world.spawnEnemy(KINDS[(room.spawned + room.wave) % 3], s.x, s.y);
+          room.spawned++;
+        }
+        return 'spawning';
+      }
+      if (world.enemies.some(e => e.active)) return 'fighting';
+      if (room.wave < SIZES.length - 1) { room.wave++; room.spawned = 0; room.delay = 1.0; this.wave = room.wave; return 'spawning'; }
+      return 'cleared';
+    },
+  };
+}
diff --git a/gungeon/tests/room.test.mjs b/gungeon/tests/room.test.mjs
new file mode 100644
index 0000000..4c5c17f
--- /dev/null
+++ b/gungeon/tests/room.test.mjs
@@ -0,0 +1,11 @@
+import assert from 'node:assert';
+import { createWorld } from '../js/entities.js';
+import { createRoom } from '../js/room.js';
+const world = createWorld({ appendChild(){} });
+const room = createRoom(world);
+assert.deepEqual(room.waveSizes, [3, 5, 7]);
+room.update(0.1);
+assert.ok(world.enemies.filter(e => e.active).length > 0);
+room.reset();
+assert.equal(room.wave, 0);
+console.log('room ok');
