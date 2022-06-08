<template>
  <div style="height: 500px">
    这就是 Sub Test2 的呢日哦那个
    <a-button @click="getMenu">获取菜单</a-button>
  </div>
</template>

<script setup lang="ts">
import { getLoginUserMenus } from '@/api/system/menu'

const getMenu = () => {
  getLoginUserMenus().then(res => {
    console.log(res)
  })
}

console.log('Sub Test2 被创建了')
onMounted(() => {
  console.log('Sub Test2 被渲染了')
})

onActivated(() => {
  console.log('Sub Test2 被 keepAlive 恢复')
})
</script>

<script lang="ts">
export default {
  name: 'SubTest2'
}
</script>

<style scoped></style>
