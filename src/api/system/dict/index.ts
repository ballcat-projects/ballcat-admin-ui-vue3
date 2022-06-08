import httpClient from '@/utils/axios'
import type { DictDataVO, DictHashData } from '@/api/system/dict/types'
import type { ApiResult } from '@/api/types'

export function getDictData(dictCodes: string[]) {
  return httpClient.get<ApiResult<DictDataVO[]>>('/system/dict/data', {
    params: { dictCodes: dictCodes.join(',') }
  })
}

/**
 * 通过指定的 hash 值，去获取 hash 已经失效的 dictCode 列表
 */
export function invalidDictHash(dictHashData: DictHashData) {
  return httpClient.post<ApiResult<string[]>>('/system/dict/invalid-hash', dictHashData)
}
