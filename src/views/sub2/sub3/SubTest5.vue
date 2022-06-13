<template>
  <div style="height: 500px">
    这就是 Sub Test2 的呢日哦那个
    <a-button @click="jump">跳转首页</a-button>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const jump = () => {
  router.push({ name: 'test3' })
}

console.log('Sub Test5 被创建了')
onMounted(() => {
  console.log('Sub Test5 被渲染了')
})

onActivated(() => {
  console.log('Sub Test5 被 keepAlive 恢复')
})
</script>

<script lang="ts">
export default {
  name: 'SubTest5'
}
</script>

<style scoped></style>
