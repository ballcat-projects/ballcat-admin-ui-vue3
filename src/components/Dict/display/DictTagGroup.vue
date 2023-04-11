<template>
  <a-space :size="5">
    <dict-tag
      v-for="dictValue in props.dictValues"
      :key="dictValue"
      :dict-code="props.dictCode"
      :value="dictValue"
    />
  </a-space>
</template>

<script setup lang="ts">
import type { DictValue } from '@/api/system/dict/types'
import DictTag from '@/components/Dict/display/DictTag.vue'

const props = defineProps<{
  dictCode: string
  dictValues: DictValue[]
}>()
</script>

<script lang="ts">
export default {
  name: 'DictTagGroup'
}
</script>

<style scoped></style>
