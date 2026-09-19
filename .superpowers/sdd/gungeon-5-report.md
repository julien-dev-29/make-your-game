# G5 Report — Physics (move, roll, walls, collisions)

## Status
Done — RED (missing module) then GREEN after implementation.

## Commit
`35438ac` — feat(gungeon): add top-down physics with dodge roll
Files: `gungeon/js/physics.js`, `gungeon/tests/physics.test.mjs` only.

## Tests
- `node gungeon/tests/physics.test.mjs` → `physics ok`
- Regressions: input ok, entities ok, room ok → ALL-OK

## Spec compliance
STEP=1/120, W=800 H=600, aabb export, step(world,input,dt,api). Move 260 px/s AZERTY+QWERTY, roll Shift 520/0.35s/i-frames/cd 0.9, wall min-penetration push-out, fire Space 6/s at 550 aim-or-face, blob 70 / shooter keep+140 1.6s / turret 3-branch 120 2.2s, bullet cull, shared HITBOX, hit gated by invuln+rollT.

## Concerns
- Node MODULE_TYPELESS_PACKAGE_JSON warnings only (pre-existing, harmless).
- Turret fire uses absolute time angle (e.t) per spec — not player-aimed by design.
