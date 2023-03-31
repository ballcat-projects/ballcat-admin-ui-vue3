<template>
  <div>
    <a-modal
      :visible="visible"
      :closable="false"
      width="900px"
      @ok="handleOk"
      @cancel="handleClose"
    >
      <icon-selector v-model:value="currentIcon" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { IconSelector } from '@/components/IconSelector/index'
import type { Icon } from '@/components/IconSelector/types'
import { useModal } from '@/hooks/modal'

const { visible, openModal, closeModal } = useModal()

const currentIcon = ref<Icon>('')

const emits = defineEmits(['choose'])
const handleOk = () => {
  emits('choose', currentIcon.value)
  handleClose()
}

const handleClose = () => {
  currentIcon.value = ''
  closeModal()
}

defineExpose({
  show() {
    openModal()
  }
})
</script>
<script lang="ts">
export default {
  name: 'IconSelectorModal'
}
</script>
<style scoped></style>
