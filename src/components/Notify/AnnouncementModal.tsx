import { Modal } from 'ant-design-vue'
import { readAnnouncement } from '@/api/notify/announcement'
import { UserAnnouncementStateEnum, type UserAnnouncementVO } from '@/api/notify/announcement/types'
import { NotificationOutlined } from '@ant-design/icons-vue'
import { defineComponent } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import '@/components/Editor/view.less'
import { emitter } from '@/hooks/mitt'

export const AnnouncementModal = defineComponent({
  name: 'AnnouncementModal',
  setup(props, { expose }) {
    function show(announcement: UserAnnouncementVO, isPreview = false) {
      Modal.info({
        title: announcement.title,
        width: 800,
        // JSX support
        icon: () => <NotificationOutlined />,
        content: () => <div class="editor-content-view" innerHTML={announcement.content}></div>,
        onOk: function () {
          // 不是预览且状态是未读
          if (!isPreview && announcement.state === UserAnnouncementStateEnum.UNREAD) {
            return readAnnouncement(announcement.id!).then(() => {
              emitter.emit('announcement-close', {
                id: announcement.id!,
                type: 'announcement-close'
              })
            })
          }
        }
      })
    }
    expose({ show })
  }
})
