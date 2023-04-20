import httpClient from '@/utils/axios'
import type { FileObject } from '@/components/CropperModal/types'
import type { Key } from '@/utils/tree-utils'
import type {
  SysUserDTO,
  SysUserPageParam,
  SysUserPageVO,
  SysUserPassDTO,
  SysUserScope
} from '@/api/system/user/types'
import type { SysUserStatus } from '@/api/system/user/types'
import type { ApiResult } from '@/api/types'

/**
 * 分页查询用户
 * @param query 分页查询参数
 */
export function pageUsers(query: SysUserPageParam) {
  return httpClient.get<ApiResult<SysUserPageVO>>('/system/user/page', {
    params: query
  })
}

/**
 * 新建用户
 * @param useCreateDto 新建用户的传输对象
 */
export function createUser(useCreateDto: SysUserDTO) {
  return httpClient.post<ApiResult<void>>('/system/user', useCreateDto)
}

/**
 * 修改用户
 * @param userUpdateDto 用户更新的传输对象
 */
export function updateUser(userUpdateDto: SysUserDTO) {
  return httpClient.put<ApiResult<void>>('/system/user', userUpdateDto)
}

/**
 * 删除用户
 * @param userId 用户id
 */
export function deleteUser(userId: number) {
  return httpClient.delete<ApiResult<void>>(`/system/user/${userId}`)
}

/**
 * 修改用户状态
 * @param userIds 用户id 集合
 * @param status 修改的状态
 */
export function updateUserStatus(userIds: number[], status: SysUserStatus) {
  return httpClient.put<ApiResult<void>>('/system/user/status/', userIds, {
    params: { status: status }
  })
}

/**
 * 更新用户头像
 * @param userId 用户id
 * @param fileObj 头像文件
 */
export function updateUserAvatar(userId: Key, fileObj: FileObject) {
  const formData = new FormData()
  formData.append('file', fileObj.data, fileObj.name)
  formData.append('userId', userId + '')
  return httpClient.postForm<ApiResult<string>>('/system/user/avatar', formData)
}

/**
 * 查询用户角色
 * @param userId
 */
export function queryUserScope(userId: number) {
  return httpClient.get<ApiResult<SysUserScope>>(`/system/user/scope/${userId}`)
}

/**
 * 更新用户权限信息
 * @param userId
 * @param userScope
 */
export function updateUserScope(userId: number, userScope: SysUserScope) {
  return httpClient.put<ApiResult<void>>(`/system/user/scope/${userId}`, userScope)
}

/**
 * 更新用户密码
 * @param userId
 * @param data
 */
export function updateUserPassword(userId: number, data: SysUserPassDTO) {
  return httpClient.put<ApiResult<void>>(`/system/user/pass/${userId}`, data)
}
