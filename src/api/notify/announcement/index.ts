import httpClient from '@/utils/axios'
import type { ApiResult } from '@/api/types'
import type {
  Announcement,
  AnnouncementDTO,
  AnnouncementPageParam,
  AnnouncementPageVO
} from '@/api/notify/announcement/types'
import type { FileObject } from '@/components/CropperModal/types'

export function getAnnouncementPage(query: AnnouncementPageParam) {
  return httpClient.get<ApiResult<AnnouncementPageVO>>('/notify/announcement/page', {
    params: query
  })
}

export function addAnnouncement(obj: AnnouncementDTO) {
  return httpClient.post<ApiResult<void>>('/notify/announcement', obj)
}

export function delAnnouncement(id: number) {
  return httpClient.delete<ApiResult<void>>('/notify/announcement/' + id)
}

export function updateAnnouncement(obj: AnnouncementDTO) {
  return httpClient.put<ApiResult<void>>('/notify/announcement', obj)
}

export function publish(id: number) {
  return httpClient.patch<ApiResult<void>>('/notify/announcement/publish/' + id)
}

export function close(id: number) {
  return httpClient.patch<ApiResult<void>>('/notify/announcement/close/' + id)
}

export function uploadImage(resultFiles: FileObject[]) {
  const formData = new FormData()
  resultFiles.forEach(file => {
    formData.append('files', file.data, file.name)
  })
  return httpClient.postForm<ApiResult<string>>('/notify/announcement/image', formData)
}

export function getUserAnnouncements() {
  return httpClient.get<ApiResult<Announcement[]>>('/notify/announcement/user')
}

export function readAnnouncement(announcementId: number) {
  return httpClient.patch('/notify/user-announcement/read/' + announcementId)
}
