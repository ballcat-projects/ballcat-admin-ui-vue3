<template>
  <a-space :size="5">
    <dict-tag
      v-for="dictValue in props.dictValues"
      :key="dictValue as any"
      :dict-code="props.dictCode"
      :value="dictValue"
    />
  </a-space>
</template>

<script setup lang="ts">
import DictTag from '@/components/Dict/display/DictTag.vue'
import type { DictTagGroupProps } from '@/components/Dict/types'

const props = defineProps<DictTagGroupProps>()
</script>
