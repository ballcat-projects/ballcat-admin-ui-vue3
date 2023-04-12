import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'

// 全局样式
import '@/styles/global.less'
// ant-design-vue 的 message、notification（由于按需加载组件无法自动处理，这里直接全局引入）
import 'ant-design-vue/es/message/style/index.less'
import 'ant-design-vue/es/notification/style/index.less'
import 'ant-design-vue/es/modal/style/index.less'

import { setupGlobDirectives } from '@/directives'

// i18n
import { createI18n } from 'vue-i18n'
import { messages as i18nMessages } from '@/locale'
import { DEFAULT_LANGUAGE } from '@/constants'

import App from './App.vue'

const i18n = createI18n({
  local: DEFAULT_LANGUAGE,
  globalInjection: true,
  legacy: false,
  fallbackLocale: DEFAULT_LANGUAGE,
  messages: i18nMessages
})

const app = createApp(App)
app.use(createPinia())
app.use(router)

i18n.install(app)

// 自定义指令
setupGlobDirectives(app)

app.mount('#app')
