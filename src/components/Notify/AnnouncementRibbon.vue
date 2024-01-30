<template>
  <div v-if="announcementNum > 0" class="text-container">
    <transition class="" name="slide" mode="out-in">
      <span v-if="announcement" :key="announcement.id" class="announcement-content">
        <SoundOutlined />
        <a href="javascript:" class="text" @click="readAnnouncement">{{ announcement.title }}</a>
      </span>
    </transition>
    <announcement-modal ref="announcementModalRef" />
  </div>
</template>

<script lang="ts" setup>
import { getUserAnnouncements } from '@/api/notify/announcement'
import { emitter } from '@/hooks/mitt'
import { AnnouncementModal } from '@/components/Notify/AnnouncementModal'
import type {
  Announcement,
  AnnouncementCloseMessage,
  AnnouncementPushMessage
} from '@/api/notify/announcement/types'
import { UserAnnouncementStateEnum } from '@/api/notify/announcement/types'

const announcementModalRef = ref()

const activeIndex = ref(0) // 当前索引
const intervalId = ref() // 定时器ID
const playTime = ref(4000) // 定时器执行间隔
const announcements = ref<Pick<Announcement, 'id' | 'title' | 'content'>[]>([]) // 公告信息

const announcementNum = computed(() => {
  return announcements.value.length
})
const announcement = computed(() => {
  return announcements.value[activeIndex.value]
})

const readAnnouncement = () => {
  // 展示公告
  announcementModalRef.value.show({ ...announcement.value })
}
const onAnnouncementPush = (data: AnnouncementPushMessage) => {
  // 添加公告
  const announcement = {
    id: data.id,
    title: data.title,
    content: data.content,
    state: UserAnnouncementStateEnum.UNREAD
  }
  announcements.value.push(announcement)
}
const onAnnouncementClose = (data: AnnouncementCloseMessage) => {
  announcements.value.splice(
    announcements.value.findIndex(item => item.id === data.id),
    1
  )
}

onMounted(() => {
  // 获取公告信息
  getUserAnnouncements().then(res => {
    announcements.value = res.data
  })
  // 定义定时器
  intervalId.value = setInterval(() => {
    if (activeIndex.value < announcementNum.value - 1) {
      activeIndex.value++ // 自增
    } else {
      activeIndex.value = 0
    }
  }, playTime.value)
  // 注册监听事件
  emitter.on('announcement-push', onAnnouncementPush)
  emitter.on('announcement-close', onAnnouncementClose)
})

onUnmounted(() => {
  // 清除定时器
  clearInterval(intervalId.value)
  // 删除事件监听
  emitter.off('announcement-push', onAnnouncementPush)
  emitter.off('announcement-close', onAnnouncementClose)
})
</script>
<script lang="ts">
export default {
  name: 'AnnouncementRibbon'
}
</script>

<style scoped>
.text-container {
  font-size: 14px;
  color: #f56b6b;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  min-height: 32px;
  position: relative;
  background: rgb(230, 247, 255);
  padding-left: 18px;
}

.text {
  color: #f56b6b;
  display: inline;
  padding-left: 12px;
}

.announcement-content {
  width: 100%;
  position: absolute;
  text-align: left;
  line-height: 32px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.8s linear;
}

.slide-enter {
  transform: translateY(20px);
  opacity: 1;
}

.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
