<template>
  <a-badge v-bind="props" :status="status" :color="color" :text="showText" />
</template>

<script setup lang="ts">
import { useDictDisplay } from '@/components/Dict/use-dict'
import type { DictBadgeProps } from '@/components/Dict/types'

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
