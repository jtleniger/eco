import p5 from 'p5'
import Food from './food'
import Creature from './creature'

class World {
  private static readonly MAX_FOOD: number = 50

  sketch: p5
  food: Food[]
  foodTimer: number | null = null
  creatures: Creature[]

  constructor(sketch: p5) {
    this.food = []
    this.creatures = []
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

  kill(creature: Creature): void {
    const index = this.creatures.indexOf(creature)

    this.creatures.splice(index, 1)
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
    this.creatures.push(new Creature(this.sketch, this, pos))
  }

  draw(): void {
    this.food.forEach((f) => f.draw())
    this.creatures.forEach((c) => c.draw())
  }

  update(): void {
    this.creatures.forEach((c) => c.update())

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
