import p5 from 'p5'
import World from './world'

function RandomInt(low: number, high: number): number {
  const range = high - low

  return low + Math.round(Math.random() * range)
}

function RandomSketchPos(sketch: p5): p5.Vector {
  return sketch.createVector(sketch.random(sketch.width), sketch.random(sketch.height))
}

export class Clock {
  private lastTick: number
  private readonly world: World
  private readonly onTick: () => void

  constructor(world: World, onTick: () => void) {
    this.world = world
    this.lastTick = this.world.ticks
    this.onTick = onTick
  }

  update(): void {
    if (this.lastTick < this.world.ticks) {
      this.onTick()
      this.lastTick = this.world.ticks
    }
  }
}

export { RandomSketchPos, RandomInt }
