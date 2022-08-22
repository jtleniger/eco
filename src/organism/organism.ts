import p5 from 'p5'
import DNA from './genes/dna'
import State from './state'
import Mates from './traits/mates'

interface Organism {
  pos: p5.Vector
  state: Set<State>
  dna: DNA
  mateBehavior: Mates
}

export default Organism
