class Creature extends Sprite {
    static img = null;
    static imgPath = 'assets/creature.png';

    constructor(pos, world) {
        super(pos);
        this.world = world;
        this.food = null;
        this.fed = 5;
        this.randomDirection();
    }

    randomDirection() {
        this.direction = p5.Vector.random2D();
    }

    startRest() {
        this.resting = setTimeout(function () {
            this.resting = null;
            this.randomDirection();
        }.bind(this), randomGaussian(5) * 500);
    }

    checkFood() {
        if (this.food) {
            if (this.food.eaten) {
                this.food = null;
                return;
            }

            const dist = this.pos.dist(this.food.pos);

            if (dist < Creature.img.width) {
                this.world.eatFood(this.food);
                this.food = null;
                clearTimeout          (this.hungerTimeout);
                this.hungerTimeout = null;
                this.fed = constrain(this.fed + 1, 0, 10);
                this.startRest();
            }

            return;
        }

        const cell = this.world.getCell(this.pos);

        if (!cell.length) {
            return;
        }

        let minDistance = Infinity;

        cell.forEach(f => {
            let distance = this.pos.dist(f.pos);

            if (distance < minDistance) {
                minDistance = distance;
                this.food = f;
            }
        });
        
        this.direction = this.food.pos.copy().sub(this.pos).normalize();
    }

    hunger() {
        if (this.fed == 0) {
            this.world.kill(this);
        }

        if (this.hungerTimeout) {
            return;
        }

        this.hungerTimeout = setTimeout(function () {
            this.fed = constrain(this.fed - 1, 0, 10);
            this.hungerTimeout = null;
        }.bind(this), 15000);
    }

    update() {
        if (this.resting) {
            return;
        }

        if (this.pos.x >= width || this.pos.x <= 0 || this.pos.y >= height || this.pos.y <= 0) {
            this.direction.rotate(radians(180));
        }

        if (!this.food && randomGaussian() > 2.2) {
            this.startRest();
        }

        this.pos.add(this.direction);

        this.pos.x = constrain(this.pos.x, 0, width);
        this.pos.y = constrain(this.pos.y, 0, height);

        this.checkFood();
        this.hunger();
    }

    draw() {
        tint(map(this.fed, 0, 10, 0, 255));
        super.draw();
        noTint();
    }
}