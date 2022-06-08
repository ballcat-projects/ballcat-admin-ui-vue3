import type { MenuDataItem } from '../types'

const childrenPropsName = 'routes'
function stripQueryStringAndHashFromPath(url: string) {
  return url.split('?')[0].split('#')[0]
}
/**
 * 获取打平的 menuData
 * 以 path 为 key
 * @param menuData
 */
export const getFlatMenus = (menuData: MenuDataItem[] = []) => {
  let menus: MenuDataItem = {}
  menuData.forEach(item => {
    if (!item || !item.key) {
      return
    }
    const routerChildren = item.children || item[childrenPropsName]
    menus[stripQueryStringAndHashFromPath(item.path || item.key || '/')] = {
      ...item
    }
    menus[item.key || item.path || '/'] = { ...item }
    if (routerChildren) {
      menus = { ...menus, ...getFlatMenus(routerChildren) }
    }
  })
  return menus
}

export default getFlatMenus
