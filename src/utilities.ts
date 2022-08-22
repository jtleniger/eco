import p5 from 'p5'

function RandomInt(low: number, high: number): number {
  const range = high - low

  return low + Math.round(Math.random() * range)
}

function RandomSketchPos(sketch: p5): p5.Vector {
  return sketch.createVector(sketch.random(sketch.width), sketch.random(sketch.height))
}

export { RandomSketchPos, RandomInt }
