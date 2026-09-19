diff --git a/js/input.js b/js/input.js
new file mode 100644
index 0000000..e27e064
--- /dev/null
+++ b/js/input.js
@@ -0,0 +1,36 @@
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
+    get onPause() { return st.onPause; },
+    set onPause(fn) { st.onPause = fn; },
+    get onConfirm() { return st.onConfirm; },
+    set onConfirm(fn) { st.onConfirm = fn; },
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
+    _kd: kd, _ku: ku, _blur: blur,
+  };
+}
diff --git a/tests/input.test.mjs b/tests/input.test.mjs
new file mode 100644
index 0000000..ea504e7
--- /dev/null
+++ b/tests/input.test.mjs
@@ -0,0 +1,36 @@
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
+// onPause fires via _kd
+let pauseCount = 0;
+input.onPause = () => { pauseCount++; };
+input._kd({ code: 'KeyP', repeat: false, preventDefault(){} });
+assert.equal(pauseCount, 1);
+input._kd({ code: 'Escape', repeat: false, preventDefault(){} });
+assert.equal(pauseCount, 2);
+// onConfirm fires via _kd
+let confirmCount = 0;
+input.onConfirm = () => { confirmCount++; };
+input._kd({ code: 'Enter', repeat: false, preventDefault(){} });
+assert.equal(confirmCount, 1);
+input._kd({ code: 'Space', repeat: false, preventDefault(){} });
+assert.equal(confirmCount, 2);
+// preventDefault called for Space
+let pdCalled = false;
+input._ku({ code: 'Space' });
+input._kd({ code: 'Space', repeat: false, preventDefault(){ pdCalled = true; } });
+assert.ok(pdCalled);
+// blur clears keys
+input._kd({ code: 'ArrowRight', repeat: false, preventDefault(){} });
+assert.ok(input.isDown('ArrowRight'));
+input._blur();
+assert.ok(!input.isDown('ArrowRight'));
+assert.equal(input.keys.size, 0);
+console.log('input ok');
