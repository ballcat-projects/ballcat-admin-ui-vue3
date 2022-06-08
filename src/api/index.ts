import type { ApiResult } from '@/api/types'

export const isSuccess = (result: ApiResult) => {
  return result.code === 200
}
