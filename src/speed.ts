export default class Speed {
  private _speed: number

  constructor() {
    this._speed = 1
  }

  set(speed: number): void {
    this._speed = speed
  }

  get current(): number {
    return this._speed
  }

  get percent(): number {
    return this._speed * 100
  }
}
