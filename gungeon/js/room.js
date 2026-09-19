const SIZES = [3, 5, 7];
const KINDS = ['blob', 'shooter', 'turret'];
export function createRoom(world) {
  const room = { wave: 0, waveSizes: SIZES, spawned: 0, delay: 0 };
  function freeSpot() {
    for (let i = 0; i < 20; i++) {
      const x = 60 + Math.random() * 660, y = 60 + Math.random() * 460;
      const dx = x - world.player.x, dy = y - world.player.y;
      if (dx * dx + dy * dy > 180 * 180) return { x, y };
    }
    return { x: 80, y: 80 };
  }
  return {
    wave: 0, waveSizes: SIZES,
    reset() { room.wave = 0; room.spawned = 0; room.delay = 0; this.wave = 0; },
    isWaveCleared() {
      return room.spawned >= SIZES[room.wave] && !world.enemies.some(e => e.active);
    },
    update(dt) {
      this.wave = room.wave;
      if (room.spawned < SIZES[room.wave]) {
        room.delay -= dt;
        if (room.delay <= 0) {
          room.delay = 0.5;
          const s = freeSpot();
          world.spawnEnemy(KINDS[(room.spawned + room.wave) % 3], s.x, s.y);
          room.spawned++;
        }
        return 'spawning';
      }
      if (world.enemies.some(e => e.active)) return 'fighting';
      if (room.wave < SIZES.length - 1) { room.wave++; room.spawned = 0; room.delay = 1.0; this.wave = room.wave; return 'spawning'; }
      return 'cleared';
    },
  };
}
