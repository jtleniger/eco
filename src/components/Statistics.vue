<script lang="ts" setup>
const props = defineProps<{
  stats: Map<string, number>
}>()
</script>

<template>
  <h1>statistics</h1>
  <div v-for="[v, k] in stats.entries()">{{ v }}: {{ k }}</div>
</template>

<style scoped>
h1 {
  font-weight: normal;
  margin: 0;
}
</style>
