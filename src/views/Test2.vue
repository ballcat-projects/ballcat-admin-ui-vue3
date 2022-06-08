<template>
  <PageContainer
    title="这是一个标题"
    sub-title="This is a subtitle"
    content="欢迎使用 ProLayout 组件"
    :tab-list="[
      {
        tab: '基本信息',
        key: 'base'
      },
      {
        tab: '详细信息',
        key: 'info'
      }
    ]"
  >
    <template #extra>
      <a-button key="3">操作</a-button>
      <a-button key="2">操作</a-button>
      <a-button key="1" type="primary"> 主操作 </a-button>
    </template>

    <div>这是 test2 的页面呢</div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '#/layout/components/PageContainer'

console.log('Test2 被创建了')
</script>

<script lang="ts">
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Test2'
}
</script>

<style scoped></style>
