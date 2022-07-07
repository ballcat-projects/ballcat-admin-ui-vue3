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

import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// 自定义指令
setupGlobDirectives(app)

app.mount('#app')
