import type p5 from 'p5'

export default interface INear {
  near(point: p5.Vector): boolean
}
