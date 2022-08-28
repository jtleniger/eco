import type p5 from 'p5'
import type Edible from './edible'

import Sprite from './sprite'
import { RandomInt, RandomSketchPos } from './utilities'

class Bug extends Sprite implements Edible {
  get imgPath(): string {
    return 'assets/food.png'
  }

  scale: number = 1

  eaten: boolean = false

  rotation: number

  constructor(sketch: p5) {
    super(sketch, RandomSketchPos(sketch))
    this.eaten = false
    this.reset()
    this.rotation = this.sketch.radians(RandomInt(0, 359))
  }

  eat = (): void => {
    this.eaten = true
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

export default Bug
