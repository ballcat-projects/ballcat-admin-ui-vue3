import httpClient from '@/utils/axios'
import type {
  SysRoleDTO,
  SysRolePageParam,
  SysRolePageVO,
  SysRoleUserPageParam,
  SysRoleUserVO
} from '@/api/system/role/types'
import type { ApiResult, SelectData } from '@/api/types'

/**
 * 分页查询角色
 * @param query 分页查询参数
 */
export function pageRoles(query?: SysRolePageParam) {
  return httpClient.get<ApiResult<SysRolePageVO>>('/system/role/page', {
    params: query
  })
}

/**
 * 新建角色
 * @param roleCreateDto 新建角色的传输对象
 */
export function createRole(roleCreateDto: SysRoleDTO) {
  return httpClient.post<ApiResult<void>>('/system/role', roleCreateDto)
}

/**
 * 修改角色
 * @param roleUpdateDto 更新角色的传输对象
 */
export function updateRole(roleUpdateDto: SysRoleDTO) {
  return httpClient.put<ApiResult<void>>('/system/role', roleUpdateDto)
}

/**
 * 删除角色
 * @param id 角色id
 */
export function deleteRole(id: number) {
  return httpClient.delete<ApiResult<void>>(`/system/role/${id}`)
}

/**
 * 获取角色的选择框数据
 */
export function listRoleSelectData() {
  return httpClient.get<ApiResult<SelectData[]>>('/system/role/select')
}

/**
 * 获取指定角色所拥有的权限 id 集合
 * @param roleCode 角色标识
 */
export function listRolePermissionIds(roleCode: string) {
  return httpClient.get<ApiResult<number[]>>(`/system/role/permission/code/${roleCode}`)
}

/**
 * 修改指定角色所拥有的权限 id
 * @param roleCode 角色标识
 * @param permissionIds 权限id 集合
 */
export function updateRolePermissionIds(roleCode: string, permissionIds: number[]) {
  return httpClient.put<ApiResult<void>>(`/system/role/permission/code/${roleCode}`, permissionIds)
}

/*
 * 分页查询角色绑定的用户
 */
export function pageRoleUsers(query: SysRoleUserPageParam) {
  return httpClient.get<ApiResult<SysRoleUserVO>>('/system/role/user/page', {
    params: query
  })
}

/**
 * 解绑用户和角色
 * @param userId 用户id
 * @param roleCode 角色标识
 */
export function unbindRoleUser(userId: number, roleCode: string) {
  return httpClient.delete<ApiResult<void>>('/system/role/user', {
    params: {
      userId: userId,
      roleCode: roleCode
    }
  })
}
