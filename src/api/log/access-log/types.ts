import type { PageParam } from '@/api/types'

/**
 * 访问日志查询对象
 */
export interface AccessLogQO {
  // 追踪ID
  traceId?: string
  // 用户ID
  userId?: number
  // 访问IP地址
  ip?: string
  // 请求Uri
  uri?: string
  // 请求映射地址
  matchingPattern?: string
  // 响应状态码
  httpStatus?: number
  // 访问时间区间的开始值
  startTime?: string
  // 访问时间区间的结束值
  endTime?: string
}

/**
 * 访问日志分页参数
 */
export type AccessLogPageParam = AccessLogQO & PageParam
