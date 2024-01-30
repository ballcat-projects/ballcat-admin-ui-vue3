import httpClient from '@/utils/axios'
import type { ApiResult } from '@/api/types'
import type {
  AnnouncementDTO,
  AnnouncementPageParam,
  AnnouncementPageVO,
  UserAnnouncementVO
} from './types'
import type { FileObject } from '@/components/CropperModal/types'

/**
 * 分页查询公告
 * @param query 分页查询参数
 */
export function pageAnnouncements(query: AnnouncementPageParam) {
  return httpClient.get<ApiResult<AnnouncementPageVO>>('/notify/announcement/page', {
    params: query
  })
}

/**
 * 创建公告信息
 * @param announcementDTO
 */
export function createAnnouncement(announcementDTO: AnnouncementDTO) {
  return httpClient.post<ApiResult<void>>('/notify/announcement', announcementDTO)
}

/**
 * 修改公告信息
 * @param announcementDTO
 */
export function updateAnnouncement(announcementDTO: AnnouncementDTO) {
  return httpClient.put<ApiResult<void>>('/notify/announcement', announcementDTO)
}

/**
 * 删除公告信息
 * @param id 公告id
 */
export function deleteAnnouncement(id: number) {
  return httpClient.delete<ApiResult<void>>('/notify/announcement/' + id)
}

/**
 * 发布公告信息
 * @param id 公告id
 */
export function publishAnnouncement(id: number) {
  return httpClient.patch<ApiResult<void>>('/notify/announcement/publish/' + id)
}

/**
 * 关闭公告信息
 * @param id 公告id
 */
export function closeAnnouncement(id: number) {
  return httpClient.patch<ApiResult<void>>('/notify/announcement/close/' + id)
}

/**
 * 上传公告图片
 * @param resultFiles
 */
export function uploadAnnouncementImage(resultFiles: FileObject[]) {
  const formData = new FormData()
  resultFiles.forEach(file => {
    formData.append('files', file.data, file.name)
  })
  return httpClient.postForm<ApiResult<string>>('/notify/announcement/image', formData)
}

export function getUserAnnouncements() {
  return httpClient.get<ApiResult<UserAnnouncementVO[]>>('/notify/user-announcement/list')
}

export function readAnnouncement(announcementId: number) {
  return httpClient.patch('/notify/user-announcement/read/' + announcementId)
}
