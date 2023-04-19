<template>
  <confirm-text-button
    :title="title"
    :text="text"
    text-class="ballcat-text-danger"
    @confirm="props.onConfirm"
  />
</template>

<script setup lang="ts">
import { ConfirmTextButton } from '@/components/Button'
import type { Ref } from 'vue'

const props = defineProps<{
  onConfirm?: (e: MouseEvent) => void
}>()

const title: Ref<string> = ref('确认要删除吗')
const text: Ref<string> = ref('删除')
</script>

<script lang="ts">
export default {
  name: 'RemoveTextButton'
}
</script>

<style scoped></style>
