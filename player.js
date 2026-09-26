import { level } from "./level.js";

export function createPlayer(inputs) {
  let x = 2;
  let y = 3;
  let wait = false;
  function delay() {
    wait = true;
    setTimeout(() => (wait = false), 50);
  }
  function dropBomb() {
    
  }
  function update() {
    if (
      inputs.pressed.has("ArrowLeft") &&
      wait === false &&
      level[this.y][this.x - 1] != 1
    ) {
      delay();
      this.x -= 1;
    } else if (
      inputs.pressed.has("ArrowRight") &&
      wait === false &&
      level[this.y][this.x + 1] != 1
    ) {
      delay();
      this.x += 1;
    } else if (
      inputs.pressed.has("ArrowUp") &&
      wait === false &&
      level[this.y - 1][this.x] != 1
    ) {
      delay();
      this.y -= 1;
    } else if (
      inputs.pressed.has("ArrowDown") &&
      wait === false &&
      level[this.y + 1][this.x] != 1
    ) {
      delay();
      this.y += 1;
    }
  }
  return { x, y, update };
}
