<template>
  <pro-layout
    :title="projectTitle"
    style="min-height: 100vh"
    v-bind="settingStore.setting"
    :collapsed="collapsed"
    :on-collapse="toggleCollapsed"
    :routes="routes"
    :match-menu-keys="menuState.matchMenuKeys"
    :menu="{
      defaultOpenAll: true
    }"
    iconfont-url="//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js"
    :class="className"
    @menu-header-click="toHome"
  >
    <template #logo>
      <img src="@/assets/logo.png" alt="logo" />
    </template>

    <template #rightContentRender>
      <right-content />
    </template>

    <template #menuFooterRender="props">
      <a
        :style="{
          display: 'flex',
          height: '16px',
          color: 'rgba(255, 255, 255, 0.65)',
          alignItems: 'center'
        }"
        href="https://preview.pro.ant.design/dashboard/analysis"
        target="_blank"
        rel="noreferrer"
      >
        <img
          alt="pro-logo"
          src="https://procomponents.ant.design/favicon.ico"
          :style="{
            width: '16px',
            height: '16px',
            margin: '0 16px',
            marginRight: 10
          }"
        />
        <template v-if="!props?.collapsed"> Preview Pro</template>
      </a>
    </template>

    <!--    <template #headerContentRender>-->
    <!--      header-->
    <!--      <a-button @click="test">设置</a-button>-->
    <!--      <a-button @click="fixHeader">固定头部</a-button>-->
    <!--    </template>-->

    <template #multiTabRender="props">
      <!-- 公告彩条 -->
      <announcement-ribbon />
      <multi-tab v-bind="props" @fullscreen-change="handleFullScreenChange" />
    </template>

    <!-- default 的 slot 写不写都行，这里主要是为了布局的顺序性 -->
    <template #default>
      <router-layout />
    </template>

    <template #footerRender>
      <ballcat-footer />
    </template>
  </pro-layout>

  <setting-drawer
    v-if="enableLayoutSetting"
    v-model:collapse="settingDrawerCollapse"
    v-model:settings="settingStore.setting"
  />
</template>

<script setup lang="ts">
import BallcatFooter from '@/layouts/components/Footer/BallcatFooter.vue'
import ProLayout from '#/layout/BasicLayout'
import SettingDrawer from '#/layout/components/SettingDrawer'
import MultiTab from '@/layouts/components/MultiTab'
import { useSettingStore } from '@/stores/setting-store'
import type { Key } from 'ant-design-vue/es/_util/type'
import RouterLayout from '@/layouts/RouterLayout.vue'
import { projectTitle, enableLayoutSetting, enableWebsocket } from '@/config'
import RightContent from '@/layouts/components/RightContent/index.vue'
import AnnouncementRibbon from '@/components/Notify/AnnouncementRibbon.vue'
import useAdminWebSocket from '@/hooks/websocket'
import router from '@/router'
import { emitter } from '@/hooks/mitt'
import type { RouteRecordNormalized } from 'vue-router'

// 开启 websocket
enableWebsocket && useAdminWebSocket()

const collapsed = ref(false)
const toggleCollapsed = (isCollapsed: boolean) => {
  collapsed.value = isCollapsed
  console.log(collapsed.value)
}

// 设置弹窗的控制
const settingDrawerCollapse = ref(false)
watchEffect(() => {
  console.log(settingDrawerCollapse.value, '切换了开关')
})

// 布局设置
const settingStore = useSettingStore()
watch(
  () => settingStore.setting,
  () => {
    console.log(settingStore.setting)
  },
  { deep: true }
)

const route = useRoute()

const menuState = reactive<{
  selectedKeys: string[]
  matchMenuKeys: string[]
  openKeys: Key[]
}>({
  selectedKeys: [],
  matchMenuKeys: [],
  openKeys: route.matched.filter(r => r.path !== route.path && r.path !== '/').map(r => r.path)
})

watchEffect(() => {
  const matchedRoutes = route.matched
  menuState.selectedKeys = matchedRoutes.filter(x => x.path !== '/').map(x => x.path)
  menuState.matchMenuKeys = matchedRoutes.filter(x => x.path !== '/').map(x => x.path)
})

const routes = ref<RouteRecordNormalized[]>([])
function setRoutes() {
  return (routes.value = router.getRoutes())
}
setRoutes()
emitter.on('switch-language', setRoutes)
onUnmounted(() => emitter.off('switch-language', setRoutes))

const toHome = () => {
  router.push({ path: '/' })
}

const className = ref('')
const handleFullScreenChange = (isFullScreen: boolean) => {
  className.value = isFullScreen ? 'ballcat-content-fullscreen' : ''
}
</script>

<style scoped></style>
