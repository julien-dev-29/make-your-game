export const STEP = 1 / 120;
export const W = 800, H = 600;
export function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
const HITBOX = { x: 0, y: 0, w: 10, h: 10 };
import { COLS, ROWS, TS } from './tiles.js';
function tileSolid(tm, px, py) {
  const c = Math.floor(px / TS), r = Math.floor(py / TS);
  if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return true;
  const t = tm.tiles[r * COLS + c];
  return t !== 1 && t !== 4;
}
function cornerHit(tm, x, y, w, h) {
  return tileSolid(tm, x + 1, y + 1) || tileSolid(tm, x + w - 1, y + 1)
    || tileSolid(tm, x + 1, y + h - 1) || tileSolid(tm, x + w - 1, y + h - 1);
}
function moveGrid(e, tm, mx, my) {
  if (!cornerHit(tm, e.x + mx, e.y, e.w, e.h)) e.x += mx;
  if (!cornerHit(tm, e.x, e.y + my, e.w, e.h)) e.y += my;
}
function bulletHitWall(tm, b) {
  return tileSolid(tm, b.x + 2, b.y + 2);
}
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
  const mx = dx * spd * dt, my = dy * spd * dt;
  const tm = world.tilemap;
  if (tm) moveGrid(p, tm, mx, my);
  else { p.x += mx; p.y += my; }
  p.x = Math.min(W - p.w, Math.max(0, p.x));
  p.y = Math.min(H - p.h, Math.max(0, p.y));
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
    if (e.kind === 'blob') {
      const mxx = (dxp / d) * 70 * dt, myy = (dyp / d) * 70 * dt;
      if (world.tilemap) moveGrid(e, world.tilemap, mxx, myy);
      else { e.x += mxx; e.y += myy; }
    }
    else if (e.kind === 'shooter') {
      let mxx = 0, myy = 0;
      if (d > 260) { mxx = (dxp / d) * 90 * dt; myy = (dyp / d) * 90 * dt; }
      else if (d < 200) { mxx = -(dxp / d) * 60 * dt; myy = -(dyp / d) * 60 * dt; }
      if (world.tilemap) moveGrid(e, world.tilemap, mxx, myy);
      else { e.x += mxx; e.y += myy; }
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
    if (world.tilemap && bulletHitWall(world.tilemap, b)) b.active = false;
    if (b.x < -20 || b.x > W + 20 || b.y < -20 || b.y > H + 20) b.active = false;
  }
  for (const b of world.eBullets) {
    if (!b.active) continue;
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (world.tilemap && bulletHitWall(world.tilemap, b)) b.active = false;
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
