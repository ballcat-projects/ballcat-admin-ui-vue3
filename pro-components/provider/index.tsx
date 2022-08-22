import arEG from './locale/ar_EG'
import zhCN from './locale/zh_CN'
import enUS from './locale/en_US'
import enGB from './locale/en_GB'
import viVN from './locale/vi_VN'
import itIT from './locale/it_IT'
import esES from './locale/es_ES'
import caES from './locale/ca_ES'
import jaJP from './locale/ja_JP'
import ruRU from './locale/ru_RU'
import srRS from './locale/sr_RS'
import msMY from './locale/ms_MY'
import zhTW from './locale/zh_TW'
import frFR from './locale/fr_FR'
import ptBR from './locale/pt_BR'
import koKR from './locale/ko_KR'
import idID from './locale/id_ID'
import deDE from './locale/de_DE'
import faIR from './locale/fa_IR'
import trTR from './locale/tr_TR'
import plPL from './locale/pl_PL'
import hrHR from './locale/hr_HR'

import type { VueKey, VueNode } from '#/types'

export type ProSchemaValueEnumType = {
  /** @name 演示的文案 */
  text: VueNode

  /** @name 预定的颜色 */
  status?: string
  /** @name 自定义的颜色 */
  color?: string
  /** @name 是否禁用 */
  disabled?: boolean
}

/**
 * 支持 Map 和 Object
 *
 * @name ValueEnum 的类型
 */
export type ProSchemaValueEnumMap = Map<VueKey, ProSchemaValueEnumType | VueNode>

export type ProSchemaValueEnumObj = Record<string, ProSchemaValueEnumType | VueNode>

export type BaseProFieldFC = {
  /** 值的类型 */
  text: VueNode
  /** 放置到组件上 props */
  fieldProps?: any
  /** 模式类型 */
  mode: ProFieldFCMode
  /** 简约模式 */
  plain?: boolean
  /** 轻量模式 */
  light?: boolean
  /** Label */
  label?: VueNode
  /** 映射值的类型 */
  valueEnum?: ProSchemaValueEnumObj | ProSchemaValueEnumMap
  /** 唯一的key，用于网络请求 */
  proFieldKey?: VueKey
}

export type ProFieldFCMode = 'read' | 'edit' | 'update'

/** Render 第二个参数，里面包含了一些常用的参数 */
export type ProFieldFCRenderProps = {
  mode?: ProFieldFCMode
  readonly?: boolean
  placeholder?: string | string[]
  value?: any
  onChange?: (...rest: any[]) => void
} & BaseProFieldFC

export type ProRenderFieldPropsType = {
  render?:
    | ((
        text: any,
        props: Omit<ProFieldFCRenderProps, 'value' | 'onChange'>,
        dom: JSX.Element
      ) => JSX.Element)
    | undefined
  renderFormItem?:
    | ((text: any, props: ProFieldFCRenderProps, dom: JSX.Element) => JSX.Element)
    | undefined
}

export type IntlType = {
  locale: string
  getMessage: (id: string, defaultMessage: string) => string
}

function get(
  source: Record<string, unknown>,
  path: string,
  defaultValue?: string
): string | undefined {
  // a[3].b -> a.3.b
  const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let result = source
  let message = defaultValue
  // eslint-disable-next-line no-restricted-syntax
  for (const p of paths) {
    message = Object(result)[p]
    result = Object(result)[p]
    if (message === undefined) {
      return defaultValue
    }
  }
  return message
}

/**
 * 创建一个操作函数
 *
 * @param locale
 * @param localeMap
 */
export const createIntl = (locale: string, localeMap: Record<string, any>): IntlType => ({
  getMessage: (id: string, defaultMessage: string) =>
    get(localeMap, id, defaultMessage) || defaultMessage,
  locale
})

const arEGIntl = createIntl('ar_EG', arEG)
const zhCNIntl = createIntl('zh_CN', zhCN)
const enUSIntl = createIntl('en_US', enUS)
const enGBIntl = createIntl('en_GB', enGB)
const viVNIntl = createIntl('vi_VN', viVN)
const itITIntl = createIntl('it_IT', itIT)
const jaJPIntl = createIntl('ja_JP', jaJP)
const esESIntl = createIntl('es_ES', esES)
const caESIntl = createIntl('ca_ES', caES)
const ruRUIntl = createIntl('ru_RU', ruRU)
const srRSIntl = createIntl('sr_RS', srRS)
const msMYIntl = createIntl('ms_MY', msMY)
const zhTWIntl = createIntl('zh_TW', zhTW)
const frFRIntl = createIntl('fr_FR', frFR)
const ptBRIntl = createIntl('pt_BR', ptBR)
const koKRIntl = createIntl('ko_KR', koKR)
const idIDIntl = createIntl('id_ID', idID)
const deDEIntl = createIntl('de_DE', deDE)
const faIRIntl = createIntl('fa_IR', faIR)
const trTRIntl = createIntl('tr_TR', trTR)
const plPLIntl = createIntl('pl_PL', plPL)
const hrHRIntl = createIntl('hr_', hrHR)

const intlMap = {
  'ar-EG': arEGIntl,
  'zh-CN': zhCNIntl,
  'en-US': enUSIntl,
  'en-GB': enGBIntl,
  'vi-VN': viVNIntl,
  'it-IT': itITIntl,
  'ja-JP': jaJPIntl,
  'es-ES': esESIntl,
  'ca-ES': caESIntl,
  'ru-RU': ruRUIntl,
  'sr-RS': srRSIntl,
  'ms-MY': msMYIntl,
  'zh-TW': zhTWIntl,
  'fr-FR': frFRIntl,
  'pt-BR': ptBRIntl,
  'ko-KR': koKRIntl,
  'id-ID': idIDIntl,
  'de-DE': deDEIntl,
  'fa-IR': faIRIntl,
  'tr-TR': trTRIntl,
  'pl-PL': plPLIntl,
  'hr-HR': hrHRIntl
}

const intlMapKeys = Object.keys(intlMap)

export type ParamsType = Record<string, any>

export {
  arEGIntl,
  enUSIntl,
  enGBIntl,
  zhCNIntl,
  viVNIntl,
  itITIntl,
  jaJPIntl,
  esESIntl,
  caESIntl,
  ruRUIntl,
  srRSIntl,
  msMYIntl,
  zhTWIntl,
  frFRIntl,
  ptBRIntl,
  koKRIntl,
  idIDIntl,
  deDEIntl,
  faIRIntl,
  trTRIntl,
  plPLIntl,
  hrHRIntl,
  intlMap,
  intlMapKeys
}

export type ConfigContextPropsType = {
  intl: IntlType
  valueTypeMap: Record<string, ProRenderFieldPropsType>
}

// const ConfigContext = React.createContext<ConfigContextPropsType>({
//   intl: {
//     ...zhCNIntl,
//     locale: 'default'
//   },
//   valueTypeMap: {}
// })
//
// const { Consumer: ConfigConsumer, Provider: ConfigProvider } = ConfigContext

/**
 * 根据 antd 的 key 来找到的 locale 插件的 key
 *
 * @param localeKey
 */
// const findIntlKeyByAntdLocaleKey = <T extends string | undefined>(localeKey: T) => {
//   if (!localeKey) {
//     return 'zh-CN' as T
//   }
//   const localeName = localeKey.toLocaleLowerCase()
//   return intlMapKeys.find(intlKey => {
//     const LowerCaseKey = intlKey.toLocaleLowerCase()
//     return LowerCaseKey.includes(localeName)
//   }) as T
// }

// export { ConfigConsumer, ConfigProvider, createIntl }

export function useIntl(): IntlType {
  // const { locale } = useContext(AntdConfigProvider.ConfigContext)
  // const { intl } = useContext(ConfigContext)
  //
  // if (intl && intl.locale !== 'default') {
  //   return intl
  // }
  //
  // if (locale?.locale) {
  //   return intlMap[findIntlKeyByAntdLocaleKey(locale.locale)]
  // }

  return zhCNIntl
}

// export default ConfigContext
