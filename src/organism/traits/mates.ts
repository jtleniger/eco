import type p5 from 'p5'
import type World from '../../world'
import { GeneType } from '../genetics/genes/geneType'
import type IOrganism from '../iOrganism'
import State from '../state'
import type Drive from './drive'

class Mates implements Drive {
  private readonly pos: p5.Vector
  private readonly world: World
  private readonly state: Set<State>
  private readonly organism: IOrganism
  private readonly mates: IOrganism[]
  private _direction: p5.Vector | null
  private nearbyMate: IOrganism | null = null
  private cooldown: number

  constructor(organism: IOrganism, mates: IOrganism[]) {
    this.pos = organism.pos
    this._direction = null
    this.state = organism.state
    this.cooldown = 0
    this.organism = organism
    this.world = this.organism.world
    this.mates = mates
  }

  direction = (): p5.Vector | null => {
    if (!this.state.has(State.Mating)) {
      return null
    }

    return this._direction
  }

  update = (): void => {
    if (this.cooldown >= this.organism.dna.getValue(GeneType.MateCooldown)) {
      this.state.add(State.Available)
    } else {
      this.cooldown++
    }

    if (this.state.has(State.Mating) && this.nearbyMate !== null) {
      this.tryMate()
      return
    }

    const fedPercentage = Math.round(
      (this.organism.eats.fed / this.organism.dna.getValue(GeneType.Full)) * 100
    )

    if (
      this.organism.health.age > this.organism.dna.getValue(GeneType.MaxAgeToMate) ||
      this.organism.health.age < this.organism.dna.getValue(GeneType.MinAgeToMate) ||
      fedPercentage < this.organism.dna.getValue(GeneType.MinFedPercentageToMate)
    ) {
      this.state.delete(State.Available)
      this.state.delete(State.Mating)
      return
    }

    if (!this.state.has(State.Available)) {
      return
    }

    const maybeMate = this.nearestMate()

    if (maybeMate === null) {
      return
    }

    this.state.add(State.Mating)
    this.nearbyMate = maybeMate
  }

  beforeDraw = (sketch: p5): void => {
    if (this.state.has(State.Mating)) {
      sketch.push()
      sketch.stroke('#d26471')
      sketch.strokeWeight(4)
      sketch.point(this.pos.x, this.pos.y - 20)
      sketch.point(this.pos.x - 2, this.pos.y - 22)
      sketch.point(this.pos.x + 2, this.pos.y - 22)
      sketch.pop()
    }
  }

  private tryMate(): void {
    if (this.nearbyMate === null) {
      return
    }

    if (!this.nearbyMate.state.has(State.Available)) {
      this.end()
      return
    }

    const m = this.nearbyMate

    if (this.organism.near(m.pos)) {
      this.state.delete(State.Available)
      m.state.delete(State.Available)

      this.end()
      m.mates.end()
      this.organism.rests.start()
      m.rests.start()

      this.world.addFrog(
        this.pos.copy(),
        this.organism.dna.mix(m.dna),
        this.organism.generation + 1
      )

      return
    }

    this._direction = this.nearbyMate.pos.copy().sub(this.pos).normalize()
  }

  private nearestMate(): IOrganism | null {
    let minDistance = Infinity
    let creature = null

    this.mates.forEach((m) => {
      if (m.mates === this) {
        return
      }

      if (!m.state.has(State.Available)) {
        return
      }

      const distance = m.pos.dist(this.pos)

      if (distance > this.organism.dna.getValue(GeneType.MateRange)) {
        return
      }

      if (distance < minDistance) {
        minDistance = distance
        creature = m
      }
    })

    return creature
  }

  private end(): void {
    this.nearbyMate = null
    this.cooldown = 0
    this.state.delete(State.Mating)
  }
}

export default Mates
