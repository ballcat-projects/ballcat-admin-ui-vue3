<template>
  <span :style="{ color: color }">{{ showText }}</span>
</template>

<script setup lang="ts">
import { useDictDisplay } from '@/components/Dict/use-dict'
import type { DictTextProps } from '@/components/Dict/types'

const props = defineProps<DictTextProps>()
const { dictItem, showText } = useDictDisplay(props)
const color = computed(() => dictItem.value?.attributes?.textColor)
</script>
