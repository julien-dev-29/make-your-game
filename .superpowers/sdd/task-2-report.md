# Task 2 Report — Input: smooth keyboard Set

## Implementation
- Created `js/input.js` verbatim from plan: `createInput()` returns `{ keys, onPause, onConfirm, isDown, attach, detach, _kd, _ku }`.
- `kd` preventDefaults arrows/Space, ignores `e.repeat`, adds to Set; `KeyP`/`Escape` → `onPause`, `Enter`/`Space` → `onConfirm`; `ku` deletes; `blur` clears.
- `attach`/`detach` guard on `typeof window` — node-testable, no DOM dependency.
- Created `tests/input.test.mjs` verbatim from plan (full version with `window` shim, repeat-dedup assert, `keys.size === 1`).

## Tests + TDD evidence
- RED (before `js/input.js` existed):
  - Cmd: `node tests/input.test.mjs`
  - Output: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../js/input.js'`, EXIT 1. ✅ expected FAIL
- GREEN (after implementation):
  - Cmd: `node tests/input.test.mjs`
  - Output: `input ok`, EXIT 0. ✅ PASS
- Extra sanity check: Space keydown/keyup cycle works; `attach()`/`detach()` no-throw under node shim.

## Files changed
- `js/input.js` (new)
- `tests/input.test.mjs` (new)

## Self-review
- Matches plan verbatim; interface `{ keys, isDown, attach, detach, _kd, _ku }` as specified; no DOM at import time.

## Fix (2026-09-19) — settable callbacks via getters
- Root cause: `return { ...st }` spread copied nulls; `kd` reads `st.*` so `input.onPause = fn` never fired.
- Fix: replaced spread with `get/set onPause/onConfirm` closing over `st`; added `_blur` exposure. All other behavior identical.
- Tests: extended `tests/input.test.mjs` — onPause fires (KeyP/Escape), onConfirm fires (Enter/Space), Space preventDefault called, `_blur()` clears keys. Kept existing asserts.
- Verify: `node tests/input.test.mjs` → `input ok`, EXIT 0 ✅; Task 1 shell check → `shell ok`, EXIT 0 ✅ (no regression).
- Commit: `b8cb4e6 fix: make input callbacks settable via getters` (js/input.js, tests/input.test.mjs).

## Concerns (resolved by fix above)
- **Load-bearing bug in plan code (kept verbatim per instructions):** `return { keys, ...st, ... }` spread-copies `onPause`/`onConfirm`, so later `input.onPause = fn` sets a property on the returned object but `kd` reads `st.onPause` (still `null`). Verified: assigning `onPause` then `_kd({code:'KeyP'})` does NOT fire it. **Task 5 (`input.onPause = togglePause`) will silently break** unless fixed — recommend Task 5 worker expose `onPause`/`onConfirm` via getter/setter closing over `st`, or return `st` by reference.
