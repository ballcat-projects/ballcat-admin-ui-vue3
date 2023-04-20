import httpClient from '@/utils/axios'
import type {
  SysMenuGrantVO,
  SysMenuVO,
  SysMenuQO,
  SysMenuRouterVO,
  SysMenuDTO
} from '@/api/system/menu/types'
import type { ApiResult } from '@/api/types'

/**
 * 获取当前登录用户拥有的菜单列表
 */
export function getLoginUserMenus() {
  return httpClient.get<ApiResult<SysMenuRouterVO[]>>('/system/menu/router')
}

/**
 * 获取授权菜单列表
 */
export function getMenuGrantList() {
  return httpClient.get<ApiResult<SysMenuGrantVO[]>>('/system/menu/grant-list')
}

/**
 * 获取菜单列表
 */
export function listMenus(query: SysMenuQO) {
  return httpClient.get<ApiResult<SysMenuVO[]>>('/system/menu/list', { params: query })
}

/**
 * 新建菜单
 * @param menuDto 菜单传输对象
 */
export function createMenu(menuDto: SysMenuDTO) {
  return httpClient.post<ApiResult<void>>('/system/menu', menuDto)
}

/**
 * 修改菜单
 * @param menuDto 菜单传输对象
 */
export function updateMenu(menuDto: SysMenuDTO) {
  return httpClient.put<ApiResult<void>>('/system/menu', menuDto)
}

/**
 * 删除菜单
 * @param menuId 菜单id
 */
export function deleteMenu(menuId: number) {
  return httpClient.delete<ApiResult<void>>(`/system/menu/${menuId}`)
}
