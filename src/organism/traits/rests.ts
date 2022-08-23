import p5 from 'p5'
import GeneType from '../genetics/genes/geneType'
import Organism from '../organism'
import State from '../state'
import Drive from './drive'

class Rests implements Drive {
  private readonly organism: Organism
  private readonly state: Set<State>

  private energy: number = 0
  private _direction: p5.Vector | null
  private timeout: number | null = null

  constructor(organism: Organism) {
    this._direction = null
    this.organism = organism
    this.state = this.organism.state
  }

  direction(): p5.Vector | null {
    if (!this.state.has(State.Hunting) && !this.state.has(State.Mating)) {
      return this._direction
    }

    return null
  }

  update = (): void => {
    if (this.state.has(State.Resting)) {
      return
    }

    this.energy--

    if (this.energy <= 0) {
      this.start()
    }
  }

  start(): void {
    if (this.timeout !== null) {
      window.clearTimeout(this.timeout)
    }

    this.state.add(State.Resting)
    this._direction = null
    this.timeout = window.setTimeout(() => {
      this.end()
    }, this.organism.dna.getValue(GeneType.RestTime) * 1000)
  }

  end(): void {
    this.energy = this.organism.dna.getValue(GeneType.MaxEnergy)
    this.state.delete(State.Resting)
    this._direction = p5.Vector.random2D()
  }
}

export default Rests
