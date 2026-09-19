export function bindUI(els, game) {
  let acc = 0;
  return {
    frame(dt) {
      acc += dt;
      if (acc < 0.25) return;
      acc = 0;
      els.hearts.textContent = String(Math.max(0, game.hp));
      els.wave.textContent = `${Math.min(game.wave + 1, 3)}/3`;
      els.score.textContent = String(Math.floor(game.score));
      els.time.textContent = game.elapsed.toFixed(1);
      els.roll.textContent = game.rollCd > 0 ? `roll ${game.rollCd.toFixed(1)}s` : 'roll ready';
    },
    fps(t) { els.fps.textContent = t; },
    show(id) {
      for (const k of ['menu', 'pause-menu', 'gameover'])
        document.getElementById(k).classList.toggle('hidden', k !== id);
      if (!id) for (const k of ['menu', 'pause-menu', 'gameover']) document.getElementById(k).classList.add('hidden');
    },
    gameover(win) {
      document.getElementById('gameover-title').textContent = win ? 'CHAMBER CLEAR' : 'GAME OVER';
      document.getElementById('gameover-stats').textContent = `Score ${Math.floor(game.score)} · Time ${game.elapsed.toFixed(1)}s · Wave ${Math.min(game.wave + 1, 3)}/3`;
    },
  };
}
