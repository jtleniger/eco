import p5 from 'p5'
import Food from './food'
import Sprite from './sprite'
import World from './world'

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
  nearbyFood: Food | null
  nearbyMate: Creature | null
  fed: number
  direction: p5.Vector
  restingTimer: number | null
  hungerTimer: number | null
  unavailableTimer: number | null
  state: Set<number>

  constructor(sketch: p5, world: World, pos: p5.Vector) {
    super(sketch, pos)
    this.world = world
    this.reset()
  }

  reset(): void {
    this.state = new Set()
    this.unavailableTimer = null
    this.nearbyFood = null
    this.nearbyMate = null
    this.fed = 5
    this.setRandomDirection()
    this.restingTimer = null
    this.hungerTimer = null
    this.unavailableTimer = null
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
    if (this.state.has(Creature.STATES.Foraging) && this.nearbyFood !== null) {
      this.tryEat()
      return
    }

    const maybeFood = this.nearestFood()

    if (maybeFood === null) {
      return
    }

    this.state.add(Creature.STATES.Foraging)
    this.nearbyFood = maybeFood
    this.setFoodDirection()
  }

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
    this.endForage()
  }

  hunger(): void {
    if (this.hungerTimer !== null) {
      return
    }

    this.hungerTimer = window.setTimeout(() => {
      this.fed = this.sketch.constrain(this.fed - 1, 0, 10)
      this.hungerTimer = null
    }, 15000)
  }

  health(): void {
    if (this.fed === 0) {
      this.world.kill(this)
    }

    if (this.fed < 7) {
      this.state.delete(Creature.STATES.Mating)
      this.state.delete(Creature.STATES.Available)
    } else if (this.unavailableTimer === null) {
      this.state.add(Creature.STATES.Available)
    }
  }

  move(): void {
    if (this.restingTimer !== null) {
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
  nearestFood(): Food | null {
    let minDistance = Infinity
    let food = null

    this.world.food.forEach((f) => {
      if (f.eaten) {
        return
      }

      const distance = f.pos.dist(this.pos)

      if (distance > Creature.FOOD_SEARCH_RADIUS) {
        return
      }

      if (distance < minDistance) {
        minDistance = distance
        food = f
      }
    })

    return food
  }

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

  setRandomDirection(): void {
    this.direction = p5.Vector.random2D()
  }

  setFoodDirection(): void {
    if (this.nearbyFood === null) {
      return
    }

    this.direction = this.nearbyFood.pos.copy().sub(this.pos).normalize()
  }

  setMateDirection(): void {
    if (this.nearbyMate === null) {
      return
    }

    this.direction = this.nearbyMate.pos.copy().sub(this.pos).normalize()
  }

  tryEat(): void {
    if (this.nearbyFood === null) {
      return
    }

    if (this.nearbyFood.eaten) {
      this.endForage()
      return
    }

    const dist = this.pos.dist(this.nearbyFood.pos)

    if (dist < this.img.width) {
      this.nearbyFood.eaten = true
      this.fed = this.sketch.constrain(this.fed + 1, 0, 10)
      this.clearHungerTimer()
      this.endForage()
    }
  }

  tryMate(): void {
    if (this.nearbyMate === null) {
      return
    }

    const m = this.nearbyMate

    const dist = this.pos.dist(m.pos)

    if (dist < this.img.width) {
      this.state.delete(Creature.STATES.Mating)
      this.state.delete(Creature.STATES.Available)
      m.state.delete(Creature.STATES.Mating)
      m.state.delete(Creature.STATES.Available)

      this.unavailableTimer = window.setTimeout(() => {
        this.unavailableTimer = null
      }, 10000)

      m.unavailableTimer = window.setTimeout(() => {
        m.unavailableTimer = null
      }, 10000)

      this.startRest()
      m.startRest()

      this.world.addCreature(this.pos.copy())

      this.nearbyMate = null

      return
    }

    this.setMateDirection()
  }

  endForage(): void {
    this.nearbyFood = null
    this.state.delete(Creature.STATES.Foraging)
    this.startRest()
  }

  clearHungerTimer(): void {
    if (this.hungerTimer === null) {
      return
    }

    window.clearTimeout(this.hungerTimer)
    this.hungerTimer = null
  }

  startRest(): void {
    this.state.add(Creature.STATES.Resting)

    this.restingTimer = window.setTimeout(() => {
      this.endRest()
    }, this.sketch.randomGaussian(5) * 500)
  }

  endRest(): void {
    this.restingTimer = null
    this.state.delete(Creature.STATES.Resting)

    if (!this.state.has(Creature.STATES.Foraging) && !this.state.has(Creature.STATES.Mating)) {
      this.setRandomDirection()
    }
  }
}

export default Creature
