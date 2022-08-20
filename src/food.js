class Food extends Sprite {
    static img = null;
    static imgPath = 'assets/food.png';

    constructor(pos) {
        super(pos);
        this.eaten = false;
    }
}