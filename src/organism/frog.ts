import type p5 from 'p5'
import Sprite from '../sprite'
import type State from './state'
import Rests from './traits/rests'
import type Drive from './traits/drive'
import type World from '../world'
import { DNA } from './genetics/dna'
import Eats from './traits/eats'
import Mates from './traits/mates'
import type Organism from './organism'
import Health from './traits/health'
import type Edible from '@/edible'
import type Bug from '@/bug'

class Frog extends Sprite implements Organism, Edible {
  get imgPath(): string {
    return 'assets/frog.png'
  }

  scale: number = 2
  rotation: number = 0

  world: World
  state: Set<State> = new Set()
  dna: DNA
  health: Health
  mates: Mates<Bug>
  rests: Rests
  eats: Eats<Bug>
  readonly eaten: boolean = false

  readonly generation: number = 1

  private readonly drives: Drive[]

  constructor(sketch: p5, world: World, pos: p5.Vector, dna?: DNA, generation?: number) {
    super(sketch, pos)
    this.world = world

    if (dna !== undefined) {
      this.dna = dna
    } else {
      this.dna = DNA.Default(typeof Frog, this.world)
    }

    if (generation !== undefined) {
      this.generation = generation
    }

    this.health = new Health(this)

    this.rests = new Rests(this)
    this.eats = new Eats(this, this.world.bugs)
    this.mates = new Mates(this, this.world.frogs)

    this.drives = [this.rests, this.eats, this.mates]
  }

  reset(): void {
    this.state.clear()
  }

  update(): void {
    this.health.update()

    for (const t of this.drives) {
      t.update(this.state)
    }

    this.move()
  }

  eat = (): void => {
    this.die('eaten')
  }

  die(reason: string): void {
    this.world.kill(this, reason)
  }

  get stats(): [string, number][] {
    return [...this.eats.stats, ...this.health.stats, ...this.rests.stats]
  }

  draw(): void {
    for (const t of this.drives) {
      if (t.beforeDraw !== undefined) {
        t.beforeDraw(this.sketch)
      }
    }

    super.draw()

    for (const t of this.drives) {
      if (t.afterDraw !== undefined) {
        t.afterDraw(this.sketch)
      }
    }
  }

  move(): void {
    const dirs = this.drives.map((t) => t.direction(this.state)).filter((d) => d !== null)

    if (dirs.length > 1) {
      throw Error('received multiple candidate directions')
    }

    if (dirs.length === 0 || dirs[0] === null || dirs[0] === undefined) {
      return
    }

    const direction = dirs[0].copy()

    if (this.pos.x >= this.sketch.width - 8) {
      direction.add(-1, 0)
      direction.normalize()
    }

    if (this.pos.y >= this.sketch.height - 8) {
      direction.add(0, -1)
      direction.normalize()
    }

    if (this.pos.x <= 8) {
      direction.add(1, 0)
      direction.normalize()
    }

    if (this.pos.y <= 8) {
      direction.add(0, 1)
      direction.normalize()
    }

    direction.setMag(this.world.speed.current)

    this.pos.add(direction)

    this.pos.x = this.sketch.constrain(this.pos.x, 0, this.sketch.width)
    this.pos.y = this.sketch.constrain(this.pos.y, 0, this.sketch.height)
  }
}

export default Frog
