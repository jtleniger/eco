import type p5 from 'p5'
import Sprite from '../sprite'
import type State from './state'
import Rests from './traits/rests'
import type Drive from './traits/drive'
import type World from '../world'
import { DNA } from './genetics/dna'
import Eats from './traits/eats'
import Mates from './traits/mates'
import type IOrganism from './iOrganism'
import Health from './traits/health'
import type Bug from '@/bug'
import type { OrganismType } from './organismType'
import type IEdible from '@/iEdible'

export default abstract class BaseOrganism extends Sprite implements IOrganism {
  abstract die: (reason: string) => void

  scale: number = 2

  world: World
  state: Set<State> = new Set()
  dna: DNA
  health: Health
  mates: Mates
  rests: Rests
  eats: Eats

  readonly generation: number = 1

  readonly drives: Drive[]

  constructor(
    imgPath: string,
    sketch: p5,
    world: World,
    pos: p5.Vector,
    type: OrganismType,
    food: IEdible[],
    mates: IOrganism[],
    dna?: DNA,
    generation?: number
  ) {
    super(imgPath, sketch, pos)

    this.world = world

    if (dna !== undefined) {
      this.dna = dna
    } else {
      this.dna = DNA.Default(type, this.world)
    }

    if (generation !== undefined) {
      this.generation = generation
    }

    this.health = new Health(this)

    this.rests = new Rests(this)
    this.eats = new Eats(this, food)
    this.mates = new Mates(this, mates)

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

  get stats(): [string, number][] {
    return [
      ...this.dna.stats,
      ...this.eats.stats,
      ...this.health.stats,
      ...this.rests.stats,
      ['generation', this.generation],
    ]
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
