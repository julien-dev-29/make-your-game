export const STEP = 1 / 120;
export const W = 800, H = 600;
export function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
const HITBOX = { x: 0, y: 0, w: 10, h: 10 };
const MOVES = [['KeyA', 'KeyQ', -1, 0], ['KeyD', 1, 0], ['KeyW', 'KeyZ', 0, -1], ['KeyS', 0, 1]];
function moveKeys(input) {
  let dx = 0, dy = 0;
  for (const m of MOVES) {
    const x = m[m.length - 2], y = m[m.length - 1];
    for (let i = 0; i < m.length - 2; i++) if (input.isDown(m[i])) { dx += x; dy += y; break; }
  }
  if (dx && dy) { dx *= Math.SQRT1_2; dy *= Math.SQRT1_2; }
  return { dx, dy };
}
export function step(world, input, dt, api) {
  const p = world.player;
  p.t += dt;
  if (p.invuln > 0) p.invuln -= dt;
  if (p.rollCd > 0) p.rollCd -= dt;
  const { dx, dy } = moveKeys(input);
  if (dx || dy) { p.faceX = dx; p.faceY = dy; }
  const wantRoll = input.isDown('ShiftLeft') || input.isDown('ShiftRight');
  if (wantRoll && p.rollT <= 0 && p.rollCd <= 0 && (dx || dy)) { p.rollT = 0.35; p.rollCd = 0.9; p.invuln = Math.max(p.invuln, 0.35); }
  const spd = p.rollT > 0 ? 520 : 260;
  if (p.rollT > 0) p.rollT -= dt;
  p.x += dx * spd * dt;
  p.y += dy * spd * dt;
  p.x = Math.min(W - p.w, Math.max(0, p.x));
  p.y = Math.min(H - p.h, Math.max(0, p.y));
  for (const wl of world.walls) {
    if (aabb(p, wl)) {
      const ox1 = (p.x + p.w) - wl.x, ox2 = (wl.x + wl.w) - p.x;
      const oy1 = (p.y + p.h) - wl.y, oy2 = (wl.y + wl.h) - p.y;
      const m = Math.min(ox1, ox2, oy1, oy2);
      if (m === ox1) p.x = wl.x - p.w; else if (m === ox2) p.x = wl.x + wl.w;
      else if (m === oy1) p.y = wl.y - p.h; else p.y = wl.y + wl.h;
    }
  }
  api.fireCd -= dt;
  const aim = input.aimDir();
  let ax = aim.x, ay = aim.y;
  if (!ax && !ay) { ax = p.faceX; ay = p.faceY; }
  if (input.isDown('Space') && api.fireCd <= 0) { world.firePlayer(ax, ay); api.fireCd = 1 / 6; }
  for (const e of world.enemies) {
    if (!e.active) continue;
    e.t += dt;
    const dxp = p.x - e.x, dyp = p.y - e.y;
    const d = Math.hypot(dxp, dyp) || 1;
    if (e.kind === 'blob') { e.x += (dxp / d) * 70 * dt; e.y += (dyp / d) * 70 * dt; }
    else if (e.kind === 'shooter') {
      if (d > 260) { e.x += (dxp / d) * 90 * dt; e.y += (dyp / d) * 90 * dt; }
      else if (d < 200) { e.x -= (dxp / d) * 60 * dt; e.y -= (dyp / d) * 60 * dt; }
      e.fireT -= dt;
      if (e.fireT <= 0) { e.fireT = 1.6; world.fireEnemy(e.x + 9, e.y + 9, (dxp / d) * 140, (dyp / d) * 140); }
    } else {
      e.fireT -= dt;
      if (e.fireT <= 0) {
        e.fireT = 2.2;
        for (let k = 0; k < 3; k++) {
          const a = e.t + (k * Math.PI * 2) / 3;
          world.fireEnemy(e.x + 9, e.y + 9, Math.cos(a) * 120, Math.sin(a) * 120);
        }
      }
    }
    e.x = Math.min(W - e.w, Math.max(0, e.x));
    e.y = Math.min(H - e.h, Math.max(0, e.y));
  }
  for (const b of world.pBullets) {
    if (!b.active) continue;
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.x < -20 || b.x > W + 20 || b.y < -20 || b.y > H + 20) b.active = false;
  }
  for (const b of world.eBullets) {
    if (!b.active) continue;
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.x < -20 || b.x > W + 20 || b.y < -20 || b.y > H + 20) b.active = false;
  }
  for (const b of world.pBullets) {
    if (!b.active) continue;
    for (const e of world.enemies) {
      if (e.active && aabb(b, e)) { b.active = false; e.active = false; api.onKill(e); break; }
    }
  }
  if (p.invuln <= 0 && p.rollT <= 0) {
    HITBOX.x = p.x + 7; HITBOX.y = p.y + 7;
    for (const b of world.eBullets) {
      if (b.active && aabb(HITBOX, b)) { b.active = false; api.onHit(); break; }
    }
    if (p.invuln <= 0) for (const e of world.enemies) {
      if (e.active && aabb(HITBOX, e)) { api.onHit(); break; }
    }
  }
}
