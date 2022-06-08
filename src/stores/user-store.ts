import { defineStore } from 'pinia'
import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { getStorageKey } from '@/utils/storage-utils'
import type { LoginUserInfo } from '@/api/auth/types'
import { getLoginUserMenus } from '@/api/system/menu'
import type { SysMenuRouterVO } from '@/api/system/menu/types'

export interface UserInfo extends LoginUserInfo {
  roleCodes: string[]
  permissions: string[]
}

const accessTokenKey = getStorageKey('access-token')
const userInfoKey = getStorageKey('user-info')

export const useUserStore = defineStore('userStore', {
  // 其他配置...
  state: () => ({
    accessToken: useLocalStorage<string | undefined>(accessTokenKey, undefined, {
      writeDefaults: false
    }),
    userInfo: useLocalStorage<UserInfo | undefined>(userInfoKey, undefined, {
      writeDefaults: false,
      serializer: StorageSerializers.object
    }),
    userMenus: undefined as SysMenuRouterVO[] | undefined
  }),
  actions: {
    async fetchUserMenus() {
      const { data } = await getLoginUserMenus()
      this.userMenus = data
      return data
    },
    clean() {
      // 不能调用 reset，因为初始值可能是从 localStorage 加载的
      this.accessToken = undefined
      this.userInfo = undefined
      this.userMenus = undefined
    }
  }
})
