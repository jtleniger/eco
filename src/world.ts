import p5 from 'p5'
import Food from './food'
import Prey from './organism/prey'

class World {
  private static readonly MAX_FOOD: number = 50

  sketch: p5
  food: Food[]
  foodTimer: number | null = null
  prey: Prey[]

  constructor(sketch: p5) {
    this.food = []
    this.prey = []
    this.sketch = sketch
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

  kill(creature: Prey): void {
    const index = this.prey.indexOf(creature)

    this.prey.splice(index, 1)
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

  addCreature(pos: p5.Vector): void {
    this.prey.push(new Prey(this.sketch, this, pos))
  }

  draw(): void {
    this.food.forEach((f) => f.draw())
    this.prey.forEach((c) => c.draw())
  }

  update(): void {
    this.prey.forEach((c) => c.update())

    if (this.foodTimer !== null) {
      return
    }

    this.foodTimer = window.setTimeout(() => {
      this.foodTimer = null
      this.growFood()
    }, this.sketch.randomGaussian(5) * 500)
  }
}

export default World
