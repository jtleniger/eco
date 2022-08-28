<script lang="ts" setup>
import { OrganismName, OrganismType } from '@/organism/organismType'
import { EnumEntries } from '@/utilities'

type OrganismTypeStrings = keyof typeof OrganismType

const emit = defineEmits(['edit'])

const types = EnumEntries(OrganismType).map((k) => {
  const key = k as OrganismTypeStrings
  const type = OrganismType[key]

  return { type, name: OrganismName.get(type) }
})
</script>

<template>
  <section>
    <h1>genetics</h1>
    <div class="buttons">
      <button v-for="t in types" @click="$emit('edit', t.type)">edit {{ t.name }}</button>
    </div>
  </section>
</template>

<style scoped>
h1 {
  text-align: center;
  margin: 0.5em;
}

.buttons {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
