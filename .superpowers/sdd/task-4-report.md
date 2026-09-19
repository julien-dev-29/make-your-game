# Task 4 Review — Physics (fixed step, move, collide)

**Verdict: PASS — spec-compliant, ready to proceed to Task 5. No blocking issues; 1 minor perf nit, 3 minor notes.**

Reviewed: `js/physics.js` (50 lines) + `tests/physics.test.mjs` (6 lines), commit `8b5faf6` vs base `118b542`.
Method: read-only. Plan spec (Task 4, `docs/superpowers/plans/2026-09-19-bullet-hell.md` lines 325–418) compared line-by-line
against implementation; `node tests/physics.test.mjs` → `physics ok`; `node --check js/physics.js` clean;
18-case functional harness (movement, normalize, fire rate, enemy rates, culling, collisions, hitbox, invuln) — all passed.

### Spec Compliance

| Requirement | Status | Evidence |
|---|---|---|
| `STEP = 1/120` export | ✅ | `js/physics.js:1`, test asserts `STEP == 1/120` |
| `dt` in seconds, speeds in px/s | ✅ | All motion `* dt`: player 320, weaver 120/60, diver 160, gunner 45, bullets `v*dt` |
| `aabb(a,b)` export, strict-overlap semantics | ✅ | `js/physics.js:3-5`, byte-identical to spec |
| `step(world, input, dt, api)` signature, `api = { onKill, onHit, fireCd }` | ✅ | `js/physics.js:7`, consumes Task 3 `createWorld` shape + `input.isDown` |
| `DIRS` arrows + WASD mapping | ✅ | `js/physics.js:6` — ArrowLeft/KeyA, ArrowRight/KeyD, ArrowUp/KeyW, ArrowDown/KeyS |
| Diagonal normalize `SQRT1_2` | ✅ | `js/physics.js:11`; verified numerically: diagonal magnitude == cardinal (320.0000) |
| Fire rate 8/s (`fireCd = 0.125`) | ✅ | `js/physics.js:16`; verified: fires once, cooldown blocks second shot within window |
| Weaver: `sin(t*3)*120*dt` x, `60*dt` y | ✅ | `js/physics.js:20`; verified rate + sinusoid displacement |
| Diver: `160*dt` y | ✅ | Verified exactly `160*STEP` per step |
| Gunner (else branch): `45*dt` y | ✅ | Verified exactly `45*STEP` per step |
| Bounds 800x600, player clamp, enemy cull `y > H+40` | ✅ | `W/H` exports; clamp `[0, W-p.w]`/`[0, H-p.h]` verified at both edges |
| Bullet culling (p: `y<-20`; e: `y>H+20 \|\| x<-20 \|\| x>W+20`) | ✅ | Verified deactivation for both pools |
| pBullet→enemy calls `onKill(e)`, deactivates both, `break` | ✅ | Verified `kills===1`, both inactive |
| eBullet→player and enemy→player call `onHit()`, `break` | ✅ | Verified `hits===1`, bullet/enemy deactivated |
| Invuln: decrement by `dt`, skip player-hit checks while `> 0` | ✅ | Verified decrement `1.0 → 1.0-STEP` and hit blocked at `invuln=1.0` |
| Small player hitbox 10px (`x+9, y+5, 10x10`) | ✅ | Byte-identical to spec; verified grazing corner shot (full 28x20 body overlap, outside inset) misses while centered shot hits |
| No alloc in loop | ⚠️ | One nit — see Issues #1 |

### Strengths

- **Byte-faithful to spec.** Implementation lines 1–50 match the plan's reference code exactly; zero drift from the reviewed design.
- **Correct fixed-step math.** Every velocity is `dt`-scaled px/s; 120 Hz stepping preserves game speed across 60/120/165 Hz displays per global constraint.
- **Hitbox done right.** 10x10 inset on a 28x20 sprite gives fair bullet-hell grazing; verified empirically, not just by reading.
- **Cooldown gating correct.** `fireCd -= dt` unconditionally, fire only on `Space && fireCd <= 0`, reset to `0.125` — hold-to-fire at exactly 8/s.
- **Collision termination.** `break` after first kill/hit per bullet keeps one bullet from multi-killing and bounds inner-loop cost.
- **Clean interfaces.** Consumes only `world.player/enemies/pBullets/eBullets/spawnEnemy/firePlayer/fireEnemy` and `input.isDown` — no coupling to DOM or render.

### Issues

1. **Minor (perf): per-step `hitbox` allocation violates "no alloc in loop".** `js/physics.js:42` creates
   `{ x: p.x + 9, y: p.y + 5, w: 10, h: 10 }` on every `step()` while vulnerable — 120 small objects/s of GC churn.
   Task 6 explicitly requires "no allocation (reused pools…)". Fix (one line, suggested for Task 5/6, not blocking):
   hoist to module scope, e.g. `const HITBOX = { x:0, y:0, w:10, h:10 };` and mutate fields per step.
   (The `for (const [c1,c2,x,y] of DIRS)` destructuring also touches the iterator protocol per step, but that is
   negligible and spec-prescribed — not flagged as a violation.)
2. **Minor (gameplay, inherited from spec): double-`onHit` possible in one step.** If an eBullet and an enemy both
   overlap the hitbox in the same `step()`, both `onHit()` calls fire: the `p.invuln <= 0` branch is entered once and
   never re-checked, even though the real `onHit` (main.js) sets `invuln = 1.5` on the first hit. Net effect: 2 lives
   lost in a single 1/120 s step. Spec reference code has the same structure, so compliant — but Task 5's `onHit`
   should ideally early-return if `player.invuln > 0`, or physics should re-guard before the enemy loop.
3. **Minor (consistency): `if (p.active)` guards the enemy-collision loop but not the eBullet loop** (`js/physics.js:43`
   vs `:46`). Harmless today (`player.active` is always `true`; nothing ever deactivates it), but the asymmetry will
   confuse future readers. Pick one guard for both.
4. **Minor (coverage): test file checks only `STEP` + `aabb`, not `step()`.** This matches the plan's prescribed test
   verbatim, so it is compliant — but movement, fire rate, collisions, and invuln have zero regression coverage.
   Recommend extending `tests/physics.test.mjs` with the behaviors verified ad-hoc in this review (all 18 passed).

### Assessment

**Ready to proceed to Task 5 (main loop).** Logic, numbers, interfaces, and edge behavior (clamps, culls, cooldown,
invuln, inset hitbox) all verified by execution, not just inspection. No Critical or Important issues.
Suggested follow-ups, none blocking: hoist `HITBOX` (Issue #1) and add an `invuln` re-guard (Issue #2) when Task 5
wires the real `api`; extend the physics test with `step()` cases (Issue #4). Diff file `task-4-diff.md` verified
byte-identical to `git diff 118b542..HEAD`.
