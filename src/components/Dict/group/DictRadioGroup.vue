<template>
  <a-radio-group v-bind="props" :value="props.value" @change="onChange">
    <template v-if="props.type.toLowerCase() === 'radio'">
      <a-radio
        v-for="dictItem in dictItems"
        :key="dictItem.id"
        :value="dictItem.value"
        :disabled="dictItem.disabled"
      >
        {{ dictItem.name }}
      </a-radio>
    </template>
    <template v-if="props.type.toLowerCase() === 'button'">
      <a-radio-button
        v-for="dictItem in dictItems"
        :key="dictItem.id"
        :value="dictItem.value"
        :disabled="dictItem.disabled"
      >
        {{ dictItem.name }}
      </a-radio-button>
    </template>
  </a-radio-group>
</template>

<script setup lang="ts">
import type { RadioGroupProps } from 'ant-design-vue'
import type { DictValue } from '@/api/system/dict/types'
import { useDict } from '@/components/Dict/useDict'
import type { DictItem } from '@/api/system/dict/types'
import type { RadioChangeEvent } from 'ant-design-vue/es/radio/interface'

// 不支持导入类型 https://github.com/vuejs/core/issues/4294
interface DictRadioGroupProps extends Omit<RadioGroupProps, 'options' | 'value'> {
  // select 的值 @TODO 不能直接写 DictItemValue，会导致 validator 异常
  value?: number | string | DictValue[]
  // 字典标识
  dictCode: string
  // 用于过滤出指定的字典项
  itemFilter?: (dictItem: DictItem) => boolean
  // 给字典项添加是否禁用的属性
  itemDisabledChecker?: (dictItem: DictItem) => boolean
  // RadioGroup 的类型
  type?: 'radio' | 'button'
}

const props = withDefaults(defineProps<DictRadioGroupProps>(), {
  type: 'radio',
  value: undefined,
  itemFilter: undefined,
  itemDisabledChecker: undefined
})

const emits = defineEmits<{
  (e: 'update:value', selectedValue: DictValue | DictValue[]): void
}>()

const onChange = (e: RadioChangeEvent) => {
  emits('update:value', e.target.value)
}

const dictItems = useDict(props)
</script>

<script lang="ts">
export default {
  name: 'DictRadioGroup'
}
</script>

<style scoped></style>
