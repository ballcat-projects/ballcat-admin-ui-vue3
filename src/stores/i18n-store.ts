import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { getStorageKey } from '@/utils/storage-utils'

import { DEFAULT_LANGUAGE } from '@/constants'

import type { Language } from '@/locale'

const i18nKey = getStorageKey('language')

export const useI18nStore = defineStore('i18nStore', {
  state: () => ({
    language: useLocalStorage<Language>(i18nKey, DEFAULT_LANGUAGE, {
      writeDefaults: true
    })
  }),

  actions: {
    setLanguage(language: Language) {
      this.language = language
    },
    reset() {
      this.language = DEFAULT_LANGUAGE
    }
  }
})
