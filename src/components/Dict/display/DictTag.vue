<template>
  <a-tag :color="color" class="dict-tag">{{ showText }}</a-tag>
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
const color = computed(() => dictItem.value?.attributes?.tagColor)
</script>

<script lang="ts">
export default {
  name: 'DictTag'
}
</script>

<style scoped lang="less">
.dict-tag.ant-tag {
  margin-right: 0 !important;
}
</style>
