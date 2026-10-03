export class Input {
  private _keyPressed: Set<string>;

  constructor() {
    this._keyPressed = new Set<string>();
    this.init();
  }

  private init() {
    window.addEventListener("keydown", (e) => {
      if (this.isArrowInput(e.code)) {
        this._keyPressed.add(e.code);
        console.log("yolo", this._keyPressed);
      }
    });

    window.addEventListener("keyup", (e) => {
      if (this.isArrowInput(e.code)) {
        this._keyPressed.delete(e.code);
        console.log("yolo", this._keyPressed);
      }
    });
  }

  private isArrowInput(input: string): boolean {
    if (input.startsWith("Arrow")) return true;
    return false;
  }
}
