import assert from 'node:assert';
import { createInput } from '../js/input.js';
globalThis.window ??= { addEventListener(){}, removeEventListener(){} };
const input = createInput();
input._kd({ code: 'ArrowLeft', repeat: false, preventDefault(){} });
input._kd({ code: 'ArrowLeft', repeat: true, preventDefault(){} });
assert.ok(input.isDown('ArrowLeft'));
assert.equal(input.keys.size, 1);
input._ku({ code: 'ArrowLeft' });
assert.ok(!input.isDown('ArrowLeft'));
// onPause fires via _kd
let pauseCount = 0;
input.onPause = () => { pauseCount++; };
input._kd({ code: 'KeyP', repeat: false, preventDefault(){} });
assert.equal(pauseCount, 1);
input._kd({ code: 'Escape', repeat: false, preventDefault(){} });
assert.equal(pauseCount, 2);
// onConfirm fires via _kd
let confirmCount = 0;
input.onConfirm = () => { confirmCount++; };
input._kd({ code: 'Enter', repeat: false, preventDefault(){} });
assert.equal(confirmCount, 1);
input._kd({ code: 'Space', repeat: false, preventDefault(){} });
assert.equal(confirmCount, 2);
// preventDefault called for Space
let pdCalled = false;
input._ku({ code: 'Space' });
input._kd({ code: 'Space', repeat: false, preventDefault(){ pdCalled = true; } });
assert.ok(pdCalled);
// blur clears keys
input._kd({ code: 'ArrowRight', repeat: false, preventDefault(){} });
assert.ok(input.isDown('ArrowRight'));
input._blur();
assert.ok(!input.isDown('ArrowRight'));
assert.equal(input.keys.size, 0);
console.log('input ok');
