import Eat from './eat'
import Mate from './mate'
import Rest from './rest'
import { RandomInt } from '../../utilities'
import Prey from '../prey'

class DNA {
  eat: Eat
  mate: Mate
  rest: Rest

  constructor(eat: Eat, mating: Mate, rest: Rest) {
    this.eat = eat
    this.mate = mating
    this.rest = rest
  }

  static Default(type: string): DNA {
    switch (type) {
      case typeof Prey:
        return new DNA(
          {
            foodValue: 1,
            full: 10,
            huntRange: 256,
            eatRange: 32,
          },
          {
            searchRange: 256,
            mateRange: 32,
            cooldown: 500,
          },
          {
            maxEnergy: RandomInt(100, 300),
            restDurationSec: RandomInt(1, 7),
          }
        )
      default:
        throw Error(`${type} has no DNA default`)
    }
  }
}

export default DNA
