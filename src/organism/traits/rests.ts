import p5 from 'p5'
import Rest from '../genes/rest'
import State from '../state'
import Behavior from './behavior'

class Rests implements Behavior {
  private readonly gene: Rest
  private readonly state: Set<State>

  private energy: number = 0
  private _direction: p5.Vector | null

  constructor(gene: Rest, state: Set<State>) {
    this.gene = gene
    this._direction = null
    this.state = state
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
      this.state.add(State.Resting)
      this._direction = null
      window.setTimeout(() => {
        this.end()
      }, this.gene.restDurationSec * 1000)
    }
  }

  end(): void {
    this.energy = this.gene.maxEnergy
    this.state.delete(State.Resting)
    this._direction = p5.Vector.random2D()
  }
}

export default Rests
