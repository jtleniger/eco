import type p5 from 'p5'
import type World from '../world'
import type { DNA } from './genetics/dna'
import { OrganismType } from './organismType'
import BaseOrganism from './baseOrganism'

export default class Bird extends BaseOrganism {
  scale: number = 2

  constructor(sketch: p5, world: World, pos: p5.Vector, dna?: DNA, generation?: number) {
    super(
      'assets/bird.png',
      sketch,
      world,
      pos,
      OrganismType.Bird,
      world.frogs,
      world.birds,
      dna,
      generation
    )
  }

  die = (reason: string): void => {
    // this.world.kill(this, reason)
  }
}
