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
    <button @click="toggleRunning">{{ running ? 'stop' : 'start' }}</button>
    <button @click="$emit('reset')">reset</button>
  </section>
</template>

<style scoped>
section {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

button {
  width: 30%;
}
</style>
