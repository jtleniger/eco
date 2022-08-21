import p5 from 'p5'
import Food from './food'
import Sprite from './sprite'
import World from './world'
import { Optional } from './utilities'

class Creature extends Sprite {
  private static readonly FOOD_SEARCH_RADIUS = 128

  private static readonly STATES = {
    Foraging: 0,
    Resting: 1,
    Mating: 2,
  } as const

  get imgPath(): string {
    return 'assets/creature.png'
  }

  world: World
  food: Optional<Food> = Optional.None()
  fed: number
  direction: p5.Vector
  restingTimer: Optional<number> = Optional.None()
  hungerTimer: Optional<number> = Optional.None()
  state: Set<number> = new Set()

  constructor(sketch: p5, world: World, pos: p5.Vector) {
    super(sketch, pos)
    this.world = world
    this.fed = 5
    this.setRandomDirection()
  }

  setRandomDirection(): void {
    this.direction = p5.Vector.random2D()
  }

  rest(): void {
    if (
      !this.state.has(Creature.STATES.Resting) &&
      !this.state.has(Creature.STATES.Mating) &&
      this.sketch.randomGaussian() > 2.2
    ) {
      this.state.add(Creature.STATES.Resting)

      this.restingTimer = Optional.Of(
        window.setTimeout(() => {

          this.restingTimer = Optional.None()
          this.state.delete(Creature.STATES.Resting)
          
        }, this.sketch.randomGaussian(5) * 500)
      )
    }
  }

  forage(): void {
    if (this.food.HasValue) {
      this.tryEat()
      return
    }

    this.nearbyFood().IfHasValue((f: Food) => {
      this.food = Optional.Of(f)
      this.direction = f.pos.copy().sub(this.pos).normalize()
    })
  }

  tryEat(): void {
    const f = this.food.Value

    if (f.eaten) {
      this.food = Optional.None()
      return
    }

    const dist = this.pos.dist(f.pos)

    if (dist < this.img.width) {
      this.world.eatFood(f)

      this.food = Optional.None()

      window.clearTimeout(this.hungerTimer.Value)

      this.hungerTimer = Optional.None()

      this.fed = this.sketch.constrain(this.fed + 1, 0, 10)
      this.rest()
    }
  }

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

  updateState(): void {
    if (this.fed > 5) {
      this.state.add(Creature.STATES.Mating)
    } else {
      this.state.delete(Creature.STATES.Mating)
    }
  }

  update(): void {
    this.rest()
    this.forage()
    this.hunger()
    this.health()
    this.move()
  }

  draw(): void {
    this.sketch.tint(this.sketch.map(this.fed, 0, 10, 0, 255))
    super.draw()
    this.sketch.noTint()
  }
}

export default Creature
