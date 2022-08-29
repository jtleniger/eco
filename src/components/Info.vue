<script lang="ts" setup>
import type Stats from '@/stats'

const props = defineProps<{
  stats: Stats
  inspected?: [string, number][]
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
    <div v-else class="data"><em>click an organism for info</em></div>
  </section>
</template>

<style scoped>
section {
  margin-right: 2em;
}

h1 {
  font-weight: normal;
  margin: 0;
}

.data {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  min-height: 0;
  max-height: 60%;
}

.data div {
  margin-right: 1em;
}
</style>
