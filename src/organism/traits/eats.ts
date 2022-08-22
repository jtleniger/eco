import p5 from 'p5'
import Food from '../../food'
import Eat from '../genes/eat'
import State from '../state'
import Behavior from './behavior'

class Eats implements Behavior {
  private readonly gene: Eat
  private readonly pos: p5.Vector
  private readonly food: Food[]
  private readonly state: Set<State>

  private nearbyFood: Food | null = null
  private hunger: number = 0
  private _direction: p5.Vector | null = null

  constructor(gene: Eat, pos: p5.Vector, state: Set<State>, food: Food[]) {
    this.gene = gene
    this.pos = pos
    this._direction = null
    this.food = food
    this.state = state
  }

  direction = (): p5.Vector | null => {
    if (
      this.state.has(State.Hunting) &&
      !this.state.has(State.Mating) &&
      !this.state.has(State.Resting)
    ) {
      return this._direction
    }

    return null
  }

  update = (): void => {
    this.hunger++

    if (this.state.has(State.Mating)) {
      this.end()
      return
    }

    if (this.state.has(State.Hunting) && this.nearbyFood !== null) {
      this.tryEat()
      return
    }

    const maybeFood = this.nearestFood()

    if (maybeFood === null) {
      return
    }

    this.state.add(State.Hunting)
    this.nearbyFood = maybeFood
    this._direction = this.nearbyFood.pos.copy().sub(this.pos).normalize()
  }

  private tryEat(): void {
    if (this.nearbyFood === null) {
      return
    }

    if (this.nearbyFood.eaten) {
      this.end()
      return
    }

    const dist = this.pos.dist(this.nearbyFood.pos)

    if (dist < this.gene.eatRange) {
      this.eat()
      this.end()
    }
  }

  private eat(): void {
    if (this.nearbyFood === null) {
      return
    }

    this.nearbyFood.eaten = true
    this.hunger -= this.gene.foodValue

    if (this.hunger < 0) {
      this.hunger = 0
    }
  }

  private nearestFood(): Food | null {
    let minDistance = Infinity
    let food = null

    this.food.forEach((f) => {
      if (f.eaten) {
        return
      }

      const distance = f.pos.dist(this.pos)

      if (distance > this.gene.huntRange) {
        return
      }

      if (distance < minDistance) {
        minDistance = distance
        food = f
      }
    })

    return food
  }

  private end(): void {
    this.nearbyFood = null
    this.state.delete(State.Hunting)
  }
}

export default Eats
