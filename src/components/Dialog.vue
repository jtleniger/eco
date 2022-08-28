<script lang="ts" setup>
const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <div :class="{ visible }" @click.self="$emit('close')">
    <section>
      <button @click="$emit('close')">x</button>
      <slot></slot>
    </section>
  </div>
</template>

<style scoped>
div {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}
.visible {
  display: flex;
  justify-content: center;
  align-items: center;
}

section {
  position: relative;
  background-color: #17434b;
  padding: 1em;
  width: 50%;
  border-radius: 0.5em;
}

button {
  position: absolute;
  right: 1em;
  top: 1em;
  background-color: #9d303b;
  color: #f5edba;
}
</style>
