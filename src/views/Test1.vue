<template>
  <grid-content style="font-size: 18px" class="test-class" @click="handleClick">
    <div style="height: 500px">这就是 Test1 的呢日哦那个</div>
  </grid-content>
</template>

<script setup lang="ts">
import GridContent from '#/layout/components/GridContent'

console.log('Test1 被创建了')

const handleClick = () => {
  console.log('我被点击了')
}
</script>

<script lang="ts">
export default {
  name: 'TestFirst'
}
</script>

<style scoped></style>
