import p5 from 'p5'

abstract class Sprite {
  img: p5.Image
  sketch: p5
  pos: p5.Vector
  abstract get imgPath (): string

  constructor (sketch: p5, pos: p5.Vector) {
    this.sketch = sketch
    this.pos = pos
    this.loadImage()
  }

  private loadImage (): void {
    if (this.img === null || this.img === undefined) {
      console.log(this.imgPath)
      this.img = this.sketch.loadImage(this.imgPath, undefined, (e: Event) => {
        console.dir(e)
      })
    }
  }

  draw (): void {
    const x = this.pos.x - this.img.width
    const y = this.pos.y - this.img.height
    const width = this.img.width * 2
    const height = this.img.height * 2
    this.sketch.image(this.img, x, y, width, height)
  }
}

export default Sprite
