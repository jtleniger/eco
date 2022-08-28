import type p5 from 'p5'
import Food from './food'
import type { DNA } from './organism/genetics/dna'
import { OrganismType } from './organism/organismType'
import Prey from './organism/prey'
import Speed from './speed'
import type Stats from './stats'
import { Clock } from './utilities'

class World {
  private static readonly MAX_FOOD: number = 50

  sketch: p5
  food: Food[]
  foodTimer: number | null = null
  prey: Prey[]
  frames: number = 0
  speed: Speed = new Speed()
  foodClock: Clock
  stats: Stats
  userDna: Map<OrganismType, DNA> = new Map()

  constructor(sketch: p5, stats: Stats) {
    this.food = []
    this.prey = []
    this.sketch = sketch
    this.foodClock = new Clock(this.speed, this.growFood.bind(this), 0.4)
    this.stats = stats
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

    this.stats.increment(reason)
  }

  spawnCreatures(): void {
    for (let i = 0; i < 10; i++) {
      const pos = this.sketch.createVector(
        this.sketch.random(this.sketch.width),
        this.sketch.random(this.sketch.height)
      )

      this.addCreature(pos, this.userDna.get(OrganismType.Prey))
    }
  }

  addCreature(pos: p5.Vector, dna?: DNA, generation?: number): void {
    this.prey.push(new Prey(this.sketch, this, pos, dna, generation))
    this.stats.increment('born')
  }

  draw(): void {
    this.food.forEach((f) => f.draw())
    this.prey.forEach((c) => c.draw())
  }

  update(): void {
    this.stats.set('alive', this.prey.length)

    Clock.setFrames(this.sketch.frameCount)
    this.foodClock.update()

    this.prey.forEach((c) => c.update())

    if (this.foodTimer !== null) {
      return
    }
  }
}

export default World
