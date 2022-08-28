import type p5 from 'p5'
import type Speed from './speed'

export function RandomInt(low: number, high: number): number {
  const range = high - low

  return low + Math.round(Math.random() * range)
}

export function RandomSketchPos(sketch: p5): p5.Vector {
  return sketch.createVector(sketch.random(sketch.width), sketch.random(sketch.height))
}

export function EnumEntries(e: { [id: number]: string }): string[] {
  return Object.keys(e).filter((key) => isNaN(Number(key)))
}

export class Clock {
  static frame: number = 0
  static scale: number = 100
  private readonly speed: Speed
  private readonly onTick: () => void
  private readonly interval: number

  constructor(speed: Speed, onTick: () => void, interval?: number) {
    this.speed = speed
    this.onTick = onTick
    this.interval = Math.round(((interval === undefined ? 1 : interval) * 60) / this.speed.current)
  }

  update(): void {
    if (Clock.frame % this.interval === 0 && this.speed.running) {
      this.onTick()
    }
  }

  static setFrames(frame: number): void {
    Clock.frame = frame
  }
}
