class World {
    static cellSize = 256;

    constructor() {
        this.food = [];
        this.creatures = [];
        this.cells = Array.from({length: ceil(width / World.cellSize)}, _ => Array(ceil(height / World.cellSize)).fill([]));
        this.foodTimer = null;
    }

    getCell(pos) {
        const x = floor(pos.x / World.cellSize);
        const y = floor(pos.y / World.cellSize);

        return this.cells[x][y];
    }

    initFood() {
        for (let i = 0; i < 50; i++) {
            this.growFood();
        }
    }

    growFood() {
        let f = new Food(createVector(random(width), random(height)));
        const cell = this.getCell(f.pos);
        cell.push(f);
        this.food.push(f);
    }

    eatFood(f) {
        let index = this.food.indexOf(f);

        if (index < 0) {
            return false;
        }

        this.food.splice(index, 1);

        const cell = this.getCell(f.pos);

        index = cell.indexOf(f);

        if (index < 0) {
            return false;
        }

        cell.splice(index, 1);

        f.eaten = true;

        return true;
    }

    kill(c) {
        let index = this.creatures.indexOf(c);

        this.creatures.splice(index, 1);
    }

    spawnCreatures() {
        for (let i = 0; i < 6; i++) {
            this.creatures.push(new Creature(createVector(random(width), random(height)), this));
        }
    }

    draw() {
        this.food.forEach(f => f.draw());
        this.creatures.forEach(c => c.draw());
    }

    update() {
        this.creatures.forEach(c => c.update());

        if (this.foodTimer) {
            return;
        }

        this.foodTimer = setTimeout(function() {
            this.foodTimer = null;
            this.growFood();
        }.bind(this), randomGaussian(5) * 1000);
    }
}