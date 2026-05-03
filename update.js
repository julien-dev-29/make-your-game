import { Player } from "./Player.js";
import { isKeyPressed } from "./controls.js";
import { checkBorderCollision } from "./collision.js";

export const update = (/** @type Player*/ player, deltaTime) => {
  if (isKeyPressed("ArrowRight") || isKeyPressed("d")) {
    player.moveToRight(deltaTime);
  }
  if (isKeyPressed("ArrowLeft") || isKeyPressed("a")) {
    player.moveToLeft(deltaTime);
  }
  if (isKeyPressed("ArrowUp") || isKeyPressed("w")) {
    player.moveUp(deltaTime);
  }
  if (isKeyPressed("ArrowDown") || isKeyPressed("s")) {
    player.moveDown(deltaTime);
  }

  if (isKeyPressed("Space")) {
    player.strike();
  }

  checkBorderCollision(player);

  player.$element.style.transform = `translate(${player.x}px, ${player.y}px)`;
};
