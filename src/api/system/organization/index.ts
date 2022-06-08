import httpClient from '@/utils/axios'
import type { ApiResult } from '@/api/types'
import type { SysOrganizationVO } from '@/api/system/organization/types'

/** 查询组织机构列表 */
export function listOrganizations() {
  return httpClient.get<ApiResult<SysOrganizationVO[]>>('/system/organization/list')
}
