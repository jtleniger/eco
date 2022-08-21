import p5 from 'p5'
import Food from './food'
import Sprite from './sprite'
import World from './world'
import { Optional } from './utilities'

class Creature extends Sprite {
  static readonly FOOD_SEARCH_RADIUS = 128
  get imgPath (): string { return 'assets/creature.png' }
  world: World
  food: Optional<Food> = Optional.None()
  fed: number
  direction: p5.Vector
  restingTimer: Optional<number> = Optional.None()
  hungerTimer: Optional<number> = Optional.None()

  constructor (sketch: p5, world: World, pos: p5.Vector) {
    super(sketch, pos)
    this.world = world
    this.fed = 5
    this.setRandomDirection()
  }

  setRandomDirection (): void {
    this.direction = p5.Vector.random2D()
  }

  startRest (): void {
    this.restingTimer = Optional.Of(window.setTimeout(() => {
      this.restingTimer = Optional.None()
      this.setRandomDirection()
    }, this.sketch.randomGaussian(5) * 500))
  }

  checkFood (): void {
    if (this.food.HasValue) {
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
        this.startRest()
      }

      return
    }

    this.lookForFood().Map((f: Food) => {
      this.food = Optional.Of(f)
      this.direction = f.pos.copy().sub(this.pos).normalize()
    })
  }

  lookForFood (): Optional<Food> {
    let minDistance: number = Infinity
    let food: Optional<Food> = Optional.None()

    this.world.food.forEach(f => {
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

  hunger (): void {
    if (this.fed === 0) {
      this.world.kill(this)
    }

    if (this.hungerTimer.HasValue) {
      return
    }

    this.hungerTimer = Optional.Of(window.setTimeout(() => {
      this.fed = this.sketch.constrain(this.fed - 1, 0, 10)
      this.hungerTimer = Optional.None()
    }, 15000))
  }

  update (): void {
    if (this.restingTimer.HasValue) {
      return
    }

    if (this.pos.x >= this.sketch.width || this.pos.x <= 0 || this.pos.y >= this.sketch.height || this.pos.y <= 0) {
      this.direction.rotate(this.sketch.radians(180))
    }

    if (this.food.IsEmpty && this.sketch.randomGaussian() > 2.2) {
      this.startRest()
    }

    this.pos.add(this.direction)

    this.pos.x = this.sketch.constrain(this.pos.x, 0, this.sketch.width)
    this.pos.y = this.sketch.constrain(this.pos.y, 0, this.sketch.height)

    this.checkFood()
    this.hunger()
  }

  draw (): void {
    this.sketch.tint(this.sketch.map(this.fed, 0, 10, 0, 255))
    super.draw()
    this.sketch.noTint()
  }
}

export default Creature
