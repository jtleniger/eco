import type p5 from 'p5'
import Bug from './bug'
import type { DNA } from './organism/genetics/dna'
import { OrganismType } from './organism/organismType'
import Bird from './organism/bird'
import Frog from './organism/frog'
import Speed from './speed'
import type Stats from './stats'
import { Clock } from './utilities'
import type Organism from './organism/organism'

class World {
  private static readonly MAX_FOOD: number = 50

  sketch: p5
  bugs: Bug[]
  foodTimer: number | null = null
  frogs: Frog[]
  birds: Bird[]
  frames: number = 0
  speed: Speed = new Speed()
  foodClock: Clock
  stats: Stats
  userDna: Map<OrganismType, DNA> = new Map()

  constructor(sketch: p5, stats: Stats) {
    this.bugs = []
    this.frogs = []
    this.birds = []
    this.sketch = sketch
    this.foodClock = new Clock(this.speed, this.growFood.bind(this), 0.4)
    this.stats = stats
  }

  get allOrganisms(): Organism[] {
    return [...this.frogs, ...this.birds]
  }

  initBugs(): void {
    for (let i = 0; i < World.MAX_FOOD; i++) {
      const f = new Bug(this.sketch)
      this.bugs.push(f)
    }
  }

  growFood(): void {
    const f = this.bugs.find((f) => f.eaten)

    if (f !== undefined) {
      f.reset()
    }
  }

  kill(creature: Frog, reason: string): void {
    const index = this.frogs.indexOf(creature)

    this.frogs.splice(index, 1)

    this.stats.increment(reason)
  }

  spawnFrogs(): void {
    for (let i = 0; i < 10; i++) {
      const pos = this.sketch.createVector(
        this.sketch.random(this.sketch.width),
        this.sketch.random(this.sketch.height)
      )

      this.addPrey(pos, this.userDna.get(OrganismType.Frog))
    }
  }

  spawnBirds(): void {
    for (let i = 0; i < 2; i++) {
      const pos = this.sketch.createVector(
        this.sketch.random(this.sketch.width),
        this.sketch.random(this.sketch.height)
      )

      this.addPredator(pos, this.userDna.get(OrganismType.Bird))
    }
  }

  addPrey(pos: p5.Vector, dna?: DNA, generation?: number): void {
    this.frogs.push(new Frog(this.sketch, this, pos, dna, generation))
    this.stats.increment('born')
  }

  addPredator(pos: p5.Vector, dna?: DNA, generation?: number): void {
    this.birds.push(new Bird(this.sketch, this, pos, dna, generation))
    this.stats.increment('born')
  }

  draw(): void {
    this.bugs.forEach((f) => f.draw())
    this.frogs.forEach((c) => c.draw())
    this.birds.forEach((c) => c.draw())
  }

  update(): void {
    this.stats.set('alive', this.frogs.length)

    Clock.setFrames(this.sketch.frameCount)
    this.foodClock.update()

    this.frogs.forEach((c) => c.update())
    this.birds.forEach((c) => c.update())

    if (this.foodTimer !== null) {
      return
    }
  }
}

export default World
