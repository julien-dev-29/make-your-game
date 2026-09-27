import { createGameBoard } from "./gameboard/gameboard.js";
import { createInputs } from "./inputs.js";
import { createPlayer } from "./player.js";
import { level } from "./level.js";
const inputs = createInputs();
const player = createPlayer(inputs, level);
const gameboard = createGameBoard(inputs, player, level);
inputs.init();
let start;

function gameLoop(timestamp) {
  if (start === undefined) {
    start = timestamp;
  }
  player.update();
  gameboard.render();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
