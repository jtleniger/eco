import type p5 from 'p5'
import type { DNA } from './genetics/dna'
import type Health from './traits/health'
import type State from './state'
import type Rests from './traits/rests'
import type World from '../world'
import type Eats from './traits/eats'
import type Mates from './traits/mates'

export default interface IOrganism {
  world: World
  pos: p5.Vector
  state: Set<State>
  dna: DNA
  health: Health
  eats: Eats
  mates: Mates
  die: (reason: string) => void
  rests: Rests
  generation: number
  near: (point: p5.Vector) => boolean
  get stats(): [string, number][]
}
