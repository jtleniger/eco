import p5 from 'p5'
import Sprite from '../sprite'
import State from './state'
import Rests from './traits/rests'
import Behavior from './traits/behavior'
import World from '../world'
import DNA from './genes/dna'
import Eats from './traits/eats'
import Mates from './traits/mates'

class Prey extends Sprite {
  private static readonly MATE_SEARCH_RADIUS = 256

  private static readonly STATES = {
    Hunting: 0,
    Resting: 1,
    Mating: 2,
    Available: 3,
  } as const

  get imgPath(): string {
    return 'assets/creature.png'
  }

  world: World
  nearbyMate: Prey | null
  direction: p5.Vector
  unavailableTimer: number | null
  state: Set<number>
  newState: Set<State>
  dna: DNA = DNA.Default()

  private readonly traits: Behavior[]

  constructor(sketch: p5, world: World, pos: p5.Vector) {
    super(sketch, pos)
    this.world = world
    this.traits = [
      new Rests(this.dna.rest),
      new Eats(this.dna.eat, this.pos, this.world.food),
      new Mates(this.dna.mate, this.pos, this.world.prey),
    ]
    this.reset()
  }

  reset(): void {
    this.state = new Set()
    this.newState = new Set()
    this.unavailableTimer = null
    this.nearbyMate = null
    this.unavailableTimer = null
  }

  update(): void {
    for (const t of this.traits) {
      t.update(this.newState)
    }
    // this.mate()
    // this.health()
    this.move()
  }

  // draw(): void {
  //   if (this.state.has(Creature.STATES.Mating)) {
  //     const grey = this.sketch.map(this.fed, 0, 10, 0, 192)
  //     this.sketch.tint(255, grey, grey)
  //   } else {
  //     this.sketch.tint(this.sketch.map(this.fed, 0, 10, 0, 255))
  //   }

  //   super.draw()
  //   this.sketch.noTint()
  // }

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
    const dirs = this.traits.map((t) => t.direction(this.newState)).filter((d) => d !== null)

    if (dirs.length > 1) {
      throw Error('received multiple candidate directions')
    }

    const dir = dirs[0]

    if (dir === null || dir === undefined) {
      return
    }

    this.direction = dir

    if (
      this.pos.x >= this.sketch.width ||
      this.pos.x <= 0 ||
      this.pos.y >= this.sketch.height ||
      this.pos.y <= 0
    ) {
      this.direction.rotate(this.sketch.radians(180))
    }

    this.pos.add(this.direction)

    this.pos.x = this.sketch.constrain(this.pos.x, 0, this.sketch.width)
    this.pos.y = this.sketch.constrain(this.pos.y, 0, this.sketch.height)
  }
}

export default Prey
