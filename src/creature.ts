import p5 from 'p5'
import Food from './food'
import Sprite from './sprite'
import World from './world'

class Creature extends Sprite {
  get imgPath (): string { return 'assets/creature.png' }
  world: World
  food: Food | null = null
  fed: number
  direction: p5.Vector
  restingTimer: number | null = null
  hungerTimer: number | null = null

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
    this.restingTimer = window.setTimeout(() => {
      this.restingTimer = null
      this.setRandomDirection()
    }, this.sketch.randomGaussian(5) * 500)
  }

  checkFood (): void {
    if (this.food != null) {
      if (this.food.eaten) {
        this.food = null
        return
      }

      const dist = this.pos.dist(this.food.pos)

      if (dist < this.img.width) {
        this.world.eatFood(this.food)

        this.food = null

        const timerId = this.hungerTimer as number

        window.clearTimeout(timerId)

        this.hungerTimer = null

        this.fed = this.sketch.constrain(this.fed + 1, 0, 10)
        this.startRest()
      }
    }

    // let minDistance = Infinity

    // cell.forEach(f => {
    //   const distance = this.pos.dist(f.pos)

    //   if (distance < minDistance) {
    //     minDistance = distance
    //     this.food = f
    //   }
    // })

    // this.direction = this.food.pos.copy().sub(this.pos).normalize()
  }

  hunger (): void {
    if (this.fed === 0) {
      this.world.kill(this)
    }

    if (this.hungerTimer !== null) {
      return
    }

    this.hungerTimer = window.setTimeout(() => {
      this.fed = this.sketch.constrain(this.fed - 1, 0, 10)
      this.hungerTimer = null
    }, 15000)
  }

  update (): void {
    if (this.restingTimer !== null) {
      return
    }

    if (this.pos.x >= this.sketch.width || this.pos.x <= 0 || this.pos.y >= this.sketch.height || this.pos.y <= 0) {
      this.direction.rotate(this.sketch.radians(180))
    }

    if ((this.food == null) && this.sketch.randomGaussian() > 2.2) {
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
