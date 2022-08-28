<script lang="ts" setup>
import { GeneName, GeneType } from '@/organism/genetics/genes/geneType'
import { forOrganism } from '@/organism/genetics/genes/metadata'
import { OrganismType, OrganismName } from '@/organism/organismType'
import { computed, reactive } from 'vue'
import Dialog from './Dialog.vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits(['setGenes'])

type GeneTypeStrings = keyof typeof GeneType

const organism: OrganismType = OrganismType.Prey

const metadata = forOrganism(organism)

const data = reactive(
  new Map(
    Object.keys(GeneType)
      .filter((key) => isNaN(Number(key)))
      .map((k) => {
        const key = k as GeneTypeStrings
        return [key, { key, name: GeneName.get(GeneType[key]), ...metadata.get(GeneType[key]) }]
      })
  )
)

const saveAndReset = () => {
  emit('setGenes', organism, data)
}
</script>

<template>
  <Dialog :visible="visible">
    <h1>editing genetics for {{ OrganismName.get(organism) }}</h1>
    <table class="genes">
      <thead>
        <tr>
          <th></th>
          <th>min</th>
          <th>max</th>
          <th>spawn min</th>
          <th>spawn max</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="[gene, metadata] of data">
          <td>{{ metadata.name }}</td>
          <td>{{ metadata.min }}</td>
          <td>{{ metadata.max }}</td>
          <td>
            <input
              type="number"
              :id="`${gene}-spawnMin`"
              :name="`${gene}-spawnMin`"
              :min="String(metadata.min)"
              :max="String(metadata.max)"
              v-model="metadata.spawnMin"
            />
          </td>
          <td>
            <input
              type="number"
              :id="`${gene}-spawnMax`"
              :name="`${gene}-spawnMax`"
              :min="String(metadata.min)"
              :max="String(metadata.max)"
              v-model="metadata.spawnMax"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="actions"><button @click="saveAndReset">save & reset</button></div>
  </Dialog>
</template>

<style scoped>
table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin-bottom: 2em;
}

th,
td {
  padding: 0.25em;
}

th {
  padding-bottom: 0.5em;
}

tr:not(:last-of-type),
thead tr {
  border-bottom: 1px solid #34859d;
}

th {
  text-align: left;
}

thead th:nth-child(1) {
  width: 60%;
}

thead th:nth-child(2) {
  width: 8%;
}

thead th:nth-child(3) {
  width: 8%;
}

thead th:nth-child(4) {
  width: 12%;
}

thead th:nth-child(5) {
  width: 12%;
}

td input {
  width: 100%;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
