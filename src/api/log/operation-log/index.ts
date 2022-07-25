import httpClient from '@/utils/axios'
import type { ApiResult } from '@/api/types'
import type { OperationLogQO } from '@/api/log/operation-log/type'

/**
 * 操作日志分页查询
 * @param pageParams 分页参数
 */
export function pageOperationLogs(pageParams: OperationLogQO) {
  return httpClient.get<ApiResult>('/log/operation-log/page', {
    params: pageParams
  })
}
