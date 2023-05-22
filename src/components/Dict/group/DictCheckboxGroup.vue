<template>
  <a-checkbox-group v-bind="props" :name="name" @change="onChange">
    <a-checkbox
      v-for="dictItem in dictItems"
      :key="dictItem.id"
      :value="dictItem.value"
      :disabled="dictItem.disabled"
    >
      {{ dictItem.name }}
    </a-checkbox>
  </a-checkbox-group>
</template>

<script setup lang="ts">
import type { DictValue } from '@/api/system/dict/types'
import { useDict } from '@/components/Dict/use-dict'
import { dictCheckboxGroupProps, type DictComponentProps } from '@/components/Dict/types'

const props = defineProps(dictCheckboxGroupProps())

const name = computed(() => props.name || props.dictCode)

const emits = defineEmits<{
  (e: 'update:value', selectedValue: DictValue | DictValue[]): void
}>()

const onChange = (checkedValue: any[]) => {
  emits('update:value', checkedValue)
}

const dictItems = useDict(props as DictComponentProps)
</script>

<script lang="ts">
export default {
  name: 'DictCheckboxGroup'
}
</script>

<style scoped></style>
