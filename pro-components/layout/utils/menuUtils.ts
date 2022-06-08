import type { RouteRecordRaw } from 'vue-router'
import type { MenuDataItem } from '../types'
import { isUrl, notNullArray } from './checkUtils'

/**
 * 如果不是 / 开头的和父节点做一下合并
 * 如果是 / 开头的不作任何处理
 * 如果是 url 也直接返回
 * @param path
 * @param parentPath
 */
const mergePath = (path = '', parentPath = '/') => {
  if ((path || parentPath).startsWith('/')) {
    return path
  }
  if (isUrl(path)) {
    return path
  }
  return `/${parentPath}/${path}`.replace(/\/\//g, '/').replace(/\/\//g, '/')
}

function toMenuItem(routeList?: RouteRecordRaw[], parentPath?: string) {
  if (routeList == null || !Array.isArray(routeList) || routeList.length === 0) {
    return
  }
  return routeList.map(route => {
    const path = mergePath(route.path, parentPath)
    const menuDataItem: MenuDataItem = {
      ...route.meta,
      key: path,
      path: path
    }

    if (notNullArray(route.children)) {
      menuDataItem.children = toMenuItem(route.children, path)
    }
    return menuDataItem
  })
}

export function transformRouteToMenuItem(routes: RouteRecordRaw[], parentPath = '/') {
  const parentRoute = routes.find(route => route.path === parentPath)
  return toMenuItem(parentRoute?.children)
}

export const getOpenKeysFromMenuData = (menuData?: MenuDataItem[]) => {
  return (menuData || []).reduce((pre, item) => {
    if (item.key) {
      pre.push(item.key)
    }
    if (item.children) {
      const newArray: string[] = pre.concat(getOpenKeysFromMenuData(item.children) || [])
      return newArray
    }
    return pre
  }, [] as string[])
}
