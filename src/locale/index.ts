import enUS from '@/locale/enUS'
import zhCN from '@/locale/zhCN'

export const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}

export type Language = keyof typeof messages
