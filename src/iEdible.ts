import type p5 from 'p5'

export default interface IEdible {
  eat: () => void
  pos: p5.Vector
  eaten: boolean
}
