export class Player {
  constructor() {
    this.x = 100;
    this.y = 100;
    this.speed = 300;
    this.isStriking = false;
    this.strikeCooldown = false;
    this.isMovingToright = false;
    this.init();
  }
  init() {
    this.$element = document.createElement("div");
    this.$element.classList.add("element");
    this.$element.id = "player";
    this.$leftEye = document.createElement("div");
    this.$rightEye = document.createElement("div");
    this.$face = document.createElement("div");
    this.$core = document.createElement("div");
    this.$aerial = document.createElement("div");
    this.$leftHand = document.createElement("div");
    this.$rightHand = document.createElement("div");
    this.$sword = document.createElement("div");
    this.$sword.classList.add("sword");
    this.$shield = document.createElement("div");
    this.$shield.classList.add("shield");
    this.$element.append(this.$leftEye);
    this.$element.append(this.$rightEye);
    this.$element.append(this.$sword);
    this.$element.append(this.$face);
    this.$element.append(this.$core);
    this.$element.append(this.$aerial);
    this.$element.append(this.$leftHand);
    this.$element.append(this.$rightHand);
  }
  strike() {
    if (this.strikeCooldown) return;
    this.isStriking = true;
    this.strikeCooldown = true;
    this.$sword.classList.add("sword--striking");
    setTimeout(() => {
      this.isStriking = false;
      this.$sword.classList.remove("sword--striking");
    }, 1000);
    setTimeout(() => {
      this.strikeCooldown = false;
    }, 1200);
  }
  moveToRight(deltaTime) {
    this.$element.classList.remove(...this.$element.classList);
    this.$element.classList.add("move-right");
    this.$rightEye.classList.add("eye");
    this.x += this.speed * deltaTime;
  }
  moveToLeft(deltaTime) {
    this.$element.classList.remove(...this.$element.classList);
    this.$element.classList.add("move-left");
    this.$rightEye.classList.add("eye");
    this.x -= this.speed * deltaTime;
  }
  moveUp(deltaTime) {
    this.$element.classList.remove(...this.$element.classList);
    this.$element.classList.add("move-up");
    this.$rightEye.classList.add("eye");
    this.$leftEye.classList.add("eye");
    this.y -= this.speed * deltaTime;
  }
  moveDown(deltaTime) {
    this.$element.classList.remove(...this.$element.classList);
    this.$element.classList.add("move-down");
    this.$rightEye.classList.add("right-eye");
    this.$leftEye.classList.add("left-eye");
    this.$face.classList.add("face");
    this.$core.classList.add("core");
    this.$aerial.classList.add("aerial");
    this.$leftHand.classList.add("left-hand");
    this.$rightHand.classList.add("right-hand");
    this.y += this.speed * deltaTime;
  }
}
