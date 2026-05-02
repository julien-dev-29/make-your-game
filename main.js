import { MyGame } from "./MyGame.js";
import { Player } from "./Player.js";
import { render } from "./render.js";
import { update } from "./update.js";
const player = new Player();
document.body.append(player.$element);
(() => {
  let lastTime = 0;

  function main(tFrame) {
    MyGame.stopMain = window.requestAnimationFrame(main);

    const deltaTime = lastTime ? (tFrame - lastTime) / 1000 : 0;
    lastTime = tFrame;

    update(player, deltaTime);
    render();
    MyGame.lastRender = tFrame;
  }

  main();
})();
