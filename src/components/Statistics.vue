<script lang="ts" setup>
const props = defineProps<{
  stats: IterableIterator<[string, number]>
}>()
</script>

<template>
  <section>
    <h1>statistics</h1>
    <div class="statistics">
      <div v-for="[v, k] in stats">{{ v }}: {{ k }}</div>
    </div>
  </section>
</template>

<style scoped>
section {
  display: grid;
  grid-template-rows: 25px 1fr;
  grid-template-columns: repeat(5, 1fr);
  height: 100%;
  padding: 0.5rem;
}

h1 {
  font-weight: normal;
  margin: 0;
  grid-column: 1 / span 1;
  grid-row: 1 / span 1;
}

.statistics {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  grid-column: 1 / span 1;
  grid-row: 2 / span 1;
}
</style>
