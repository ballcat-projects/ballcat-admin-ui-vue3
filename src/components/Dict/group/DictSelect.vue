<template>
  <a-select v-bind="innerProps" :filter-option="filterOption">
    <a-select-option
      v-for="dictItem in dictItems"
      :key="dictItem.id"
      :value="dictItem.value"
      :disabled="dictItem.disabled"
      :name="dictItem.name"
    >
      {{ dictItem.name }}
    </a-select-option>
  </a-select>
</template>

<script setup lang="ts">
import type { DictValue } from '@/api/system/dict/types'
import { useDict } from '@/components/Dict/use-dict'
import type { DefaultOptionType, SelectValue } from 'ant-design-vue/es/select'
import { type DictComponentProps, dictSelectProps } from '@/components/Dict/types'

const props = defineProps(dictSelectProps())

const emits = defineEmits<{
  (e: 'update:value', selectedValue: DictValue | DictValue[]): void
}>()

const innerProps = computed(() => ({
  ...props,
  onChange: (selectedValue: SelectValue, option: DefaultOptionType | DefaultOptionType[]) => {
    emits('update:value', selectedValue as DictValue | DictValue[])
    props.onChange?.(selectedValue, option)
  }
}))

function defaultFilterOption(input: string, option: any) {
  return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

const filterOption = computed(() => props.filterOption || defaultFilterOption)

const dictItems = useDict(props as DictComponentProps)
</script>
