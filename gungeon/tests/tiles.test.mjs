import assert from 'node:assert';
import { TILE, COLS, ROWS, TS, MAPS, parseMap, buildMap, clearMap } from '../js/tiles.js';
assert.equal(COLS, 25); assert.equal(ROWS, 19); assert.equal(TS, 32);
assert.equal(MAPS.length, 3);
const maps = MAPS.map(parseMap);
for (const m of maps) {
  assert.equal(m.columns, 25); assert.equal(m.rows, 19); assert.equal(m.size, 32);
  assert.equal(m.tiles.length, 475);
  for (let c = 0; c < 25; c++) { assert.ok(m.isSolid(c, 0)); assert.ok(m.isSolid(c, 18)); }
  for (let r = 0; r < 19; r++) { assert.ok(m.isSolid(0, r)); assert.ok(m.isSolid(24, r)); }
  assert.ok(m.spawnPoints.length >= 2, 'needs 2+ spawns');
  assert.equal(m.getTile(2, 1), TILE.FLOOR);
}
assert.notDeepEqual(maps[0].tiles, maps[1].tiles);
assert.notDeepEqual(maps[1].tiles, maps[2].tiles);
assert.notDeepEqual(maps[0].tiles, maps[2].tiles);
assert.equal(parseMap(MAPS[0]).getTile(-1, 0), TILE.WALL);
const layer = { prepend(){}, appendChild(){} };
const built = buildMap(layer, 0);
assert.equal(built.name, 'Cour'); assert.ok(built.spawnPoints.length >= 2);
clearMap();
console.log('tiles ok');
