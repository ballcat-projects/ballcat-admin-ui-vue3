import { request } from '@/utils/axios'
import type { ApiResult } from '@/api/types'
import type { LoginLogPageParam } from '@/api/log/login-log/types'

/**
 * 登录日志分页查询
 * @param pageParams 分页参数
 */
export function pageLoginLogs(pageParams: LoginLogPageParam) {
  return request<ApiResult>('/log/login-log/page', {
    method: 'get',
    params: pageParams
  })
}
