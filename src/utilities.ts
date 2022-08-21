import p5 from 'p5'

function RandomSketchPos(sketch: p5): p5.Vector {
  return sketch.createVector(sketch.random(sketch.width), sketch.random(sketch.height))
}

export { RandomSketchPos }
