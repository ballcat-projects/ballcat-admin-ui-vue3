import { createRouter, createWebHistory } from 'vue-router'
import routerGuards from '@/router/guards'
import constantRoutes, { constantRouteNames } from '@/router/constant-routes'

// 创建路由
const router = createRouter({
  routes: constantRoutes,
  history: createWebHistory(import.meta.env.BASE_URL)
})

// 路由守卫
routerGuards(router)

// 重制路由
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name } = route
    // 保留静态路由
    if (name && !constantRouteNames.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export default router
