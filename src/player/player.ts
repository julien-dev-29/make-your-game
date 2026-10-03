export class Player {
  private _hDir = 1;
  private _vDir = 1;
  private _speed = 200;
  private _name: string;
  private _position: { x: number; y: number };

  constructor(name: string, position: { x: number; y: number }) {
    this._name = name;
    this._position = position;
  }

  update(deltaTime: number): void {

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
