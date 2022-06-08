import httpClient from '@/utils/axios'
import type { SysMenuGrantVO, SysMenuRouterVO } from '@/api/system/menu/types'
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
