import type { Board } from "../types";

export function renderGameboard(board: Board): HTMLDivElement {
  let cellNumber = 0;
  const gameboard = document.createElement("div");
  gameboard.classList.add("gameboard");
  board.forEach((row) => {
    row.forEach((col) => {
      const cell = document.createElement("div");
      cell.dataset.testid = `cell-${cellNumber}`;
      cell.classList.add("cell");
      if (col === 2) {
        cell.classList.add("wall");
      }
      gameboard.appendChild(cell);
      cellNumber++;
    });
  });
  return gameboard;
}
