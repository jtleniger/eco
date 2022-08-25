import type p5 from 'p5'
import Food from './food'
import type { DNA } from './organism/genetics/dna'
import Prey from './organism/prey'
import Speed from './speed'
import { Clock } from './utilities'

class World {
  private static readonly MAX_FOOD: number = 50

  sketch: p5
  food: Food[]
  foodTimer: number | null = null
  prey: Prey[]
  frames: number = 0
  stats: Map<string, number> = new Map()
  speed: Speed = new Speed()
  foodClock: Clock

  constructor(sketch: p5) {
    this.food = []
    this.prey = []
    this.sketch = sketch
    this.stats.set('born', 0)
    this.foodClock = new Clock(this.speed, this.growFood.bind(this), 0.4)
  }

  initFood(): void {
    for (let i = 0; i < World.MAX_FOOD; i++) {
      const f = new Food(this.sketch)
      this.food.push(f)
    }
  }

  growFood(): void {
    const f = this.food.find((f) => f.eaten)

    if (f !== undefined) {
      f.reset()
    }
  }

  kill(creature: Prey, reason: string): void {
    const index = this.prey.indexOf(creature)

    this.prey.splice(index, 1)

    if (!this.stats.has(reason)) {
      this.stats.set(reason, 1)
    } else {
      const prev = this.stats.get(reason) as number
      this.stats.set(reason, prev + 1)
    }
  }

  spawnCreatures(): void {
    for (let i = 0; i < 10; i++) {
      const pos = this.sketch.createVector(
        this.sketch.random(this.sketch.width),
        this.sketch.random(this.sketch.height)
      )

      this.addCreature(pos)
    }
  }

  addCreature(pos: p5.Vector, dna?: DNA, generation?: number): void {
    this.prey.push(new Prey(this.sketch, this, pos, dna, generation))
    const prev = this.stats.get('born') as number
    this.stats.set('born', prev + 1)
  }

  draw(): void {
    this.food.forEach((f) => f.draw())
    this.prey.forEach((c) => c.draw())
  }

  update(): void {
    this.stats.set('alive', this.prey.length)

    Clock.setFrames(this.sketch.frameCount)

    this.prey.forEach((c) => c.update())

    if (this.foodTimer !== null) {
      return
    }

    this.foodTimer = window.setTimeout(() => {
      this.foodTimer = null
      this.growFood()
    }, Math.abs(this.sketch.randomGaussian(4) * 100))
  }
}

export default World
