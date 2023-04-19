import { createI18n, type Locale } from 'vue-i18n'
import { useI18nStore } from '@/stores/i18n-store'
import dayjs from 'dayjs'
import { localMapping } from '@/locales/dayjs'
import type { App } from 'vue'
import { defaultLanguage } from '@/config'

export const i18n = createI18n({
  legacy: false,
  locale: '',
  messages: {},
  fallbackLocale: defaultLanguage
})

const localesMap = Object.fromEntries(
  Object.entries(import.meta.glob('./lang/*.ts')).map(([path, loadLocale]) => [
    path.match(/([\w-]*)\.ts$/)?.[1],
    loadLocale
  ])
) as Record<Locale, () => Promise<{ default: Record<string, string> }>>

export const availableLocales = Object.keys(localesMap)

const loadedLanguages: string[] = []

function setI18nLanguage(lang: Locale) {
  dayjs.locale(localMapping[lang])
  i18n.global.locale.value = lang as any
  if (typeof document !== 'undefined') document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}

export async function loadLanguageAsync(lang: string): Promise<Locale> {
  // If the same language
  if (i18n.global.locale.value === lang) return setI18nLanguage(lang)

  // If the language was already loaded
  if (loadedLanguages.includes(lang)) return setI18nLanguage(lang)

  // If the language hasn't been loaded yet
  const messages = await localesMap[lang]()
  i18n.global.setLocaleMessage(lang, messages.default)
  loadedLanguages.push(lang)
  return setI18nLanguage(lang)
}

export const install = (app: App<Element>) => {
  app.use(i18n)
  useI18nStore().setLanguage(defaultLanguage)
  return loadLanguageAsync(defaultLanguage)
}
