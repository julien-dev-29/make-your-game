export class GameEngine {
  private running: boolean = false;
  private lastFrameTime: number = 0;

  start(): void {
    this.running = true;
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  private gameLoop(currentTime: number): void {
    if (!this.running) return;

    this.lastFrameTime = currentTime;

    this.processInput();
    this.update();
    this.render();
  }

  private processInput(): void {}

  private update(): void {}

  private render(): void {}

  stop(): void {
    this.running = false;
  }
}
