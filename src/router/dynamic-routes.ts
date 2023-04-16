import { listToTree } from '@/utils/tree-utils'
import { firstUpperCase } from '@/utils/str-utils'
import type { SysMenuRouterVO } from '@/api/system/menu/types'
import type { RouteMeta, RouteRecordRaw } from 'vue-router'
import { buildNotFoundRoute, ExceptionComponentImport } from '@/router/constant-routes'

type SysMenuRouterTree = SysMenuRouterVO & { key: number; children: SysMenuRouterTree[] }

// 动态组件模块
const dynamicViewModules = import.meta.glob('/src/views/**/*.{vue,tsx}')

// 根路由
const HOME_ROUTE: RouteRecordRaw = {
  path: '/',
  name: '/',
  component: () => import('@/layouts/BasicLayout.vue'),
  meta: {
    keepAlive: false
  },
  children: []
}

export const generatorDynamicRouter = (userMenus: SysMenuRouterVO[]): RouteRecordRaw => {
  const routes: RouteRecordRaw = { ...HOME_ROUTE }
  // 后端数据, 根级树数组,  根级 PID
  const menuTree = listToTree(userMenus, 0) as SysMenuRouterTree[]
  routes.children = menuToRoutes(menuTree)
  routes.children.push(buildNotFoundRoute('PageNotFound'))
  fillRedirect(routes)

  return routes
}

const menuToRoutes = (menuTree: SysMenuRouterTree[], parent?: RouteRecordRaw) => {
  return menuTree.map(item => {
    // 内容打开方式
    const targetType = item.targetType
    let path = `${(parent && parent.path) || ''}/${item.path}`

    // 路由名称，由路由地址生成，大驼峰形式
    const name = path
      .replace('-', '/')
      .split('/')
      .filter(x => x && x !== '')
      .map(x => firstUpperCase(x))
      .join('')

    const meta: RouteMeta = {
      name: item.title,
      icon: item.icon || undefined,
      targetType: targetType
    }

    let component
    switch (item.type) {
      case 0:
        // 目录类型组件, 固定使用 RouterLayout
        component = () => import('@/layouts/RouterLayout.vue')
        break
      case 1:
        // 菜单类型需要拼接组件地址
        if (targetType === 1) {
          // 内置组件
          item.uri && (component = getComponent(item.uri))
        } else if (targetType === 2) {
          // 内嵌iframe
          meta.target = item.uri
          component = () => import('@/views/basic/iframe/index.vue')
        } else if (targetType === 3) {
          // 外链
          path = item.uri
          meta.target = item.uri
          meta.hideInTab = true
        }
    }

    // 是否设置了隐藏菜单
    if (item.hidden === 1) {
      meta.hideInMenu = true
    }

    // @ts-ignore
    const currentRouter: RouteRecordRaw = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path,
      // 路由名称，建议唯一
      name,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta,
      // 组件
      component
    }

    // 有子菜单则递归处理
    if (item.children && item.children.length > 0) {
      // 给子节点添加一个默认的 404 页面，以便在 content 中显示 404
      currentRouter.children = menuToRoutes(item.children, currentRouter)
      fillRedirect(currentRouter)
    }
    return currentRouter
  })
}

/**
 * 设置当前路由的默认跳转地址为其子路由的path
 * @param currentRouter
 */
function fillRedirect(currentRouter: RouteRecordRaw) {
  if (!currentRouter.children) return
  const redirectRouter = currentRouter.children.find(x => !x.meta?.hideInMenu)
  redirectRouter && (currentRouter.redirect = redirectRouter.path)
}

/**
 * 动态获取组件
 * @param componentPath 组件地址
 */
const getComponent = function (componentPath: string) {
  // 如果有后缀，直接返回
  const isFullPath = componentPath.endsWith('.vue') || componentPath.endsWith('.tsx')
  if (isFullPath) {
    return dynamicViewModules[componentPath]
  }

  // 没有后缀的情况下，按顺序尝试加载
  let viewModule = dynamicViewModules[`/src/views/${componentPath}.vue`]
  if (!viewModule) {
    viewModule = dynamicViewModules[`/src/views/${componentPath}/index.vue`]
  }
  if (!viewModule) {
    viewModule = dynamicViewModules[`/src/views/${componentPath}.tsx`]
  }
  if (!viewModule) {
    viewModule = dynamicViewModules[`/src/views/${componentPath}/index.tsx`]
  }
  if (!viewModule) {
    import.meta.env.DEV &&
      console.warn(
        '在src/views/下找不到`' +
          componentPath +
          '.vue` 或 `' +
          componentPath +
          '.tsx`, 请自行创建!'
      )
    viewModule = ExceptionComponentImport
  }

  return viewModule
}
