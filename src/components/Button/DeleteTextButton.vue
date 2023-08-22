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
import { useAdminI18n } from '@/hooks/i18n'

defineOptions({ name: 'DeleteTextButton' })

const { rawI18nText } = useAdminI18n()

const props = defineProps<{
  onConfirm?: (e: MouseEvent) => void
}>()

const title = rawI18nText('message.confirmDelete', '确认要删除吗？')
const text = rawI18nText('action.delete', '删除')
</script>
