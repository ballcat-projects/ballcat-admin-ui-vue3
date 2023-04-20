import httpClient from '@/utils/axios'
import type { ApiResult } from '@/api/types'
import type { SysOrganizationDTO, SysOrganizationVO } from '@/api/system/organization/types'

/**
 * 查询组织机构列表
 */
export function listOrganizations() {
  return httpClient.get<ApiResult<SysOrganizationVO[]>>('/system/organization/list')
}

/**
 * 新建组织
 * @param data
 */
export function createOrganization(data: SysOrganizationDTO) {
  return httpClient.post<ApiResult<void>>('/system/organization', data)
}

/**
 * 修改组织
 * @param data
 */
export function updateOrganization(data: SysOrganizationDTO) {
  return httpClient.put<ApiResult<void>>('/system/organization', data)
}

/**
 * 删除组织
 * @param id 组织id
 */
export function deleteOrganization(id: number) {
  return httpClient.delete<ApiResult<void>>(`/system/organization/${id}`)
}

/**
 * 修正组织机构层级
 */
export function revisedOrganization() {
  return httpClient.patch<ApiResult<void>>('/system/organization/revised')
}
