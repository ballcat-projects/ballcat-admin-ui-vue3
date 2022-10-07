<template>
  <a-dropdown placement="bottomRight">
    <span style="font-size: 16px">
      <TranslationOutlined />
    </span>
    <template #overlay>
      <a-menu @click="changeLang">
        <a-menu-item key="zh-CN">简体中文</a-menu-item>
        <a-menu-item key="en-US">English</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { TranslationOutlined } from '@ant-design/icons-vue'
import { switchLanguage } from '@/locales/setupI18n'
import type { MenuClickEventHandler } from 'ant-design-vue/lib/menu/src/interface'
import { useI18nStore } from '@/stores/i18n-store'
import router, { resetRouter } from '@/router'
import { useUserStore } from '@/stores/user-store'
import { generatorDynamicRouter } from '@/router/dynamic-routes'

const userStore = useUserStore()
const i18nStore = useI18nStore()

const changeLang: MenuClickEventHandler = async ({ key }) => {
  const { lang } = i18nStore

  if (key === lang) return
  switchLanguage(key as string)
  const userMenus = await userStore.fetchUserMenus()
  resetRouter()
  if (userMenus) {
    const dynamicRouter = generatorDynamicRouter(userMenus)
    router.addRoute(dynamicRouter)
  }
}
</script>
