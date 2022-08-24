import p5 from 'p5'

import World from './world'

import './style.css'
import UI from './ui'

// eslint-disable-next-line new-cap, no-new
new p5((sketch: p5): void => {
  let world: World
  let ui: UI

  sketch.setup = (): void => {
    sketch.createCanvas(sketch.windowWidth - 200, 758)
    sketch.noSmooth()
    sketch.frameRate(60)
    world = new World(sketch)
    world.initFood()
    world.spawnCreatures()
    ui = new UI(world)
  }

  sketch.draw = (): void => {
    sketch.background('#9A6348')
    world.draw()
    world.update()
    ui.update()
  }
}, document.getElementById('simulation') ?? document.body)
