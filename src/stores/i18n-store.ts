import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

import { getStorageKey } from '@/utils/storage-utils'

const appLanguageKey = getStorageKey('app_language')

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    lang: useLocalStorage<string | undefined>(appLanguageKey, undefined, { writeDefaults: false })
  }),
  actions: {
    setLang(lang: string) {
      this.lang = lang
    }
  }
})
