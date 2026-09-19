import assert from 'node:assert';
import { aabb, STEP } from '../js/physics.js';
assert.equal(STEP, 1/120);
assert.ok(aabb({x:0,y:0,w:10,h:10},{x:5,y:5,w:10,h:10}));
assert.ok(!aabb({x:0,y:0,w:10,h:10},{x:20,y:20,w:10,h:10}));
console.log('physics ok');
