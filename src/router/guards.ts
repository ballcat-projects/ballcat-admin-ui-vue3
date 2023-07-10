import NProgress from 'nprogress'
import '@/styles/nprogress.less'

import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import {
  AuthenticationMethod,
  authenticationMethod,
  loginPath,
  projectTitle,
  redirectPath
} from '@/config'
import { useUserStore } from '@/stores/user-store'
import { generatorDynamicRouter } from '@/router/dynamic-routes'

NProgress.configure({ showSpinner: false })

function checkLogin() {
  switch (authenticationMethod) {
    // 如果是 JSESSIONID, 由于 cookie 是 httpOnly 的，直接放行，交给服务端检测
    case AuthenticationMethod.COOKIE_JSESSIONID:
      return true
    // 如果是 ACCESS_TOKEN, 先判断下本地是否有存储
    case AuthenticationMethod.OAUTH2_ACCESS_TOKEN:
      return useUserStore().accessToken
  }
}

const routerGuards = (router: Router) => {
  router.beforeEach(async to => {
    NProgress.start()

    if (checkLogin()) {
      // 如果已经登录的情况下访问登录页，直接跳转到首页
      if (
        authenticationMethod === AuthenticationMethod.OAUTH2_ACCESS_TOKEN &&
        to.path === loginPath
      ) {
        NProgress.done()
        return { path: '/' }
      }

      // 如果是 layout 内部的页面，且没有动态路由，则更新
      const userStore = useUserStore()
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
        path: loginPath,
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
  if (!route?.path?.startsWith(`${redirectPath}/`)) {
    const pageTitle = route?.meta?.name
    document.title = pageTitle ? `${pageTitle} - ${projectTitle}` : projectTitle
  }
}

export default routerGuards
