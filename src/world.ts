import p5 from 'p5'
import Food from './food'
import Creature from './creature'

class World {
  sketch: p5
  food: Food[]
  foodTimer: number | null
  creatures: Creature[]

  constructor (sketch: p5) {
    this.food = []
    this.creatures = []
    this.foodTimer = null
    this.sketch = sketch
  }

  initFood (): void {
    for (let i = 0; i < 50; i++) {
      this.growFood()
    }
  }

  growFood (): void {
    const pos = this.sketch.createVector(this.sketch.random(this.sketch.width), this.sketch.random(this.sketch.height))
    const f = new Food(this.sketch, pos)
    this.food.push(f)
  }

  eatFood (food: Food): void {
    const index = this.food.indexOf(food)

    if (index < 0) {
      return
    }

    this.food.splice(index, 1)

    food.eaten = true
  }

  kill (creature: Creature): void {
    const index = this.creatures.indexOf(creature)

    this.creatures.splice(index, 1)
  }

  spawnCreatures (): void {
    for (let i = 0; i < 6; i++) {
      const pos = this.sketch.createVector(this.sketch.random(this.sketch.width), this.sketch.random(this.sketch.height))
      this.creatures.push(new Creature(this.sketch, this, pos))
    }
  }

  draw (): void {
    this.food.forEach(f => f.draw())
    this.creatures.forEach(c => c.draw())
  }

  update (): void {
    this.creatures.forEach(c => c.update())

    if (this.foodTimer === null) {
      return
    }

    this.foodTimer = window.setTimeout(() => {
      this.foodTimer = null
      this.growFood()
    }, this.sketch.randomGaussian(5) * 1000)
  }
}

export default World