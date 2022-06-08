<template>
  <div>
    <ProCard title="默认尺寸" extra="extra" tooltip="这是提示" :style="{ maxWidth: '300px' }">
      <div>Card content</div>
      <div>Card content</div>
      <div>Card content</div>
    </ProCard>
    <ProCard
      title="小尺寸卡片"
      extra="extra"
      tooltip="这是提示"
      :style="{ maxWidth: '300px', marginTop: '24px' }"
      size="small"
    >
      <div>Card content</div>
      <div>Card content</div>
      <div>Card content</div>
    </ProCard>
  </div>
</template>

<script setup lang="ts">
import ProCard from '#/card'

console.log('Sub Test3 被创建了')
onMounted(() => {
  console.log('Sub Test3 被渲染了')
})

onActivated(() => {
  console.log('Sub Test3 被 keepAlive 恢复')
})
</script>

<script lang="ts">
export default {
  name: 'SubTest3'
}
</script>

<style scoped></style>
