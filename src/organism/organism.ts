import type p5 from 'p5'
import type { DNA } from './genetics/dna'
import type Health from './traits/health'
import type State from './state'
import type Eats from './traits/eats'
import type Mates from './traits/mates'
import type Rests from './traits/rests'
import type World from '../world'

export default interface Organism {
  world: World
  pos: p5.Vector
  state: Set<State>
  dna: DNA
  health: Health
  die: (reason: string) => void
  mates: Mates
  rests: Rests
  eats: Eats
  generation: number
}
