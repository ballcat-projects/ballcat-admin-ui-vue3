import type { PageParam } from '@/api/types'

/**
 * 公告状态
 */
export enum AnnouncementStatusEnum {
  // 已关闭
  DISABLED = 0,
  // 开启的
  ENABLED = 1,
  // 未发布
  UNPUBLISHED = 2
}

/**
 * 公告信息查询对象
 */
export type AnnouncementQO = {
  // 标题
  title?: string
  // 接收人筛选方式
  recipientFilterType?: number
  // 状态
  status?: AnnouncementStatusEnum[]
}

/**
 * 公告信息分页参数
 */
export type AnnouncementPageParam = AnnouncementQO & PageParam

/**
 * 公告信息分页视图对象
 */
export type AnnouncementPageVO = {
  // ID
  id: number
  // 标题
  title: string
  // 内容
  content: string
  /**
   * 接收人筛选方式，1：全部 2：用户角色 3：组织机构 4：用户类型 5：自定义用户
   * @see NotifyRecipientFilterTypeEnum
   */
  recipientFilterType: number
  /**
   * 对应接收人筛选方式的条件信息，多个用逗号分割。如角色标识，组织ID，用户类型，用户ID等
   */
  recipientFilterCondition: unknown[]
  /**
   * 接收方式，值与通知渠道一一对应
   * @see NotifyChannelEnum
   */
  receiveMode: number[]
  // 状态
  status: AnnouncementStatusEnum
  // 永久有效的
  immortal: number
  // 截止日期
  deadline: string
  // 创建人ID
  createBy: number
  // 创建人名称
  createUsername: string
  // 创建时间
  createTime: string
  // 更新时间
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
  recipientFilterCondition: unknown[]
  //接收方式
  receiveMode: number[]
  //状态
  status: AnnouncementStatusEnum
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
  status: AnnouncementStatusEnum
  //永久有效的
  immortal: number
  //截止日期
  deadline: string
}
