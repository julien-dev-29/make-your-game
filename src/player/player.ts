export class Player {

  private _name: string;
  private _position: { x: number; y: number };
  private _pressedKeys: Set<string>;

  constructor(
    name: string,
    position: { x: number; y: number },
    pressedKey: Set<string>,
  ) {
    this._name = name;
    this._position = position;
    this._pressedKeys = pressedKey;
  }

  update(): void {
    if (this._pressedKeys.has("ArrowLeft")) {
      this._position.x += 1;
    }
    if (this._pressedKeys.has("ArrowRight")) {
      this.position.y += 1;
    }
  }

  public get name(): string {
    return this._name;
  }

  public set name(name: string) {
    this.name = name;
  }

  public get position(): { x: number; y: number } {
    return this._position;
  }

  public set position(position: { x: number; y: number }) {
    this._position = position;
  }
}
