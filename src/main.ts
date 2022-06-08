import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'

// 全局样式
import '@/styles/index.less'
import { setupGlobDirectives } from '@/directives'

import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// 自定义指令
setupGlobDirectives(app)

app.mount('#app')
