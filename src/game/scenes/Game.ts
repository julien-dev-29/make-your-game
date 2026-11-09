import { Scene } from "phaser";

export class Game extends Scene {
  platforms: Phaser.Physics.Arcade.StaticGroup;
  player
  constructor() {
    super("Game");
  }

  preload() {
    this.load.setPath("assets");
    this.load.image("background", "bg.png");
    this.load.image("ground", "ground.png");
  }

  create() {
    this.add.image(0, 0, "background").setOrigin(0, 0);

    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, "ground").setScale(2).refreshBody();

    this.platforms.create(600, 400, "ground");
    this.platforms.create(50, 250, "ground");
    this.platforms.create(750, 220, "ground");
  }
}
