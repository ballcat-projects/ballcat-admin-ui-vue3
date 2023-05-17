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

const { i18nText } = useAdminI18n()

const props = defineProps<{
  onConfirm?: (e: MouseEvent) => void
}>()

const title = i18nText('message.confirmDelete', '确认要删除吗？')
const text = i18nText('action.delete', '删除')
</script>
