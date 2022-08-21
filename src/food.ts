import Sprite from './sprite'

class Food extends Sprite {
  get imgPath(): string {
    return 'assets/food.png'
  }

  eaten: boolean = false
}

export default Food
