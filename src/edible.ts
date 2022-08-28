import type p5 from 'p5'

export default interface Edible {
  eat: () => void
  pos: p5.Vector
  eaten: boolean
}
