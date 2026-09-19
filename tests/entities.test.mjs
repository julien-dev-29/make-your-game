import assert from 'node:assert';
import { createWorld } from '../js/entities.js';
const layer = { appendChild(){}, clientWidth: 800, clientHeight: 600 };
const w = createWorld(layer);
w.firePlayer(); w.firePlayer();
assert.equal(w.pBullets.filter(b => b.active).length, 2);
w.reset();
assert.equal(w.pBullets.filter(b => b.active).length, 0);
console.log('entities ok');
