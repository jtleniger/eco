import p5 from 'p5'

import Sprite from './sprite'
import { RandomSketchPos } from './utilities'

class Food extends Sprite {
  get imgPath(): string {
    return 'assets/food.png'
  }

  eaten: boolean = false

  constructor(sketch: p5) {
    super(sketch, RandomSketchPos(sketch))
    this.eaten = false
    this.reset()
  }

  reset(): void {
    this.pos = RandomSketchPos(this.sketch)
    this.eaten = false
  }

  draw(): void {
    if (this.eaten) {
      return
    }

    super.draw()
  }
}

export default Food
