<script lang="ts" setup>
import { isReactive, toRef } from 'vue'

const props = defineProps<{
  stats?: Map<string, number>
}>()

console.log(isReactive(props.stats))
</script>

<template>
  {{ JSON.stringify(stats) }}
</template>
