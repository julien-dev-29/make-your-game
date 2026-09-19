export function bindUI(els, game) {
  const t = els.timer, s = els.score, l = els.lives, f = els.fps;
  let acc = 0;
  return {
    frame(dt) {
      acc += dt;
      if (acc < 0.25) return;
      acc = 0;
      t.textContent = game.timeLeft.toFixed(1);
      s.textContent = String(game.score);
      l.textContent = String(game.lives);
    },
    fps(text) { f.textContent = text; },
    show(id) {
      for (const k of ['menu','pause-menu','gameover'])
        document.getElementById(k).classList.toggle('hidden', k !== id);
      if (!id) for (const k of ['menu','pause-menu','gameover']) document.getElementById(k).classList.add('hidden');
    },
    gameover(win) {
      document.getElementById('gameover-title').textContent = win ? 'YOU WIN' : 'GAME OVER';
      document.getElementById('gameover-stats').textContent = `Score ${game.score} · Time ${game.elapsed.toFixed(1)}s`;
    },
  };
}
