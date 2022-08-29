<script setup lang="ts">
import { onMounted, reactive, ref, type Ref } from 'vue'
import World from './world'
import p5 from 'p5'
import Info from './components/Info.vue'
import Stats from './stats'
import Controls from './components/Controls.vue'
import GeneticsEditor from './components/GeneticsEditor.vue'
import { OrganismType } from './organism/organismType'
import { DNA } from './organism/genetics/dna'
import EditButtons from './components/EditButtons.vue'
import type IOrganism from './organism/iOrganism'

let world: World
let stats = reactive(new Stats())
let sketch: p5
let running = ref(false)
let showGenetics = ref(false)
let editingOrganism = ref(OrganismType.Frog)
let inspectedStats: Ref<[string, number][] | undefined> = ref(undefined)
let inspected: IOrganism | null = null

const toggleRunning = () => {
  running.value = !running.value
  world.speed.setRunning(running.value)
}

const reset = () => {
  stats.clear()
  running.value = false
  world = new World(sketch, stats)
  world.initBugs()
  world.spawnFrogs()
  world.spawnBirds()
}

const edit = (organism: OrganismType) => {
  showGenetics.value = true
  editingOrganism.value = organism
}

const genesSaved = (
  data: Map<string, { min: number; max: number; spawnMin: number; spawnMax: number }>
) => {
  stats.clear()
  running.value = false
  world = new World(sketch, stats)
  const dna = DNA.fromMap(data, world)
  world.userDna.set(editingOrganism.value, dna)
  showGenetics.value = false
  world.initBugs()
  world.spawnFrogs()
  world.spawnBirds()
}

const genesClosed = () => {
  showGenetics.value = false
}

onMounted(() => {
  new p5((s: p5): void => {
    sketch = s
    s.setup = (): void => {
      s.createCanvas(s.windowWidth - 410, s.windowHeight - 210)
      s.noSmooth()
      s.frameRate(60)
      reset()
    }

    s.draw = (): void => {
      if (world === null) {
        return
      }

      s.background('#9A6348')
      world.draw()

      inspectedStats.value = inspected?.stats

      if (world.speed.running) {
        world.update()
      }
    }

    s.mouseClicked = (): void => {
      const loc = s.createVector(s.mouseX, s.mouseY)
      for (let o of world.allOrganisms) {
        if (o.near(loc)) {
          inspected = o
          break
        }
      }
    }
  }, document.getElementById('simulator') ?? document.body)
})
</script>

<template>
  <main>
    <GeneticsEditor
      :visible="showGenetics"
      :organism="editingOrganism"
      @saved="genesSaved"
      @close="genesClosed"
    ></GeneticsEditor>
    <section class="left">
      <Controls @reset="reset" @toggle-running="toggleRunning" :running="running"></Controls>
      <EditButtons @edit="edit"></EditButtons>
    </section>
    <section class="right"></section>
    <section class="top"></section>
    <section id="simulator" class="simulator"></section>
    <section class="bottom">
      <Info :stats="stats" :inspected="inspectedStats"></Info>
    </section>
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
.right,
.top,
.bottom {
  padding: 0.5em;
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
  display: flex;
}

.simulator {
  grid-column: 2 / span 1;
  grid-row: 2 / span 1;
  border: 5px inset #3e2137;
}

.simulator canvas {
  display: block;
}

button,
input {
  background-color: #1f0e1c;
  border: none;
  color: #8c8fae;
  margin: 0.25em;
  padding: 0.5em;
  border-radius: 3px;
}

button {
  cursor: pointer;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
