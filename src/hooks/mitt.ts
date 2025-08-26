import mitt from 'mitt'
import type {
  AnnouncementCloseMessage,
  AnnouncementPushMessage
} from '@/api/notify/announcement/types'

type Events = {
  // 切换语言
  'switch-language': string
  // 推送公告
  'announcement-push': AnnouncementPushMessage
  // 关闭公告
  'announcement-close': AnnouncementCloseMessage
  // 关闭当前tab页
  'close-current-tab': void
}

export const emitter = mitt<Events>()
