import p5 from 'p5'
import Sprite from '../sprite'
import State from './state'
import Rests from './traits/rests'
import Behavior from './traits/behavior'
import World from '../world'
import DNA from './genes/dna'
import Eats from './traits/eats'
import Mates from './traits/mates'
import Organism from './organism'

class Prey extends Sprite implements Organism {
  get imgPath(): string {
    return 'assets/creature.png'
  }

  world: World
  state: Set<State> = new Set()
  dna: DNA = DNA.Default(typeof Prey)
  mateBehavior: Mates
  restBehavior: Rests
  eatBehavior: Eats

  private readonly traits: Behavior[]

  constructor(sketch: p5, world: World, pos: p5.Vector, dna?: DNA) {
    super(sketch, pos)
    this.world = world

    if (dna !== undefined) {
      this.dna = dna
    }

    this.restBehavior = new Rests(this.dna.rest, this.state)
    this.eatBehavior = new Eats(this.dna.eat, this.pos, this.state, this.world.food)
    this.mateBehavior = new Mates(this.dna.mate, this, this.world)
    this.traits = [this.restBehavior, this.eatBehavior, this.mateBehavior]
  }

  reset(): void {
    this.state.clear()
  }

  update(): void {
    for (const t of this.traits) {
      t.update(this.state)
    }

    this.move()
  }

  draw(): void {
    for (const t of this.traits) {
      if (t.beforeDraw !== undefined) {
        t.beforeDraw(this.sketch)
      }
    }

    super.draw()

    for (const t of this.traits) {
      if (t.afterDraw !== undefined) {
        t.afterDraw(this.sketch)
      }
    }
  }

  health(): void {
    // if (this.fed === 0) {
    //   this.world.kill(this)
    // }
    // if (this.fed < 7) {
    //   this.state.delete(Creature.STATES.Mating)
    //   this.state.delete(Creature.STATES.Available)
    // } else if (this.unavailableTimer === null) {
    //   this.state.add(Creature.STATES.Available)
    // }
  }

  move(): void {
    const dirs = this.traits.map((t) => t.direction(this.state)).filter((d) => d !== null)

    if (dirs.length > 1) {
      throw Error('received multiple candidate directions')
    }

    if (dirs.length === 0 || dirs[0] === null || dirs[0] === undefined) {
      return
    }

    const direction = dirs[0].copy()

    if (
      this.pos.x >= this.sketch.width ||
      this.pos.x <= 0 ||
      this.pos.y >= this.sketch.height ||
      this.pos.y <= 0
    ) {
      direction.rotate(this.sketch.radians(180))
    }

    this.pos.add(direction)

    this.pos.x = this.sketch.constrain(this.pos.x, 0, this.sketch.width)
    this.pos.y = this.sketch.constrain(this.pos.y, 0, this.sketch.height)
  }
}

export default Prey
