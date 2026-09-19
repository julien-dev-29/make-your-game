import assert from 'node:assert';
import { aabb, STEP, step } from '../js/physics.js';
import { createWorld } from '../js/entities.js';
assert.equal(STEP, 1 / 120);
assert.ok(aabb({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 }));
const world = createWorld({ appendChild(){} });
const input = { isDown: (c) => c === 'KeyD', aimDir: () => ({ x: 0, y: 0 }) };
const api = { fireCd: 0, onKill() {}, onHit() {} };
const x0 = world.player.x;
step(world, input, STEP, api);
assert.ok(world.player.x > x0);
console.log('physics ok');
import { parseMap, MAPS } from '../js/tiles.js';
world.tilemap = parseMap(MAPS[1]);
// wall column: Piliers row 5 has '#' at col 3..6; place player left of it
world.player.x = 2 * 32; world.player.y = 5 * 32 + 4;
const bx = world.player.x;
for (let i = 0; i < 30; i++) step(world, input, STEP, api);
assert.ok(world.player.x <= 3 * 32 - world.player.w + 3, 'wall blocks player');
// bullet culled by wall
world.tilemap = parseMap(MAPS[1]);
const b = world.firePlayer(1, 0);
b.x = 2 * 32; b.y = 5 * 32 + 2;
for (let i = 0; i < 30; i++) step(world, { isDown: () => false, aimDir: () => ({ x: 0, y: 0 }) }, STEP, { fireCd: 1, onKill(){}, onHit(){} });
assert.ok(!b.active, 'bullet dies on wall');
console.log('physics-grid ok');
