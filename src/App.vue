<script setup lang="ts">
import { onMounted, ref } from 'vue'
import World from './world'
import p5 from 'p5'
import Statistics from './components/Statistics.vue'

let world: World
let stats = ref<IterableIterator<[string, number]>>(new Map().entries())

onMounted(() => {
  new p5((sketch: p5): void => {
    sketch.setup = (): void => {
      sketch.createCanvas(sketch.windowWidth - 410, sketch.windowHeight - 210)
      sketch.noSmooth()
      sketch.frameRate(60)
      world = new World(sketch)
      world.initFood()
      world.spawnCreatures()
      world.registerOnTick(() => {
        stats.value = world.stats.entries()
      })
    }

    sketch.draw = (): void => {
      if (world === null) {
        return
      }

      sketch.background('#9A6348')
      world.draw()
      world.update()
    }
  }, document.getElementById('simulator') ?? document.body)
})
</script>

<template>
  <main>
    <section class="left"></section>
    <section class="right"></section>
    <section class="top"></section>
    <section id="simulator" class="simulator"></section>
    <section class="bottom"><Statistics :stats="stats"></Statistics></section>
  </main>
</template>

<style>
* {
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
  color: #f5edba;
}

body {
  margin: 0;
}

main {
  height: 100vh;
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 100px 1fr 100px;
}

.left,
.right {
  grid-row: 1 / span 3;
  background-color: #17434b;
}

.left {
  grid-column: 1 / span 1;
}

.right {
  grid-column: 3 / span 1;
}

.top,
.bottom {
  grid-column: 2 / span 1;
  background-color: #1f0e1c;
}

.top {
  grid-row: 1 / span 1;
}

.bottom {
  grid-row: 3 / span 1;
}

.simulator {
  grid-column: 2 / span 1;
  grid-row: 2 / span 1;
  border: 5px inset #3e2137;
}

.simulator canvas {
  display: block;
}
</style>
