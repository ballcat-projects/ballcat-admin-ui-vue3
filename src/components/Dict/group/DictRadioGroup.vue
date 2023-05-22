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
import type { DictValue } from '@/api/system/dict/types'
import { useDict } from '@/components/Dict/use-dict'
import type { RadioChangeEvent } from 'ant-design-vue/es/radio/interface'
import { type DictComponentProps, dictRadioGroupProps } from '@/components/Dict/types'

const props = defineProps(dictRadioGroupProps())

const emits = defineEmits<{
  (e: 'update:value', selectedValue: DictValue | DictValue[]): void
}>()

const onChange = (e: RadioChangeEvent) => {
  emits('update:value', e.target.value as DictValue | DictValue[])
}

const dictItems = useDict(props as DictComponentProps)
</script>

<script lang="ts">
export default {
  name: 'DictRadioGroup'
}
</script>

<style scoped></style>
