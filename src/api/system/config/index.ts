import httpClient from '@/utils/axios'
import type { ApiResult } from '@/api/types'
import type { SysConfigDTO, SysConfigPageParam, SysConfigPageVO } from '@/api/system/config/types'

/**
 * 系统配置分页查询
 * @param pageParams 分页参数
 */
export function pageConfigs(pageParams: SysConfigPageParam) {
  return httpClient.get<ApiResult<SysConfigPageVO>>('/system/config/page', {
    params: pageParams
  })
}

/**
 * 创建系统配置
 * @param dto
 */
export function createConfig(dto: SysConfigDTO) {
  return httpClient.post<ApiResult<void>>('/system/config', dto)
}

/**
 * 修改系统配置
 * @param dto
 */
export function updateConfig(dto: SysConfigDTO) {
  return httpClient.put<ApiResult<void>>('/system/config', dto)
}

/**
 * 删除系统配置
 * @param confKey 配置 key
 */
export function deleteConfig(confKey: string) {
  return httpClient.delete<ApiResult<void>>(`/system/config?confKey=${confKey}`)
}
