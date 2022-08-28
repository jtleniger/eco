<script lang="ts" setup>
const props = defineProps<{
  visible: boolean
}>()
</script>

<template>
  <div :class="{ visible }">
    <section>foobar</section>
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
  background-color: #17434b;
  padding: 1em;
  width: 50%;
  border-radius: 0.5em;
}
</style>
