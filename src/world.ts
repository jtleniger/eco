import p5 from 'p5'
import Food from './food'
import { DNA } from './organism/genetics/dna'
import Prey from './organism/prey'

class World {
  private static readonly MAX_FOOD: number = 50

  sketch: p5
  food: Food[]
  foodTimer: number | null = null
  prey: Prey[]
  ticks: number = 0
  stats: Map<string, number> = new Map()

  constructor(sketch: p5) {
    this.food = []
    this.prey = []
    this.sketch = sketch
    this.stats.set('born', 0)
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
    for (let i = 0; i < 5; i++) {
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

    this.sketch.push()
    this.sketch.textSize(12)
    this.sketch.textAlign(this.sketch.LEFT, this.sketch.TOP)
    this.sketch.fill('#1f0e1c')
    this.sketch.text(`ticks: ${this.ticks}`, 2, 2)

    let stats = ''
    this.stats.forEach((v, k) => {
      stats += `${k}: ${v}\n`
    })

    this.sketch.text(stats, 100, 2)

    this.sketch.pop()
  }

  update(): void {
    this.stats.set('alive', this.prey.length)

    if (this.sketch.frameCount % 60 === 0) {
      this.ticks++
    }

    this.prey.forEach((c) => c.update())

    if (this.foodTimer !== null) {
      return
    }

    this.foodTimer = window.setTimeout(() => {
      this.foodTimer = null
      this.growFood()
    }, Math.abs(this.sketch.randomGaussian(4) * 500))
  }
}

export default World
