import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import { install as installI18n } from '@/locales'

// 全局样式
import '@/styles/global.less'
// ant-design-vue 的 message、notification（由于按需加载组件无法自动处理，这里直接全局引入）
import 'ant-design-vue/es/message/style/index.less'
import 'ant-design-vue/es/notification/style/index.less'
import 'ant-design-vue/es/modal/style/index.less'

import App from './App.vue'
import { enableI18n } from '@/config'

const app = createApp(App)
app.use(createPinia())

if (enableI18n) {
  // 加载完 i18n 文件后再注册路由和渲染，防止发起请求时 401，错误弹窗无法国际化
  installI18n(app).then(() => {
    app.use(router)
    app.mount('#app')
  })
} else {
  app.use(router)
  app.mount('#app')
}
