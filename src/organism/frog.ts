import type p5 from 'p5'
import type World from '../world'
import type { DNA } from './genetics/dna'
import { OrganismType } from './organismType'
import BaseOrganism from './baseOrganism'
import type IEdible from '@/iEdible'

export default class Frog extends BaseOrganism implements IEdible {
  scale: number = 2
  eaten: boolean = false

  constructor(sketch: p5, world: World, pos: p5.Vector, dna?: DNA, generation?: number) {
    super(
      'assets/frog.png',
      sketch,
      world,
      pos,
      OrganismType.Bird,
      world.bugs,
      world.frogs,
      dna,
      generation
    )
  }

  eat = (): void => {
    this.eaten = true
    this.die('eaten')
  }

  die = (reason: string): void => {
    this.world.kill(this, reason)
  }
}
