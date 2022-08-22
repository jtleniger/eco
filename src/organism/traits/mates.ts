import p5 from 'p5'
import Mate from '../genes/mate'
import Prey from '../prey'
import State from '../state'
import Behavior from './behavior'

class Mates implements Behavior {
  private readonly gene: Mate
  private readonly pos: p5.Vector
  private readonly potentialMates: Prey[]

  private _direction: p5.Vector | null
  private nearbyMate: Prey | null = null

  constructor(gene: Mate, pos: p5.Vector, potentialMates: Prey[]) {
    this.gene = gene
    this.pos = pos
    this._direction = null
    this.potentialMates = potentialMates
  }

  direction = (state: Set<State>): p5.Vector | null => {
    return null
  }

  update = (state: Set<State>): void => {
    // if (!state.has(Prey.STATES.Available)) {
    //   return
    // }

    if (state.has(State.Mating) && this.nearbyMate !== null) {
      this.tryMate(state)
      return
    }

    const maybeMate = this.nearestMate()

    if (maybeMate === null) {
      return
    }

    // state.add(State.Mating)
    this.nearbyMate = maybeMate
  }

  private tryMate(state: Set<State>): void {
    if (this.nearbyMate === null) {
      return
    }

    // if (!this.nearbyMate.newState.has(Prey.STATES.Available)) {
    //   this.endMate()
    //   return
    // }

    const m = this.nearbyMate

    const dist = this.pos.dist(m.pos)

    if (dist < this.gene.mateRange) {
      // state.delete(Prey.STATES.Available)
      // m.state.delete(Prey.STATES.Available)

      this.end(state)
      // m.end()

      // this.world.addCreature(this.pos.copy())

      return
    }

    this._direction = this.nearbyMate.pos.copy().sub(this.pos).normalize()
  }

  private nearestMate(): Prey | null {
    let minDistance = Infinity
    let creature = null

    this.potentialMates.forEach((m) => {
      // if (m === this) {
      //   return
      // }

      // if (!m.state.has(Prey.STATES.Available)) {
      //   return
      // }

      const distance = m.pos.dist(this.pos)

      if (distance > this.gene.searchRange) {
        return
      }

      if (distance < minDistance) {
        minDistance = distance
        creature = m
      }
    })

    return creature
  }

  private end(state: Set<State>): void {
    this.nearbyMate = null
    state.delete(State.Mating)
  }
}

export default Mates
