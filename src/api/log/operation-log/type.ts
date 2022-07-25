import type { PageParam } from '@/api/types'

/**
 * 操作日志查询对象
 */
export interface OperationLogQO {
  // 追踪ID
  traceId?: string
  // 用户名
  userId?: number
  // 日志信息
  msg?: string
  // 访问IP地址
  ip?: string
  // 请求URI
  uri?: string
  // 操作状态
  status?: number
  // 操作类型
  type?: number
  // 访问时间区间的开始值
  startTime?: string
  // 访问时间区间的结束值
  endTime?: string
}

/**
 * 操作日志分页参数
 */
export type OperationLogPageParam = OperationLogQO & PageParam
