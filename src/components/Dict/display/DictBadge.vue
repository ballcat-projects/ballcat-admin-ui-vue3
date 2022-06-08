<template>
  <a-badge v-bind="props" :status="status" :color="color" :text="showText" />
</template>

<script setup lang="ts">
import type { BadgeProps } from 'ant-design-vue'
import { useDictDisplay } from '@/components/Dict/useDict'
import type { DictItem, DictValue } from '@/api/system/dict/types'

interface DictBadgeProps extends Omit<BadgeProps, 'text' | 'status'> {
  // 字典的值
  value: DictValue | null
  // 字典标识
  dictCode: string
  // 用于过滤出指定的字典项
  itemFilter?: (dictItem: DictItem) => boolean
  // 给字典项添加是否禁用的属性
  itemDisabledChecker?: (dictItem: DictItem) => boolean
}

const props = defineProps<DictBadgeProps>()

const { dictItem, showText } = useDictDisplay(props)

const color = computed(() => dictItem.value?.attributes?.color || props.color)
const status = computed(() => dictItem.value?.attributes?.badgeStatus)
</script>

<script lang="ts">
export default {
  name: 'DictBadge'
}
</script>

<style scoped></style>
