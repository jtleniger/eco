import p5 from 'p5'
import Sprite from './sprite'
import State from './state'
import Rests from './traits/rests'
import Behavior from './traits/behavior'
import World from './world'
import DNA from './genes/dna'
import Eats from './traits/eats'

class Creature extends Sprite {
  private static readonly FOOD_SEARCH_RADIUS = 256
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
  nearbyMate: Creature | null
  direction: p5.Vector
  unavailableTimer: number | null
  state: Set<number>
  newState: Set<State>
  dna: DNA = DNA.Default()

  private readonly traits: Behavior[]

  constructor(sketch: p5, world: World, pos: p5.Vector) {
    super(sketch, pos)
    this.world = world
    this.traits = [new Rests(this.dna.rest), new Eats(this.dna.eat, this.pos, this.world.food)]
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

  /*
   * STATE METHODS
   */

  mate(): void {
    if (!this.state.has(Creature.STATES.Available)) {
      return
    }

    if (this.state.has(Creature.STATES.Mating) && this.nearbyMate !== null) {
      this.tryMate()
      return
    }

    const maybeMate = this.nearestMate()

    if (maybeMate === null) {
      return
    }

    this.state.add(Creature.STATES.Mating)
    this.nearbyMate = maybeMate
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

  /*
   * HELPER METHODS
   */

  nearestMate(): Creature | null {
    let minDistance = Infinity
    let creature = null

    this.world.creatures.forEach((c) => {
      if (c === this) {
        return
      }

      if (!c.state.has(Creature.STATES.Available)) {
        return
      }

      const distance = c.pos.dist(this.pos)

      if (distance > Creature.MATE_SEARCH_RADIUS) {
        return
      }

      if (distance < minDistance) {
        minDistance = distance
        creature = c
      }
    })

    return creature
  }

  setMateDirection(): void {
    if (this.nearbyMate === null) {
      return
    }

    this.direction = this.nearbyMate.pos.copy().sub(this.pos).normalize()
  }

  tryMate(): void {
    if (this.nearbyMate === null) {
      return
    }

    if (!this.nearbyMate.state.has(Creature.STATES.Available)) {
      this.endMate()
      return
    }

    const m = this.nearbyMate

    const dist = this.pos.dist(m.pos)

    if (dist < this.img.width) {
      this.state.delete(Creature.STATES.Available)
      m.state.delete(Creature.STATES.Available)

      this.unavailableTimer = window.setTimeout(() => {
        this.unavailableTimer = null
      }, 10000)

      m.unavailableTimer = window.setTimeout(() => {
        m.unavailableTimer = null
      }, 10000)

      this.endMate()
      m.endMate()

      this.world.addCreature(this.pos.copy())

      return
    }

    this.setMateDirection()
  }

  endMate(): void {
    this.nearbyMate = null
    this.state.delete(Creature.STATES.Mating)
  }
}

export default Creature
