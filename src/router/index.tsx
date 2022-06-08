import { createRouter, createWebHistory } from 'vue-router'
import routerGuards from '@/router/guards'
import constantRoutes from '@/router/constant-routes'

const router = createRouter({
  routes: constantRoutes,
  history: createWebHistory(import.meta.env.BASE_URL)
})
// 路由守卫
routerGuards(router)

export default router
