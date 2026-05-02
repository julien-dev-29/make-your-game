export class Player {
  constructor() {
    this.x = 100;
    this.y = 100;
    this.speed = 300;
    this.init();
  }
  init() {
    this.$element = document.createElement("div");
    this.$element.id = "player";
    const $hat = document.createElement("div");
    $hat.id = "hat";
    this.$element.append($hat);
  }
}
