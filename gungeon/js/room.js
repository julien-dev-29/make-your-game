import { buildMap, MAPS } from './tiles.js';
const SIZES = [3, 5, 7];
const KINDS = ['blob', 'shooter', 'turret'];
export function createRoom(world, tileLayer) {
  const api = {
    wave: 0, waveSizes: SIZES, spawned: 0, delay: 0, mapName: '',
    reset() {
      this.loadWave(0);
    },
    loadWave(i) {
      this.wave = i; this.spawned = 0; this.delay = 0;
      const map = buildMap(tileLayer, i);
      world.tilemap = map;
      this.mapName = map.name;
      const s = map.spawnPoints[0];
      world.player.x = s.c * 32 + 4; world.player.y = s.r * 32 + 4;
    },
    farSpawn() {
      let best = world.tilemap.spawnPoints[0], bd = -1;
      for (const s of world.tilemap.spawnPoints) {
        const dx = s.c * 32 - world.player.x, dy = s.r * 32 - world.player.y;
        const d = dx * dx + dy * dy;
        if (d > bd) { bd = d; best = s; }
      }
      return best;
    },
    isWaveCleared() {
      return this.spawned >= SIZES[this.wave] && !world.enemies.some(e => e.active);
    },
    update(dt) {
      if (this.spawned < SIZES[this.wave]) {
        this.delay -= dt;
        if (this.delay <= 0) {
          this.delay = 0.5;
          const s = this.farSpawn();
          world.spawnEnemy(KINDS[(this.spawned + this.wave) % 3], s.c * 32 + 3, s.r * 32 + 3);
          this.spawned++;
        }
        return 'spawning';
      }
      if (world.enemies.some(e => e.active)) return 'fighting';
      if (this.wave < SIZES.length - 1) { this.loadWave(this.wave + 1); return 'spawning'; }
      return 'cleared';
    },
  };
  return api;
}
