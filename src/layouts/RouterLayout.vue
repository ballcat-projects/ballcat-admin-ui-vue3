<template>
  <!-- 这里必须也要保持 keepAlive，否则嵌套路由处理时，子组件会被创建多次 -->
  <!-- eslint-disable-next-line vue/no-template-shadow -->
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="includeComponentNames">
      <component
        :is="multiTabStore.contentLoading ? emptyNode : Component"
        :key="getComponentKey(Component, route)"
      />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import { useMultiTabStore } from '@/stores/multitab-store'
import type { VNode, Component } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { emptyNodeName } from '@/config'

const emptyNode = h('div') as VNode

const multiTabStore = useMultiTabStore()
const includeComponentNames = computed(() => [...multiTabStore.cachedComponentNames])

// 如果是路由布局，则使用 ComponentName 作为 key，避免被识别为不同的组件导致 keepAlive 异常
const getComponentKey = (Component: VNode, route: RouteLocationNormalizedLoaded) => {
  if (multiTabStore.contentLoading) return emptyNodeName
  if (Component) {
    const componentName = (Component.type as Component).name
    return componentName === routerLayoutName ? routerLayoutName : route.fullPath
  }
}
</script>

<script lang="ts">
import { routerLayoutName } from '@/config'

export default {
  name: routerLayoutName
}
</script>
