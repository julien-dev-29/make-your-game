export class Game {
  $element;
  constructor() {
    this.$element = document.querySelector(".game");
    this.score = 0;
    this.lives = 3;
    this.timer = 0;
  }

  initScore() {
    this.$score = document.createElement("div");
    this.$element.append(this.$score);
  }
}
