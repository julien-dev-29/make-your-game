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
  for (let i = 0; i < n; i++) arr.push({ el: makeDiv(layer, cls, w, h, color), x: 0, y: 0, vx: 0, vy: 0, w, h, active: false, kind: cls, t: 0 });
  return arr;
}
export function createWorld(layer) {
  const player = { el: makeDiv(layer, 'player', 24, 24, '#4df3ff'), x: 388, y: 300, vx: 0, vy: 0, w: 24, h: 24, active: true, kind: 'player', t: 0, hp: 3, rollT: 0, rollCd: 0, faceX: 1, faceY: 0, invuln: 0 };
  const enemies = makePool(layer, 'enemy', 10, 26, 26, '#ff4d6d');
  const pBullets = makePool(layer, 'pb', 40, 5, 5, '#ffe14d');
  const eBullets = makePool(layer, 'eb', 100, 7, 7, '#ff8b3d');
  const walls = [
    { x: 200, y: 220, w: 120, h: 30, el: makeDiv(layer, 'wall', 120, 30, '#3a3568') },
    { x: 480, y: 350, w: 120, h: 30, el: makeDiv(layer, 'wall', 120, 30, '#3a3568') },
  ];
  for (const wl of walls) { wl.el.style.display = 'block'; wl.el.style.transform = `translate3d(${wl.x}px,${wl.y}px,0)`; }
  function get(pool) { return pool.find(e => !e.active); }
  return {
    player, enemies, pBullets, eBullets, walls,
    spawnEnemy(kind, x, y) {
      const e = get(enemies); if (!e) return null;
      e.active = true; e.kind = kind; e.x = x; e.y = y; e.t = 0; e.fireT = kind === 'shooter' ? 1.0 : 2.0;
      e.el.style.background = kind === 'shooter' ? '#c77dff' : kind === 'turret' ? '#ffa03d' : '#ff4d6d';
      return e;
    },
    firePlayer(dx, dy) {
      const b = get(pBullets); if (!b) return null;
      b.active = true; b.x = player.x + 9; b.y = player.y + 9; b.vx = dx * 550; b.vy = dy * 550;
      return b;
    },
    fireEnemy(x, y, vx, vy) {
      const b = get(eBullets); if (!b) return null;
      b.active = true; b.x = x; b.y = y; b.vx = vx; b.vy = vy;
      return b;
    },
    reset() {
      for (const e of enemies) e.active = false;
      for (const b of pBullets) b.active = false;
      for (const b of eBullets) b.active = false;
      player.x = 388; player.y = 300; player.hp = 3; player.rollT = 0; player.rollCd = 0;
      player.faceX = 1; player.faceY = 0; player.invuln = 0; player.active = true;
    },
  };
}
