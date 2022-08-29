import type IEdible from '@/iEdible'
import p5 from 'p5'
import { Clock } from '../../utilities'
import type World from '../../world'
import { GeneType } from '../genetics/genes/geneType'
import type IOrganism from '../iOrganism'
import State from '../state'
import type Drive from './drive'

class Eats implements Drive {
  private readonly world: World
  private readonly pos: p5.Vector
  private readonly state: Set<State>
  private readonly organism: IOrganism
  private readonly clock: Clock
  private readonly food: IEdible[]

  fed: number

  private nearbyFood: IEdible | null = null
  private _direction: p5.Vector

  constructor(organism: IOrganism, food: IEdible[]) {
    this.organism = organism
    this.pos = this.organism.pos
    this._direction = new p5.Vector()
    this.state = this.organism.state
    this.fed = Math.round(this.organism.dna.getValue(GeneType.Full) / 2)
    this.world = this.organism.world
    this.clock = new Clock(this.world.speed, this.decFed.bind(this))
    this.food = food
  }

  direction = (): [State, p5.Vector] | null => {
    if (
      this.state.has(State.Hunting) &&
      !this.state.has(State.Mating) &&
      !this.state.has(State.Resting)
    ) {
      return [State.Hunting, this._direction]
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

    this._direction = this.nearbyFood.pos.copy().sub(this.pos).normalize()

    if (this.organism.near(this.nearbyFood.pos)) {
      this.eat()
      this.end()
    }
  }

  private eat(): void {
    if (this.nearbyFood === null) {
      return
    }

    this.nearbyFood.eat()
    this.fed += this.organism.dna.getValue(GeneType.FoodValue)
    this.organism.health.resetStarvation()

    if (this.fed > this.organism.dna.getValue(GeneType.Full)) {
      this.fed = this.organism.dna.getValue(GeneType.Full)
    }
  }

  private nearestFood(): IEdible | null {
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
