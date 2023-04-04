import type { PageParam } from '@/api/types'


/**
 * 公告状态
 */
export enum AnnouncementStatus {
  // 已关闭
  DEFAULT = 0,
  // 已发布
  PROCESSING = 1,
  //待发布
  WARNING = 2
}

/**
 * 公告列表分页参数
 */
export type AnnouncementPageParam = AnnouncementQO & PageParam

export type AnnouncementQO = {
  //标题
  title?: string
  //接收人筛选方式
  recipientFilterType?: number
  //状态
  status?: AnnouncementStatus[]
}

/**
 * 公告信息分页VO
 */
export type AnnouncementPageVO = {
  //ID
  id: number
  //标题
  title: string
  //内容
  content: string
  //接收人筛选方式
  recipientFilterType: number

  //对应接收人筛选方式的条件信息。如角色标识，组织ID，用户类型，用户ID等
  recipientFilterCondition: object[]

  //接收方式
  receiveMode: number[]
  //状态
  status: AnnouncementStatus
  //永久有效的
  immortal: number
  //截止日期
  deadline: string
  //创建人ID
  createBy: number
  //创建人名称
  createUsername: string
  //创建时间
  createTime: string
  //更新时间
  updateTime: string
}

/**
 * 公告信息传输实体
 */
export type AnnouncementDTO = {
  //ID
  id?: number
  //标题
  title: string
  //内容
  content: string
  //接收人筛选方式
  recipientFilterType: number

  //对应接收人筛选方式的条件信息。如角色标识，组织ID，用户类型，用户ID等
  recipientFilterCondition: object[]

  //接收方式
  receiveMode: number[]
  //状态
  status: AnnouncementStatus
  //永久有效的
  immortal: number
  //截止日期
  deadline: string
}
/**
 * 用户公告信息
 */
export type Announcement = {
  //ID
  id: number
  //标题
  title: string
  //内容
  content: string
  //接收人筛选方式
  recipientFilterType: number

  //对应接收人筛选方式的条件信息。如角色标识，组织ID，用户类型，用户ID等
  recipientFilterCondition: object[]

  //接收方式
  receiveMode: number[]
  //状态
  status: AnnouncementStatus
  //永久有效的
  immortal: number
  //截止日期
  deadline: string
}
