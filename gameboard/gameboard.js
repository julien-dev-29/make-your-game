import { level } from "../level.js";
export function createGameBoard(inputs, player) {
  const elmt = document.querySelector(".gameboard");

  function update() {
    if (inputs.pressed.has("ArrowLeft")) {
      x -= 1;
    } else if (inputs.pressed.has("ArrowRight")) {
      x += 1;
    } else if (inputs.pressed.has("ArrowUp")) {
      y -= 1;
    } else if (inputs.pressed.has("ArrowDown")) {
      y += 1;
    }
    //clamping();
  }

  function render() {
    elmt.innerHTML = "";
    level.forEach((row, i) => {
      row.forEach((col, j) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (i == player.y && j === player.x) {
          cell.classList.add("player");
        }
        if (col === 1) {
          cell.classList.add("wall")
        }
        elmt.append(cell);
      });
    });
  }
  return {
    render,
    update,
  };
}
