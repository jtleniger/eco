import p5 from 'p5'
import State from '../state'

interface Behavior {
  update: (state: Set<State>) => void
  direction: (state: Set<State>) => p5.Vector | null
  beforeDraw?: (sketch: p5) => void
  afterDraw?: (sketch: p5) => void
}

export default Behavior
