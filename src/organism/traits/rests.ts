import p5 from 'p5'
import Rest from '../genes/rest'
import State from '../state'
import Behavior from './behavior'

class Rests implements Behavior {
  private energy: number = 0
  private readonly gene: Rest
  private _direction: p5.Vector | null

  constructor(gene: Rest) {
    this.gene = gene
    this._direction = null
  }

  direction(state: Set<State>): p5.Vector | null {
    if (!state.has(State.Hunting)) {
      return this._direction
    }

    return null
  }

  update = (state: Set<State>): void => {
    if (state.has(State.Resting)) {
      return
    }

    this.energy--

    if (this.energy <= 0) {
      state.add(State.Resting)
      this._direction = null
      window.setTimeout(() => {
        this.end(state)
      }, this.gene.restDurationSec * 1000)
    }
  }

  end(state: Set<State>): void {
    this.energy = this.gene.maxEnergy
    state.delete(State.Resting)
    this._direction = p5.Vector.random2D()
  }
}

export default Rests
