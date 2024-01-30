import { enableI18n } from '@/config'
import type { VueI18n } from 'vue-i18n'

export const useAdminI18n = () => {
  const i18nGlobal = getI18nGlobal()

  function rawI18nText(code: string, defaultText?: string) {
    if (enableI18n) {
      return i18nGlobal.t(code)
    }
    return defaultText ?? code
  }

  function i18nText(code: string, defaultText?: string) {
    return computed(() => rawI18nText(code, defaultText))
  }

  return Object.assign(
    {
      i18nText,
      rawI18nText
    },
    i18nGlobal
  )
}

function getI18nGlobal(): VueI18n {
  if (enableI18n) {
    const modules = import.meta.glob('@/locales/index.ts', { eager: true })
    const module = Object.values(modules)[0] as any
    return module.i18n.global as VueI18n
  } else {
    return {} as VueI18n
  }
}
