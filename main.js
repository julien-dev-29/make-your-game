import { MyGame } from "./MyGame.js";
import { Player } from "./Player.js";
import { render } from "./render.js";
import { Timer } from "./Timer.js";
import { update } from "./update.js";
const player = new Player();
const timer = new Timer();
document.querySelector(".game-board").append(player.$element);
(() => {
  let lastTime = 0;

  function main(tFrame) {
    MyGame.stopMain = window.requestAnimationFrame(main);

    const deltaTime = lastTime ? (tFrame - lastTime) / 1000 : 0;
    lastTime = tFrame;
    update(player, timer, deltaTime);
    render();
    MyGame.lastRender = tFrame;
  }
  main();
})();
