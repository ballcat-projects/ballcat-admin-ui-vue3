import { useI18n } from 'vue-i18n'
import { enableI18n } from '@/config'

export const useAdminI18n = () => {
  function rawI18nText(code: string, defaultText?: string) {
    if (enableI18n) {
      return useI18n().t(code)
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
    enableI18n ? useI18n() : {}
  )
}
