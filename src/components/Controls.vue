<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
  running: boolean
}>()

const emit = defineEmits(['toggleRunning', 'reset'])

let toggleRunning = (): void => {
  emit('toggleRunning')
}
</script>

<template>
  <section>
    <h1>controls</h1>
    <div class="controls">
      <button @click="toggleRunning">{{ running ? 'stop' : 'start' }}</button>
      <button @click="$emit('reset')">reset</button>
    </div>
  </section>
</template>

<style scoped>
h1 {
  text-align: center;
  margin: 0.5em;
}

.controls {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

button {
  width: 30%;
}
</style>
