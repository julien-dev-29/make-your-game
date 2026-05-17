export class Timer {
  constructor() {
    this.$container = document.querySelector(".timer-board-container");
    this.$element = document.querySelector(".timer-board");
    this.$min = document.createElement("span");
    this.$sec = document.createElement("span");
    this.timer = 120;
    const interval = setInterval(() => {
      if (this.timer <= 0) {
      }
      this.update();
    }, 1000);
    this.$element.append(this.$min);
    this.$element.append(this.$sec);
  }
  update() {
    this.timer--;
    this.$min.textContent = this.timer >= 60 ? "0" + 1 + ":" : "0" + 0 + ":";
    if (this.timer === 60) {
      this.$sec = "00";
    } else if (this.timer > 60) {
      this.$sec.textContent = this.timer - 60;
    } else {
      this.$sec.textContent = this.timer;
    }
  }
}
