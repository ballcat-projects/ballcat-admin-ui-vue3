import NProgress from 'nprogress'
import '@/styles/nprogress.less'

import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { LOGIN_PATH, PROJECT_TITLE, REDIRECT_PATH } from '@/constants'
import { useUserStore } from '@/stores/user-store'
import { generatorDynamicRouter } from '@/router/dynamic-routes'

NProgress.configure({ showSpinner: false })

const routerGuards = (router: Router) => {
  router.beforeEach(async to => {
    NProgress.start()

    const userStore = useUserStore()
    if (userStore.accessToken) {
      // 如果已经登录的情况下访问登录页，直接跳转到首页
      if (to.path === LOGIN_PATH) {
        NProgress.done()
        return { path: '/' }
      }

      // 如果是 layout 内部的页面，且没有动态路由，则更新
      if (!to.meta.withoutLayout && (!userStore.userMenus || userStore.userMenus.length === 0)) {
        const userMenus = await userStore.fetchUserMenus()
        if (userMenus) {
          const dynamicRouter = generatorDynamicRouter(userMenus)
          router.addRoute(dynamicRouter)
          return to.fullPath
        }
      }
    } else if (!to.meta.allowAnonymous) {
      // 如果没有登录，访问地址又不允许匿名访问，就跳转到登录页
      return {
        path: LOGIN_PATH,
        query: {
          redirect: to.fullPath
        }
      }
    }

    updateDocumentTitle(to)
    return true
  })

  router.afterEach(() => {
    NProgress.done()
  })
}

/** 更新标签页标题 */
const updateDocumentTitle = function (route: RouteLocationNormalizedLoaded) {
  if (!route?.path?.startsWith(`${REDIRECT_PATH}/`)) {
    const pageTitle = route?.meta?.name
    document.title = pageTitle ? `${pageTitle} - ${PROJECT_TITLE}` : PROJECT_TITLE
  }
}

export default routerGuards
