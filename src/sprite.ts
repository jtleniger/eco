import type p5 from 'p5'

abstract class Sprite {
  img: p5.Image | null = null
  sketch: p5
  pos: p5.Vector
  abstract get imgPath(): string
  abstract scale: number
  abstract rotation: number

  constructor(sketch: p5, pos: p5.Vector) {
    this.sketch = sketch
    this.pos = pos
    this.loadImage()
  }

  private loadImage(): void {
    if (this.img === null || this.img === undefined) {
      this.img = this.sketch.loadImage(this.imgPath, undefined, (e: Event) => {
        console.dir(e)
      })
    }
  }

  draw(): void {
    if (this.img === null) {
      return
    }
    const width = this.img.width * this.scale
    const height = this.img.height * this.scale
    this.sketch.push()
    this.sketch.translate(this.pos.x, this.pos.y)
    this.sketch.rotate(this.rotation)
    this.sketch.imageMode(this.sketch.CENTER)
    this.sketch.image(this.img, 0, 0, width, height)
    this.sketch.pop()
  }
}

export default Sprite
