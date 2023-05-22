<template>
  <a-tag :color="color" class="dict-tag">{{ showText }}</a-tag>
</template>

<script setup lang="ts">
import { useDictDisplay } from '@/components/Dict/use-dict'
import type { DictTagProps } from '@/components/Dict/types'

const props = defineProps<DictTagProps>()
const { dictItem, showText } = useDictDisplay(props)
const color = computed(() => dictItem.value?.attributes?.tagColor)
</script>

<style scoped lang="less">
.dict-tag.ant-tag {
  margin-right: 0 !important;
}
</style>
