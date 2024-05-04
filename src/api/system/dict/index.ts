import httpClient from '@/utils/axios'
import type {
  DictDataVO,
  DictHashData,
  SysDictDTO,
  SysDictItemDTO,
  SysDictItemPageParam,
  SysDictPageParam,
  SysDictPageVO
} from '@/api/system/dict/types'
import type { ApiResult } from '@/api/types'
import type { DictItemStatus } from '@/api/system/dict/types'

/**
 * 根据指定的字典标识获取字典数据
 * @param dictCodes 字典标识数组
 */
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

/**
 * 分页查询字典
 * @param query 分页查询参数
 */
export function pageDicts(query?: SysDictPageParam) {
  return httpClient.get<ApiResult<SysDictPageVO>>('/system/dict/page', {
    params: query
  })
}

/**
 * 新建字典
 * @param dictCreateDto 新建字典的传输对象
 */
export function createDict(dictCreateDto: SysDictDTO) {
  return httpClient.post<ApiResult<void>>('/system/dict', dictCreateDto)
}

/**
 * 修改字典
 * @param dictUpdateDto 修改字典的传输对象
 */
export function updateDict(dictUpdateDto: SysDictDTO) {
  return httpClient.put<ApiResult<void>>('/system/dict', dictUpdateDto)
}

/**
 * 删除字典
 * @param id 字典id
 */
export function deleteDict(id: number) {
  return httpClient.delete<ApiResult<void>>(`/system/dict/${id}`)
}

/**
 * 通过id刷新hash值
 * @param id 字典ID
 */
export function refreshHash(id: number) {
  return httpClient.patch(`/system/dict/refresh/${id}`)
}

/**
 * 分页查询字典项
 * @param query 分页查询参数
 */
export function pageDictItems(query?: SysDictItemPageParam) {
  return httpClient.get<ApiResult<SysDictPageVO>>('/system/dict/item/page', {
    params: query
  })
}

/**
 * 新建字典项
 * @param dictItemCreateDto 新建字典项的传输对象
 */
export function createDictItem(dictItemCreateDto: SysDictItemDTO) {
  return httpClient.post<ApiResult<void>>('/system/dict/item', dictItemCreateDto)
}

/**
 * 修改字典项
 * @param dictItemUpdateDto 修改字典项的传输对象
 */
export function updateDictItem(dictItemUpdateDto: SysDictItemDTO) {
  return httpClient.put<ApiResult<void>>('/system/dict/item', dictItemUpdateDto)
}

/**
 * 删除字典项
 * @param id 字典项id
 */
export function removeDictItem(id: number) {
  return httpClient.delete<ApiResult<void>>(`/system/dict/item/${id}`)
}

/**
 * 修改字典项状态
 * @param id 字典项ID
 * @param status 状态
 */
export function updateDictItemStatus(id: number, status: DictItemStatus) {
  return httpClient.patch(`/system/dict/item/${id}?status=${status}`)
}
