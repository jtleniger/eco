import { Clock } from '../../utilities'
import World from '../../world'
import { Health as Gene } from '../genetics/genes'
import Organism from '../organism'

class Health {
  age: number = 0
  starvation: number = 0

  private readonly gene: Gene
  private readonly organism: Organism
  private readonly world: World
  private readonly clock: Clock

  constructor(gene: Gene, organism: Organism) {
    this.gene = gene
    this.organism = organism
    this.world = this.organism.world
    this.clock = new Clock(this.world, this.incAge.bind(this))
  }

  update(): void {
    this.clock.update()
  }

  incStarvation(): void {
    this.starvation++

    if (this.starvation > this.gene.maxStarvation) {
      this.organism.die()
    }
  }

  incAge(): void {
    this.age++

    if (this.age > this.gene.maxAge) {
      this.organism.die()
    }
  }

  resetStarvation(): void {
    this.starvation = 0
  }

  toString(): string {
    return `age: ${this.age}\nstarvation:${this.starvation}\n`
  }
}

export default Health
