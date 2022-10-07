import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import { getStorageKey } from '@/utils/storage-utils'
import projectConfig from '@/config/projectConfig'
import { useI18nStore } from '@/stores/i18n-store'

const LOCALE = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US'
}

const appLanguageKey = getStorageKey('app_language')
const { enableI18n, defaultLanguage } = projectConfig

// 已经加载的语言列表
const loadedLanguages: string[] = []

// 这里没有加载语言，语言加载交由 bootstrap.js 中处理，这样避免默认语言和设置语言不一样时，依然要先加载默认语言的问题
export let i18n: ReturnType<typeof createI18n>

/**
 * 切换语言
 * @param lang
 * @returns {*}
 */
export function switchLanguage(lang: string) {
  // 同步切换 pinia，localStorage, html 标识的语言，防止异常
  useI18nStore().setLang(lang)
  localStorage.setItem(appLanguageKey, lang)
  document.querySelector('html')!.setAttribute('lang', lang)
  // 异步切换 i18n 的语言，方便做到懒加载
  setI18nLanguageAsync(lang)
  return lang
}

/**
 * 切换 vue-i18n.locale，如果语言文件未加载，则异步加载后切换
 * @param lang
 */
async function setI18nLanguageAsync(lang: string) {
  // 如果语言相同
  if (i18n.global.locale === lang) {
    return
  }

  await loadLanguageProperties(lang)

  // 如果语言已经加载
  if (loadedLanguages.includes(lang)) {
    if (i18n.mode === 'legacy') {
      i18n.global.locale = lang
    } else {
      ;(i18n.global.locale as any).value = lang
    }
  }
  document.querySelector('html')!.setAttribute('lang', lang)
  // 如果尚未加载语言
}

/**
 * 加载语言配置文件
 * @param lang
 */
async function loadLanguageProperties(lang: string) {
  // load locale messages with dynamic import
  const messages = await import(/* webpackChunkName: "lang-[request]" */ `./lang/${lang}.ts`)
  i18n.global.setLocaleMessage(lang, messages.default)
  loadedLanguages.push(lang)
  return messages.default
}

export function setupI18n(app: App) {
  if (enableI18n) {
    const locale = localStorage.getItem(appLanguageKey) || defaultLanguage
    i18n = createI18n({
      locale,
      fallbackLocale: [LOCALE.ZH_CN],
      messages: loadLanguageProperties(unref(locale)) as any // 设置语言环境信息
    })

    app.use(i18n)
  }
}
