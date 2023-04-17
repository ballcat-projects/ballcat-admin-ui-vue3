import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { getStorageKey } from '@/utils/storage-utils'

import { defaultSettings } from '#/layout/defaultSettings'
import { appSettings } from '@/config'

// 项目的设置
const projectSetting = Object.assign({}, defaultSettings, appSettings)

export const useSettingStore = defineStore('settingStore', {
  // 其他配置...
  state: () => ({
    setting: useStorage(getStorageKey('setting'), projectSetting)
  })
})
