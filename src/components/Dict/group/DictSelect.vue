<template>
  <a-select show-search v-bind="props" :filter-option="filterOption" @update:value="onChange">
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
import type { SelectProps } from 'ant-design-vue'
import type { DictValue } from '@/api/system/dict/types'
import { useDict } from '@/components/Dict/useDict'
import type { DictItem } from '@/api/system/dict/types'
import type { SelectValue } from 'ant-design-vue/es/select'

// 不支持导入类型 https://github.com/vuejs/core/issues/4294
interface DictSelectProps extends Omit<SelectProps, 'options'> {
  // 字典标识
  dictCode: string
  // 用于过滤出指定的字典项
  itemFilter?: (dictItem: DictItem) => boolean
  // 给字典项添加是否禁用的属性
  itemDisabledChecker?: (dictItem: DictItem) => boolean
}

const props = defineProps<DictSelectProps>()

const emits = defineEmits<{
  (e: 'update:value', selectedValue: DictValue | DictValue[]): void
}>()

const onChange = (selectedValue: SelectValue) => {
  emits('update:value', selectedValue as DictValue | DictValue[])
}

function defaultFilterOption(input: string, option: any) {
  return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

const filterOption = computed(() => props.filterOption || defaultFilterOption)

const dictItems = useDict(props)
</script>

<script lang="ts">
export default {
  name: 'DictSelect'
}
</script>

<style scoped></style>
