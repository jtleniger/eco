import p5 from 'p5'
import { Clock } from '../../utilities'
import { GeneType } from '../genetics/genes/geneType'
import Organism from '../organism'
import State from '../state'
import Drive from './drive'

class Rests implements Drive {
  private readonly organism: Organism
  private readonly state: Set<State>

  private energy: number = 0
  private _direction: p5.Vector | null
  private remaining: number
  private readonly restClock: Clock
  private readonly energyClock: Clock

  constructor(organism: Organism) {
    this._direction = null
    this.organism = organism
    this.state = this.organism.state
    this.remaining = this.organism.dna.getValue(GeneType.RestTime)
    this.restClock = new Clock(this.organism.world.speed, this.decRest.bind(this))
    this.energyClock = new Clock(this.organism.world.speed, this.decEnergy.bind(this))
  }

  direction(): p5.Vector | null {
    if (!this.state.has(State.Hunting) && !this.state.has(State.Mating)) {
      return this._direction
    }

    return null
  }

  update = (): void => {
    this.restClock.update()
    this.energyClock.update()
  }

  start(): void {
    this.remaining = this.organism.dna.getValue(GeneType.RestTime)
    this.state.add(State.Resting)
    this._direction = null
  }

  end(): void {
    this.energy = this.organism.dna.getValue(GeneType.MaxEnergy)
    this.state.delete(State.Resting)
    this._direction = p5.Vector.random2D()
  }

  toString(): string {
    return `energy: ${this.energy}\nremaining rest: ${this.remaining}\n`
  }

  private decRest(): void {
    if (!this.state.has(State.Resting)) {
      return
    }

    this.remaining--

    if (this.remaining <= 0) {
      this.end()
    }
  }

  private decEnergy(): void {
    if (this.state.has(State.Resting)) {
      return
    }

    this.energy--

    if (this.energy <= 0) {
      this.start()
    }
  }
}

export default Rests
