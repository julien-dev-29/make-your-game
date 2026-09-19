diff --git a/gungeon/index.html b/gungeon/index.html
new file mode 100644
index 0000000..3a1022d
--- /dev/null
+++ b/gungeon/index.html
@@ -0,0 +1,40 @@
+<!DOCTYPE html>
+<html lang="en">
+<head>
+<meta charset="utf-8">
+<meta name="viewport" content="width=device-width,initial-scale=1">
+<title>Gungeon Arena v1</title>
+<link rel="stylesheet" href="style.css">
+</head>
+<body>
+<div id="game">
+  <div id="game-layer"></div>
+  <div id="hud-layer">
+    <span id="hud-hearts">3</span>
+    <span id="hud-wave">-/-</span>
+    <span id="hud-score">0</span>
+    <span id="hud-time">0.0</span>
+    <span id="hud-fps">-- fps</span>
+    <span id="hud-roll">roll ready</span>
+  </div>
+  <div id="overlay-layer">
+    <div id="menu" class="overlay">
+      <h1>GUNGEON ARENA</h1>
+      <p>Move ZQSD/WASD · Aim Arrows · Fire Space · Roll Shift · Pause P/Esc</p>
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
diff --git a/gungeon/style.css b/gungeon/style.css
new file mode 100644
index 0000000..bfad204
--- /dev/null
+++ b/gungeon/style.css
@@ -0,0 +1,11 @@
+*{box-sizing:border-box;margin:0;padding:0}
+body{background:#0b0a12;color:#f2ecff;font-family:system-ui,sans-serif;display:flex;justify-content:center;padding:16px}
+#game{position:relative;width:800px;height:600px;background:#141222;overflow:hidden;border:1px solid #4a4480}
+#game-layer{position:absolute;inset:0;z-index:1}
+#hud-layer{position:absolute;top:0;left:0;right:0;z-index:2;display:flex;gap:14px;padding:8px 12px;font-variant-numeric:tabular-nums;pointer-events:none}
+#overlay-layer{position:absolute;inset:0;z-index:3;pointer-events:none}
+.overlay{position:absolute;inset:0;display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center;background:rgba(8,6,18,.85);pointer-events:auto}
+.hidden{display:none!important}
+button{padding:10px 18px;font-size:16px;cursor:pointer}
+.ent{position:absolute;top:0;left:0;will-change:transform}
+.wall{background:#3a3568!important}
