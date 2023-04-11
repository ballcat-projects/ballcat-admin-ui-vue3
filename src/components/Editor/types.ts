import type { ApiResult } from '@/api/types'
import type { FileObject } from '@/components/CropperModal/types'

export type InsertFnType = (url: string, alt: string, href: string) => void

export type UploadFunction = (files: FileObject[]) => Promise<ApiResult<string>>
