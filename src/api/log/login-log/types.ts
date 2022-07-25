import type { PageParam } from '@/api/types'

/**
 * 登陆日志查询对象
 */
export interface LoginLogQO {
  // 追踪ID
  traceId?: string
  // 用户名
  username?: string
  // 访问IP地址
  ip?: string
  // 状态
  status?: number
  // 事件类型
  eventType?: number
  // 访问时间区间的开始值
  startTime?: string
  // 访问时间区间的结束值
  endTime?: string
}

/**
 * 登陆日志分页参数
 */
export type LoginLogPageParam = LoginLogQO & PageParam
