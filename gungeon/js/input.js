const GAME_KEYS = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'];
export function createInput() {
  const keys = new Set();
  const st = { onPause: null, onConfirm: null };
  function kd(e) {
    if (GAME_KEYS.includes(e.code)) e.preventDefault?.();
    if (e.repeat) return;
    keys.add(e.code);
    if (e.code === 'KeyP' || e.code === 'Escape') st.onPause?.();
    if (e.code === 'Enter') st.onConfirm?.();
  }
  function ku(e) { keys.delete(e.code); }
  function blur() { keys.clear(); }
  return {
    keys,
    get onPause() { return st.onPause; }, set onPause(fn) { st.onPause = fn; },
    get onConfirm() { return st.onConfirm; }, set onConfirm(fn) { st.onConfirm = fn; },
    isDown(c) { return keys.has(c); },
    aimDir() {
      const x = (keys.has('ArrowRight') ? 1 : 0) - (keys.has('ArrowLeft') ? 1 : 0);
      const y = (keys.has('ArrowDown') ? 1 : 0) - (keys.has('ArrowUp') ? 1 : 0);
      if (x && y) return { x: x * Math.SQRT1_2, y: y * Math.SQRT1_2 };
      return { x, y };
    },
    attach() {
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('keydown', kd);
        window.addEventListener('keyup', ku);
        window.addEventListener('blur', blur);
      }
    },
    detach() {
      if (typeof window !== 'undefined' && window.removeEventListener) {
        window.removeEventListener('keydown', kd);
        window.removeEventListener('keyup', ku);
        window.removeEventListener('blur', blur);
      }
    },
    _kd: kd, _ku: ku, _blur: blur,
  };
}
