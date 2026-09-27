import { createCell } from "../cell.js";
export function createGameBoard(inputs, player, level, bombs) {
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
  }

  function render() {
    elmt.innerHTML = "";
    level.forEach((row, i) => {
      row.forEach((col, j) => {
        const cell = createCell(bombs);
        if (i == player.y && j === player.x) {
          cell.addPLayer();
        }
        if (col === 1) {
          cell.addWall();
        } else if (col === 2) {
          cell.addDestructible();
        } else if (col === 3) {
          let bomb = player.getBombs().find((b) => b.x === j && b.y === i);
          cell.addBomb(bomb);
        } else if (col === 4) {
          cell.addFire();
        }
        elmt.append(cell.elmt);
      });
    });
  }
  return {
    render,
    update,
  };
}
