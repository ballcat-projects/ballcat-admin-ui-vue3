<template>
  <span :style="{ color: color }">{{ showText }}</span>
</template>

<script setup lang="ts">
import { useDictDisplay } from '@/components/Dict/useDict'
import type { DictItem, DictValue } from '@/api/system/dict/types'

interface DictTextProps {
  // 字典的值
  value: DictValue | null
  // 字典标识
  dictCode: string
  // 用于过滤出指定的字典项
  itemFilter?: (dictItem: DictItem) => boolean
  // 给字典项添加是否禁用的属性
  itemDisabledChecker?: (dictItem: DictItem) => boolean
}

const props = defineProps<DictTextProps>()
const { dictItem, showText } = useDictDisplay(props)
const color = computed(() => dictItem.value?.attributes?.textColor)
</script>

<script lang="ts">
export default {
  name: 'DictText'
}
</script>

<style scoped></style>
