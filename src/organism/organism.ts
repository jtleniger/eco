import p5 from 'p5'
import { DNA } from './genetics/dna'
import Health from './traits/health'
import State from './state'
import Eats from './traits/eats'
import Mates from './traits/mates'
import Rests from './traits/rests'
import World from '../world'

interface Organism {
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

export default Organism
