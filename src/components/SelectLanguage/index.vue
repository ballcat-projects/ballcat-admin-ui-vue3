<template>
  <a-dropdown>
    <TranslationOutlined style="font-size: 18px" />

    <template #overlay>
      <a-menu :selected-keys="[i18nStore.language]">
        <a-menu-item
          v-for="language of supportLanguage"
          :key="language.lang"
          @click="switchLanguage(language.lang)"
        >
          <span role="img" :aria-label="language.title">{{ language.symbol }}</span>
          {{ language.title }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script setup lang="ts">
import { TranslationOutlined } from '@ant-design/icons-vue'
import { useI18nStore } from '@/stores/i18n-store'
import { loadLanguageAsync } from '@/locales'
import { useUserStore } from '@/stores/user-store'
import { generatorDynamicRouter } from '@/router/dynamic-routes'
import router, { resetRouter } from '@/router'
import { emitter } from '@/hooks/mitt'
import { supportLanguage } from '@/config'

const i18nStore = useI18nStore()
const userStore = useUserStore()

const switchLanguage = (local: string) => {
  // 切换语言
  i18nStore.setLanguage(local)
  // 加载语言文件
  loadLanguageAsync(local)
  // 刷新用户菜单
  userStore.fetchUserMenus().then(userMenus => {
    const dynamicRouter = generatorDynamicRouter(userMenus)
    resetRouter()
    router.addRoute(dynamicRouter)
    // 发送切换语言事件，多页签会接收此事件，进行多语言切换
    emitter.emit('switch-language', local)
  })
}
</script>

<script lang="ts">
export default {
  name: 'SelectLanguage'
}
</script>
