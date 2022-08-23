import * as Genes from './genes'
import { RandomInt } from '../../utilities'
import Prey from '../prey'

export class DNA {
  eat: Genes.Eat
  mate: Genes.Mate
  rest: Genes.Rest
  health: Genes.Health

  constructor(eat: Genes.Eat, mate: Genes.Mate, rest: Genes.Rest, health: Genes.Health) {
    this.eat = eat
    this.mate = mate
    this.rest = rest
    this.health = health
  }

  mix(other: DNA): DNA {
    return new DNA(
      structuredClone(this.eat),
      structuredClone(this.mate),
      structuredClone(this.rest),
      structuredClone(this.health)
    )
  }

  toString(): string {
    let res = ''

    for (const [key, value] of [
      ...Object.entries(this.eat),
      ...Object.entries(this.mate),
      ...Object.entries(this.rest),
      ...Object.entries(this.health),
    ]) {
      const strVal = value as string
      res += `${key}: ${strVal}\n`
    }

    return res
  }

  static Default(type: string): DNA {
    switch (type) {
      case typeof Prey:
        return new DNA(
          {
            foodValue: 5,
            full: 40,
            huntRange: 256,
            eatRange: 16,
          },
          {
            searchRange: 256,
            mateRange: 32,
            cooldown: 500,
            minFed: RandomInt(10, 30),
            minAge: RandomInt(3, 20),
            maxAge: RandomInt(20, 60),
          },
          {
            maxEnergy: RandomInt(100, 300),
            restAmount: RandomInt(1, 7),
          },
          {
            maxAge: RandomInt(70, 120),
            maxStarvation: RandomInt(10, 30),
          }
        )
      default:
        throw Error(`${type} has no DNA default`)
    }
  }
}
