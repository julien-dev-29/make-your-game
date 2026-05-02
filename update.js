import { Player } from "./Player.js";
import { isKeyPressed } from "./controls.js";
import { checkBorderCollision } from "./collision.js";

export const update = (/** @type Player*/ player, deltaTime) => {
  const movement = player.speed * deltaTime;

  if (isKeyPressed("ArrowRight") || isKeyPressed("d")) player.x += movement;
  if (isKeyPressed("ArrowLeft") || isKeyPressed("a")) player.x -= movement;
  if (isKeyPressed("ArrowUp") || isKeyPressed("w")) player.y -= movement;
  if (isKeyPressed("ArrowDown") || isKeyPressed("s")) player.y += movement;

  checkBorderCollision(player);

  player.$element.style.transform = `translate(${player.x}px, ${player.y}px)`;
};
