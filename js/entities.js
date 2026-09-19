function makeDiv(layer, cls, w, h, color) {
  const el = typeof document !== 'undefined' ? document.createElement('div') : { style: {} };
  el.className = 'ent ' + cls;
  el.style.width = w + 'px'; el.style.height = h + 'px'; el.style.background = color;
  el.style.display = 'none';
  layer.appendChild?.(el);
  return el;
}
function makePool(layer, cls, n, w, h, color) {
  const arr = [];
  for (let i = 0; i < n; i++) arr.push({ el: makeDiv(layer, cls, w, h, color), x: 0, y: 0, vx: 0, vy: 0, w, h, active: false, kind: cls });
  return arr;
}
export function createWorld(layer) {
  const player = { el: makeDiv(layer, 'player', 28, 20, '#4df3ff'), x: 386, y: 540, vx: 0, vy: 0, w: 28, h: 20, active: true, kind: 'player', invuln: 0 };
  const enemies = makePool(layer, 'enemy', 12, 30, 22, '#ff4d6d');
  const pBullets = makePool(layer, 'pb', 30, 4, 12, '#ffe14d');
  const eBullets = makePool(layer, 'eb', 80, 7, 7, '#ff8b3d');
  function get(pool) { return pool.find(e => !e.active); }
  return {
    player, enemies, pBullets, eBullets,
    spawnEnemy(type, x) {
      const e = get(enemies); if (!e) return null;
      e.active = true; e.kind = type; e.x = x; e.y = -30; e.t = 0;
      return e;
    },
    firePlayer() {
      const b = get(pBullets); if (!b) return null;
      b.active = true; b.x = player.x + player.w / 2 - 2; b.y = player.y - 12; b.vx = 0; b.vy = -600;
      return b;
    },
    fireEnemy(x, y, vx, vy) {
      const b = get(eBullets); if (!b) return null;
      b.active = true; b.x = x; b.y = y; b.vx = vx; b.vy = vy;
      return b;
    },
    reset() {
      for (const p of [...enemies, ...pBullets, ...eBullets]) p.active = false;
      player.x = 386; player.y = 540; player.invuln = 0; player.active = true;
    },
  };
}
