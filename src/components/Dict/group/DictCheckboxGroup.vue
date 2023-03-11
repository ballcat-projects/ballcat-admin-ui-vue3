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
import type { CheckboxGroupProps } from 'ant-design-vue'
import type { DictValue } from '@/api/system/dict/types'
import { useDict } from '@/components/Dict/useDict'
import type { DictItem } from '@/api/system/dict/types'

// 不支持导入类型 https://github.com/vuejs/core/issues/4294
interface DictCheckboxGroupProps extends Omit<CheckboxGroupProps, 'options'> {
  // 字典标识
  dictCode: string
  // 用于过滤出指定的字典项
  itemFilter?: (dictItem: DictItem) => boolean
  // 给字典项添加是否禁用的属性
  itemDisabledChecker?: (dictItem: DictItem) => boolean
}

const props = defineProps<DictCheckboxGroupProps>()

const name = computed(() => props.name || props.dictCode)

const emits = defineEmits<{
  (e: 'update:value', selectedValue: DictValue | DictValue[]): void
}>()

const onChange = (checkedValue: any[]) => {
  emits('update:value', checkedValue)
}

const dictItems = useDict(props)
</script>

<script lang="ts">
export default {
  name: 'DictCheckboxGroup'
}
</script>

<style scoped></style>
