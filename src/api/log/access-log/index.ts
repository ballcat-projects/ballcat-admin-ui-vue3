import httpClient from '@/utils/axios'
import type { ApiResult } from '@/api/types'
import type { AccessLogPageParam } from '@/api/log/access-log/types'

/**
 * 访问日志分页查询
 * @param pageParams 分页参数
 */
export function pageAccessLogs(pageParams: AccessLogPageParam) {
  return httpClient.get<ApiResult>('/log/access-log/page', {
    params: pageParams
  })
}
