import { createRouter, createWebHistory } from 'vue-router'
import routerGuards from '@/router/guards'
import constantRoutes from '@/router/constant-routes'

const WHITE_NAME_LIST: string[] = ['Login', 'GlobalNotFound']

const router = createRouter({
  routes: constantRoutes,
  history: createWebHistory(import.meta.env.BASE_URL)
})
// 路由守卫
routerGuards(router)

export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export default router
