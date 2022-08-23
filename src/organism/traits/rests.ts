import p5 from 'p5'
import { Rest as Gene } from '../genetics/genes'
import Organism from '../organism'
import State from '../state'
import Drive from './drive'

class Rests implements Drive {
  private readonly gene: Gene
  private readonly state: Set<State>

  private energy: number = 0
  private _direction: p5.Vector | null
  private timeout: number | null = null

  constructor(gene: Gene, organism: Organism) {
    this.gene = gene
    this._direction = null
    this.state = organism.state
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
    }, this.gene.restDurationSec * 1000)
  }

  end(): void {
    this.energy = this.gene.maxEnergy
    this.state.delete(State.Resting)
    this._direction = p5.Vector.random2D()
  }
}

export default Rests
