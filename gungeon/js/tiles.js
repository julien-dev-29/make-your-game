export const TILE = { EMPTY: 0, FLOOR: 1, WALL: 2, OBSTACLE: 3, SPAWN: 4 };
export const COLS = 25, ROWS = 19, TS = 32;
const CH = { '#': 2, '.': 1, o: 3, S: 4 };
export const MAPS = [
  { name: 'Cour', rows: [
    '#########################',
    '#.......................#',
    '#..S.................S..#',
    '#.......................#',
    '#.......................#',
    '#......oo.....oo........#',
    '#......oo.....oo........#',
    '#.......................#',
    '#.......................#',
    '#...........o...........#',
    '#.......................#',
    '#.......................#',
    '#......oo.....oo........#',
    '#......oo.....oo........#',
    '#.......................#',
    '#.......................#',
    '#..S.................S..#',
    '#.......................#',
    '#########################',
  ] },
  { name: 'Piliers', rows: [
    '#########################',
    '#.......................#',
    '#..S.................S..#',
    '#.......................#',
    '#.......................#',
    '#..####.....####.....##.#',
    '#.......................#',
    '#.......................#',
    '#.......................#',
    '#.....##.....##.....##..#',
    '#.......................#',
    '#.......................#',
    '#.......................#',
    '#..####.....####.....##.#',
    '#.......................#',
    '#.......................#',
    '#..S.................S..#',
    '#.......................#',
    '#########################',
  ] },
  { name: 'Labyrinthe', rows: [
    '#########################',
    '#S.....................S#',
    '#.####################..#',
    '#.......................#',
    '#.......................#',
    '#...#####################',
    '#.......................#',
    '#.......................#',
    '#.####################..#',
    '#.......................#',
    '#.......................#',
    '#...#####################',
    '#.......................#',
    '#.......................#',
    '#.####################..#',
    '#.......................#',
    '#..S.................S..#',
    '#.......................#',
    '#########################',
  ] },
];
export function parseMap(def) {
  const tiles = new Array(COLS * ROWS);
  const spawnPoints = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const t = CH[def.rows[r][c]] ?? 1;
      tiles[r * COLS + c] = t;
      if (t === 4) spawnPoints.push({ c, r });
    }
  }
  return {
    name: def.name, columns: COLS, rows: ROWS, size: TS, tiles, spawnPoints,
    getTile(col, row) {
      if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return TILE.WALL;
      return tiles[row * COLS + col];
    },
    isSolid(col, row) { const t = this.getTile(col, row); return t !== TILE.FLOOR && t !== TILE.SPAWN; },
  };
}
let atlasDone = false, container = null;
export function ensureAtlas() {
  if (atlasDone || typeof document === 'undefined') return atlasDone;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('style', 'display:none');
  svg.innerHTML = `<defs>`
    + `<symbol id="t-floor-a" viewBox="0 0 32 32"><rect width="32" height="32" fill="#1a1830"/></symbol>`
    + `<symbol id="t-floor-b" viewBox="0 0 32 32"><rect width="32" height="32" fill="#201d3a"/></symbol>`
    + `<symbol id="t-wall" viewBox="0 0 32 32"><rect width="32" height="32" fill="#3a3568"/><rect y="7" width="32" height="2" fill="#2c2750"/><rect y="15" width="32" height="2" fill="#2c2750"/><rect y="23" width="32" height="2" fill="#2c2750"/></symbol>`
    + `<symbol id="t-obst" viewBox="0 0 32 32"><rect width="32" height="32" fill="#1a1830"/><rect x="4" y="6" width="24" height="20" rx="4" fill="#4a4480"/><rect x="8" y="10" width="10" height="6" rx="2" fill="#5d5590"/></symbol>`
    + `<symbol id="t-spawn" viewBox="0 0 32 32"><rect width="32" height="32" fill="#1a1830"/><circle cx="16" cy="16" r="10" fill="none" stroke="#4df3ff" stroke-width="2" opacity="0.7"/></symbol>`
    + `</defs>`;
  document.body.appendChild(svg);
  atlasDone = true;
  return true;
}
const SYM = { 1: null, 2: 't-wall', 3: 't-obst', 4: 't-spawn' };
export function buildMap(layer, index) {
  clearMap();
  const map = parseMap(MAPS[index]);
  if (typeof document === 'undefined' || !layer) return map;
  ensureAtlas();
  container = document.createElement('div');
  container.className = 'tilemap';
  container.style.cssText = 'position:absolute;inset:0;';
  let html = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const t = map.tiles[r * COLS + c];
      const sym = t === 1 ? ((c + r) % 2 ? 't-floor-b' : 't-floor-a') : SYM[t];
      html += `<div class="tile" style="transform:translate3d(${c * TS}px,${r * TS}px,0)">`
        + `<svg width="32" height="32"><use href="#${sym}"/></svg></div>`;
    }
  }
  container.innerHTML = html;
  if (layer.prepend) layer.prepend(container); else layer.appendChild(container);
  return map;
}
export function clearMap() {
  if (container && container.remove) container.remove();
  container = null;
}
