import { Clock } from '../../utilities'
import type World from '../../world'
import { GeneType } from '../genetics/genes/geneType'
import type IOrganism from '../iOrganism'

class Health {
  age: number = 0
  starvation: number = 0

  private readonly organism: IOrganism
  private readonly world: World
  private readonly clock: Clock

  constructor(organism: IOrganism) {
    this.organism = organism
    this.world = this.organism.world
    this.clock = new Clock(this.world.speed, this.incAge.bind(this))
  }

  update(): void {
    this.clock.update()
  }

  incStarvation(): void {
    this.starvation++

    if (this.starvation > this.organism.dna.getValue(GeneType.MaxStarvation)) {
      this.organism.die('starved')
    }
  }

  incAge(): void {
    this.age++

    if (this.age > this.organism.dna.getValue(GeneType.MaxAge)) {
      this.organism.die('died of old age')
    }
  }

  resetStarvation(): void {
    this.starvation = 0
  }

  get stats(): [string, number][] {
    return [
      ['age', this.age],
      ['starvation', this.starvation],
    ]
  }
}

export default Health
