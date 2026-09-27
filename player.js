import { createBomb } from "./bomb.js";

export function createPlayer(inputs, level) {
  let x = 1;
  let y = 1;
  let bombs = [];
  let wait = false;
  let cool = false;
  function delay() {
    wait = true;
    setTimeout(() => (wait = false), 200);
  }
  function coolDown() {
    cool = true;
    setTimeout(() => (cool = false), 200);
  }
  function update() {
    updateBombs();
    if (inputs.pressed.has(" ") && cool === false) {
      bombs.push(createBomb({ x: this.x, y: this.y }, level));
      coolDown();
    } else if (
      inputs.pressed.has("ArrowLeft") &&
      wait === false &&
      level[this.y][this.x - 1] != 1 &&
      level[this.y][this.x - 1] != 2
    ) {
      delay();
      this.x -= 1;
    } else if (
      inputs.pressed.has("ArrowRight") &&
      wait === false &&
      level[this.y][this.x + 1] != 1 &&
      level[this.y][this.x + 1] != 2
    ) {
      delay();
      this.x += 1;
    } else if (
      inputs.pressed.has("ArrowUp") &&
      wait === false &&
      level[this.y - 1][this.x] != 1 &&
      level[this.y - 1][this.x] != 2
    ) {
      delay();
      this.y -= 1;
    } else if (
      inputs.pressed.has("ArrowDown") &&
      wait === false &&
      level[this.y + 1][this.x] != 1 &&
      level[this.y + 1][this.x] != 2
    ) {
      delay();
      this.y += 1;
    }
  }
  function updateBombs() {
    bombs = bombs.filter((b) => b.isDestroyed() === false);
    bombs.forEach((b) => b.update());
  }
  const getBombs = () => bombs;
  return { x, y, update, getBombs };
}
