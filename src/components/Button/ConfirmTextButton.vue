<template>
  <a-popconfirm :title="props.title" @confirm="props.onConfirm">
    <a href="javascript:" :class="props.textClass">{{ props.text }}</a>
  </a-popconfirm>
</template>

<script setup lang="ts">
defineOptions({ name: 'ConfirmTextButton' })

const props = defineProps<{
  title: string
  text: string
  onConfirm?: (e: MouseEvent) => void
  textClass?: string | string[]
}>()
</script>
