diff --git a/index.html b/index.html
new file mode 100644
index 0000000..9241916
--- /dev/null
+++ b/index.html
@@ -0,0 +1,38 @@
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
diff --git a/style.css b/style.css
new file mode 100644
index 0000000..9bb7e0f
--- /dev/null
+++ b/style.css
@@ -0,0 +1,10 @@
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
