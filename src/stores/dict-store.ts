import type { DictDataVO, DictHashData } from '@/api/system/dict/types'
import { getDictData, invalidDictHash } from '@/api/system/dict'
import { getStorageKey } from '@/utils/storage-utils'
import { useLocalStorage } from '@vueuse/core'

function getDictStorageKey(dictCode: string) {
  return getStorageKey(`dict:${dictCode}`)
}
const dictHashStorageKey = getStorageKey('dict-hash')

export const useDictStore = defineStore('dictStore', {
  state: () => ({
    dictDataCache: {} as Record<string, DictDataVO>,
    dictRequestLocks: {} as Record<string, boolean>,
    dictHash: useLocalStorage(dictHashStorageKey, {} as DictHashData, {
      writeDefaults: false
    })
  }),
  actions: {
    async getDictData(dictCode: string) {
      if (!dictCode) return

      const { dictDataCache: cache, dictRequestLocks: locks } = this

      // 优先从缓存中获取数据
      let dictData = cache[dictCode]
      if (dictData) return dictData

      // 再尝试从 LocalStorage 中获取数据
      const storeData = localStorage.getItem(getDictStorageKey(dictCode))
      if (storeData) {
        dictData = JSON.parse(storeData)
        cache[dictCode] = dictData
      }
      if (dictData) return dictData

      // 最后尝试从服务器获取数据，如果有锁标识已经在请求中了，不需要再处理了
      if (!locks[dictCode]) {
        locks[dictCode] = true
        try {
          const result = await getDictData([dictCode])
          if (Array.isArray(result.data) && result.data.length > 0) {
            dictData = result.data[0]
            cache[dictCode] = dictData
            localStorage.setItem(getDictStorageKey(dictCode), JSON.stringify(dictData))
            this.dictHash[dictCode] = dictData.hashCode
          }
        } finally {
          locks[dictCode] = false
        }
      }
      return dictData
    },
    async getDictDataItems(dictCode: string) {
      const dictData = await this.getDictData(dictCode)
      return dictData?.dictItems || []
    },
    /** 校验缓存数据 */
    async checkDictData() {
      const { dictDataCache, dictHash } = this
      // 如果有属性，则去后台查询是否过期
      if (dictHash && Object.getOwnPropertyNames(dictHash).length > 0) {
        const res = await invalidDictHash(dictHash)
        if (res.code === 200 && res.data) {
          // 删除对应过期数据
          for (const dictCode of res.data) {
            delete dictHash[dictCode]
            localStorage.removeItem(getDictStorageKey(dictCode))
            delete dictDataCache[dictCode]
          }
        }
      }
    }
  }
})

// 刷新页面后就检查一次数据是否可用
useDictStore().checkDictData()
