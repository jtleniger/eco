import Eat from './eat'
import Mate from './mate'
import Rest from './rest'
import { RandomInt } from '../../utilities'

class DNA {
  eat: Eat
  mate: Mate
  rest: Rest

  constructor(eat: Eat, mating: Mate, rest: Rest) {
    this.eat = eat
    this.mate = mating
    this.rest = rest
  }

  static Default(): DNA {
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
        ready: 100,
      },
      {
        maxEnergy: RandomInt(100, 300),
        restDurationSec: RandomInt(1, 7),
      }
    )
  }
}

export default DNA
