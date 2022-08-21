import p5 from 'p5'
import Food from './food'
import Sprite from './sprite'
import World from './world'
import { Optional } from './utilities'

class Creature extends Sprite {
  private static readonly FOOD_SEARCH_RADIUS = 256
  private static readonly MATE_SEARCH_RADIUS = 256

  private static readonly STATES = {
    Foraging: 0,
    Resting: 1,
    Mating: 2,
    Available: 3,
  } as const

  get imgPath(): string {
    return 'assets/creature.png'
  }

  world: World
  food: Optional<Food> = Optional.None()
  potentialMate: Optional<Creature> = Optional.None()
  fed: number
  direction: p5.Vector
  restingTimer: Optional<number> = Optional.None()
  hungerTimer: Optional<number> = Optional.None()
  unavailableTimer: Optional<number> = Optional.None()
  state: Set<number> = new Set()

  constructor(sketch: p5, world: World, pos: p5.Vector) {
    super(sketch, pos)
    this.world = world
    this.fed = 5
  }

  update(): void {
    this.rest()
    this.mate()
    this.forage()
    this.hunger()
    this.health()
    this.move()
  }

  draw(): void {
    if (this.state.has(Creature.STATES.Mating)) {
      const grey = this.sketch.map(this.fed, 0, 10, 0, 192)
      this.sketch.tint(255, grey, grey)
    } else {
      this.sketch.tint(this.sketch.map(this.fed, 0, 10, 0, 255))
    }

    super.draw()
    this.sketch.noTint()
  }

  /*
   * STATE METHODS
   */
  rest(): void {
    if (
      !this.state.has(Creature.STATES.Resting) &&
      !this.state.has(Creature.STATES.Mating) &&
      !this.state.has(Creature.STATES.Foraging) &&
      this.sketch.randomGaussian() > 2.2
    ) {
      this.startRest()
    }
  }

  forage(): void {
    if (this.state.has(Creature.STATES.Foraging) && this.food.HasValue) {
      this.tryEat()
      return
    }

    this.nearbyFood().IfHasValue((f: Food) => {
      this.state.add(Creature.STATES.Foraging)
      this.food = Optional.Of(f)
      this.setFoodDirection()
    })
  }

  mate(): void {
    if (!this.state.has(Creature.STATES.Available)) {
      return
    }

    if (this.state.has(Creature.STATES.Mating) && this.potentialMate.HasValue) {
      this.tryMate()
      return
    }

    this.nearbyMate().IfHasValue((c: Creature) => {
      this.state.add(Creature.STATES.Mating)
      this.potentialMate = Optional.Of(c)
      this.endForage()
    })
  }

  hunger(): void {
    if (this.hungerTimer.HasValue) {
      return
    }

    this.hungerTimer = Optional.Of(
      window.setTimeout(() => {
        this.fed = this.sketch.constrain(this.fed - 1, 0, 10)
        this.hungerTimer = Optional.None()
      }, 15000)
    )
  }

  health(): void {
    if (this.fed === 0) {
      this.world.kill(this)
    }

    if (this.fed < 7) {
      this.state.delete(Creature.STATES.Mating)
      this.state.delete(Creature.STATES.Available)
    } else if (this.unavailableTimer.IsEmpty) {
      this.state.add(Creature.STATES.Available)
    }
  }

  move(): void {
    if (this.restingTimer.HasValue) {
      return
    }

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
  nearbyFood(): Optional<Food> {
    let minDistance: number = Infinity
    let food: Optional<Food> = Optional.None()

    this.world.food.forEach((f) => {
      const distance = f.pos.dist(this.pos)

      if (distance > Creature.FOOD_SEARCH_RADIUS) {
        return
      }

      if (distance < minDistance) {
        minDistance = distance
        food = Optional.Of(f)
      }
    })

    return food
  }

  nearbyMate(): Optional<Creature> {
    let minDistance: number = Infinity
    let creature: Optional<Creature> = Optional.None()

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
        creature = Optional.Of(c)
      }
    })

    return creature
  }

  setRandomDirection(): void {
    this.direction = p5.Vector.random2D()
  }

  setFoodDirection(): void {
    this.food.IfHasValue((f: Food) => {
      this.direction = f.pos.copy().sub(this.pos).normalize()
    })
  }

  setMateDirection(): void {
    this.potentialMate.IfHasValue((c: Creature) => {
      this.direction = c.pos.copy().sub(this.pos).normalize()
    })
  }

  tryEat(): void {
    const f = this.food.Value

    if (f.eaten) {
      this.endForage()
      return
    }

    const dist = this.pos.dist(f.pos)

    if (dist < this.img.width) {
      this.world.eatFood(f)
      this.fed = this.sketch.constrain(this.fed + 1, 0, 10)
      this.clearHungerTimer()
      this.endForage()
    }
  }

  tryMate(): void {
    const m = this.potentialMate.Value

    const dist = this.pos.dist(m.pos)

    if (dist < this.img.width) {
      console.log('mate')

      this.potentialMate = Optional.None()

      this.state.delete(Creature.STATES.Mating)
      this.state.delete(Creature.STATES.Available)
      m.state.delete(Creature.STATES.Mating)
      m.state.delete(Creature.STATES.Available)

      this.unavailableTimer = Optional.Of(
        window.setTimeout(() => {
          this.unavailableTimer = Optional.None()
        }, 10000)
      )

      m.unavailableTimer = Optional.Of(
        window.setTimeout(() => {
          m.unavailableTimer = Optional.None()
        }, 10000)
      )

      this.startRest()
      m.startRest()

      this.world.addCreature(this.pos.copy())

      return
    }

    this.setMateDirection()
  }

  endForage(): void {
    this.food = Optional.None()
    this.state.delete(Creature.STATES.Foraging)
    this.startRest()
  }

  clearHungerTimer(): void {
    window.clearTimeout(this.hungerTimer.Value)
    this.hungerTimer = Optional.None()
  }

  startRest(): void {
    this.state.add(Creature.STATES.Resting)

    this.restingTimer = Optional.Of(
      window.setTimeout(() => {
        this.endRest()
      }, this.sketch.randomGaussian(5) * 500)
    )
  }

  endRest(): void {
    this.restingTimer = Optional.None()
    this.state.delete(Creature.STATES.Resting)

    if (!this.state.has(Creature.STATES.Foraging) && !this.state.has(Creature.STATES.Mating)) {
      this.setRandomDirection()
    }
  }
}

export default Creature
