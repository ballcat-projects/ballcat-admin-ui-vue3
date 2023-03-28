import httpClient from '@/utils/axios'
import type { ApiResult } from '@/api/types'
import type { LoginLogPageParam } from '@/api/log/login-log/types'

/**
 * 登录日志分页查询
 * @param pageParams 分页参数
 */
export function pageLoginLogs(pageParams: LoginLogPageParam) {
  return httpClient.get<ApiResult>('/log/login-log/page', {
    params: pageParams
  })
}
