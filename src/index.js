var world;

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  noSmooth();
  cnv.style('display', 'block');
  
  
  world = new World();
  world.initFood();
  world.spawnCreatures();
}

function draw() {
  background('#9a6348');
  world.draw();
  world.update();
}