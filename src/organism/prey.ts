import p5 from 'p5'
import Sprite from '../sprite'
import State from './state'
import Rests from './traits/rests'
import Drive from './traits/drive'
import World from '../world'
import { DNA } from './genetics/dna'
import Eats from './traits/eats'
import Mates from './traits/mates'
import Organism from './organism'
import Health from './traits/health'

class Prey extends Sprite implements Organism {
  get imgPath(): string {
    return 'assets/creature.png'
  }

  scale: number = 2
  rotation: number = 0

  world: World
  state: Set<State> = new Set()
  dna: DNA = DNA.Default(typeof Prey)
  health: Health
  mates: Mates
  rests: Rests
  eats: Eats

  private readonly drives: Drive[]

  constructor(sketch: p5, world: World, pos: p5.Vector, dna?: DNA) {
    super(sketch, pos)
    this.world = world

    if (dna !== undefined) {
      this.dna = dna
    }

    this.health = new Health(this.dna.health, this)

    this.rests = new Rests(this.dna.rest, this)
    this.eats = new Eats(this.dna.eat, this)
    this.mates = new Mates(this.dna.mate, this)

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

  die(): void {
    this.world.kill(this)
  }

  debug(): void {
    this.sketch.push()
    this.sketch.textSize(12)
    this.sketch.textAlign(this.sketch.LEFT, this.sketch.TOP)
    this.sketch.fill('#1f0e1c')
    this.sketch.text(
      `${this.health.toString()}${this.eats.toString()}`,
      this.pos.x + 20,
      this.pos.y - 16
    )
    this.sketch.textAlign(this.sketch.RIGHT, this.sketch.TOP)
    this.sketch.text(this.dna.toString(), this.pos.x - 20, this.pos.y - 16)
    this.sketch.pop()
  }

  draw(): void {
    for (const t of this.drives) {
      if (t.beforeDraw !== undefined) {
        t.beforeDraw(this.sketch)
      }
    }

    const mouseOverRadius = 16

    const dist =
      Math.pow(this.sketch.mouseX - this.pos.x, 2) + Math.pow(this.sketch.mouseY - this.pos.y, 2)

    if (dist <= Math.pow(mouseOverRadius, 2)) {
      this.debug()
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

    if (
      this.pos.x >= this.sketch.width ||
      this.pos.x <= 0 ||
      this.pos.y >= this.sketch.height ||
      this.pos.y <= 0
    ) {
      direction.rotate(this.sketch.radians(180))
    }

    this.pos.add(direction)

    this.pos.x = this.sketch.constrain(this.pos.x, 0, this.sketch.width)
    this.pos.y = this.sketch.constrain(this.pos.y, 0, this.sketch.height)
  }
}

export default Prey
