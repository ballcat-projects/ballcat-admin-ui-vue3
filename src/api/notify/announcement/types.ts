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
 * 用户公告状态
 */
export enum UserAnnouncementStateEnum {
  // 未读(0)
  UNREAD = 0,
  // 已读(1)
  READ = 1
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
  recipientFilterCondition?: any[]
  //接收方式
  receiveMode: number[]
  //状态
  status: AnnouncementStatusEnum
  //永久有效的
  immortal: number
  //截止日期
  deadline?: string
}

/**
 * 公告信息传输实体, 修改时 id 为空
 */
export type AnnouncementDTO = Omit<Announcement, 'id'> & {
  //ID
  id?: number
}

/**
 * 公告信息分页视图对象
 */
export type AnnouncementPageVO = Announcement & {
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
 * 用户公告信息
 */
export type UserAnnouncementVO = {
  //公告ID
  id: number
  //标题
  title: string
  //内容
  content: string
  //状态
  state: UserAnnouncementStateEnum
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
 * 公告 websocket 推送消息体
 */
export type AnnouncementPushMessage = {
  type: 'announcement-push'
  //ID
  id: number
  //标题
  title: string
  //内容
  content: string
  //永久有效的
  immortal: number
  //截止日期
  deadline: string
}

/**
 * 公告 websocket 关闭消息体
 */
export type AnnouncementCloseMessage = {
  type: 'announcement-close'
  //ID
  id: number
}
