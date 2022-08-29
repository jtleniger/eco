<script lang="ts" setup>
import type Stats from '@/stats'

const props = defineProps<{
  stats: Stats
  inspected: [string, number][] | undefined
}>()
</script>

<template>
  <section>
    <h1>statistics</h1>
    <div class="data">
      <div v-for="[v, k] in stats.iterator">{{ v }}: {{ k }}</div>
    </div>
  </section>
  <section>
    <h1>inspect</h1>
    <div v-if="inspected" class="data">
      <div v-for="[v, k] in inspected">{{ v }}: {{ k }}</div>
    </div>
    <div v-else class="data">click an organism for info</div>
  </section>
</template>

<style scoped>
section {
  display: grid;
  grid-template-rows: 25px 1fr;
  grid-template-columns: repeat(5, 1fr);
  height: 100%;
}

h1 {
  font-weight: normal;
  margin: 0;
  grid-column: 1 / span 1;
  grid-row: 1 / span 1;
}

.data {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  grid-column: 1 / span 1;
  grid-row: 2 / span 1;
  min-height: 0;
}
</style>
