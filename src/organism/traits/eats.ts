import type Edible from '@/edible'
import type p5 from 'p5'
import { Clock } from '../../utilities'
import type World from '../../world'
import { GeneType } from '../genetics/genes/geneType'
import type Organism from '../organism'
import State from '../state'
import type Drive from './drive'

class Eats<Food extends Edible> implements Drive {
  private readonly world: World
  private readonly pos: p5.Vector
  private readonly state: Set<State>
  private readonly organism: Organism
  private readonly clock: Clock
  private readonly food: Food[]

  fed: number

  private nearbyFood: Food | null = null
  private _direction: p5.Vector | null = null

  constructor(organism: Organism, food: Food[]) {
    this.organism = organism
    this.pos = this.organism.pos
    this._direction = null
    this.state = this.organism.state
    this.fed = Math.round(this.organism.dna.getValue(GeneType.Full) / 2)
    this.world = this.organism.world
    this.clock = new Clock(this.world.speed, this.decFed.bind(this))
    this.food = food
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
    this.clock.update()

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

  get stats(): [string, number][] {
    return [['fed', this.fed]]
  }

  private decFed(): void {
    this.fed--

    if (this.fed <= 0) {
      this.organism.health.incStarvation()
      this.fed = 0
    }
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

    if (dist < 16) {
      this.eat()
      this.end()
    }
  }

  private eat(): void {
    if (this.nearbyFood === null) {
      return
    }

    this.nearbyFood.eaten = true
    this.fed += this.organism.dna.getValue(GeneType.FoodValue)
    this.organism.health.resetStarvation()

    if (this.fed > this.organism.dna.getValue(GeneType.Full)) {
      this.fed = this.organism.dna.getValue(GeneType.Full)
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

      if (distance > this.organism.dna.getValue(GeneType.HuntRange)) {
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
