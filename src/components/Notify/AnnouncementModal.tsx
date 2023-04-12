import { Modal } from 'ant-design-vue'
import { readAnnouncement } from '@/api/notify/announcement'
import type { AnnouncementDTO } from '@/api/notify/announcement/types'
import { NotificationOutlined } from '@ant-design/icons-vue'
import { defineComponent } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import './index.less'

export const AnnouncementModal = defineComponent({
  name: 'AnnouncementModal',
  setup(props, { expose }) {
    function show(announcement: AnnouncementDTO, isPreview = false) {
      Modal.info({
        title: announcement.title,
        width: 800,
        // JSX support
        icon: () => <NotificationOutlined />,
        content: () => <div class="preview" innerHTML={announcement.content}></div>,
        onOk: function () {
          // 不是预览且状态是未读
          if (!isPreview && announcement.status === 0) {
            return readAnnouncement(announcement.id!)
          }
        }
      })
    }

    expose({ show })
    return () => {}
  }
})
