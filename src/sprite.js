class Sprite {
    constructor(pos) {
        if (this.constructor.img === null) {
            this.constructor.img = loadImage(this.constructor.imgPath);
        }

        this.pos = pos;
    }

    draw() {
        const x = this.pos.x - this.constructor.img.width;
        const y = this.pos.y - this.constructor.img.height;
        const width = this.constructor.img.width * 2;
        const height = this.constructor.img.height * 2;
        image(this.constructor.img, x, y, width, height);
    }
}