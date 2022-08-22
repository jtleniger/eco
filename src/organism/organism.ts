import p5 from 'p5'
import DNA from './genes/dna'
import State from './state'
import Eats from './traits/eats'
import Mates from './traits/mates'
import Rests from './traits/rests'

interface Organism {
  pos: p5.Vector
  state: Set<State>
  dna: DNA
  mateBehavior: Mates
  restBehavior: Rests
  eatBehavior: Eats
}

export default Organism
