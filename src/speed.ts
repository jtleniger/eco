export default class Speed {
  private _speed: number
  private _running: boolean

  constructor() {
    this._speed = 1
    this._running = false
  }

  set(speed: number): void {
    this._speed = speed
  }

  setRunning(running: boolean): void {
    this._running = running
  }

  get running(): boolean {
    return this._running
  }

  get current(): number {
    return this._speed
  }

  get percent(): number {
    return this._speed * 100
  }
}
