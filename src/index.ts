import p5 from 'p5'

import World from './world'

import './style.css'

// eslint-disable-next-line new-cap, no-new
new p5((sketch: p5): void => {
  let world: World

  sketch.setup = (): void => {
    const canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight)
    sketch.noSmooth()
    canvas.style('display', 'block')
    world = new World(sketch)
    world.initFood()
    world.spawnCreatures()
  }

  sketch.draw = (): void => {
    sketch.background('#9A6348')
    world.draw()
    world.update()
  }
})

// function draw () {
//   background('#9a6348')
//   world.draw()
//   world.update()
// }
