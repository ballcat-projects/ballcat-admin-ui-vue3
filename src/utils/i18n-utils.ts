import type { messages } from '@/locale'
import { message } from 'ant-design-vue'

type KEYS = keyof (typeof messages)['zh-CN']
type OnClose = () => void

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let i18n_t = (k: KEYS, options?: any) => k

export const setT = (t: typeof i18n_t) => {
  i18n_t = t
}

export const i18n = {
  text: (key: KEYS, options?: any) => {
    return i18n_t(key, options)
  },
  message: (
    type: Exclude<keyof typeof message, 'open'>,
    key: KEYS | any,
    duration?: number,
    onClose?: OnClose
  ) => {
    if (type === 'destroy') {
      return message.destroy(key)
    }
    return message[type](i18n.text(key), duration, onClose)
  },
  info: (key: KEYS, duration?: number, onClose?: OnClose) => {
    return message.info(key, duration, onClose)
  },
  warn: (key: KEYS, duration?: number, onClose?: OnClose) => {
    return message.warn(key, duration, onClose)
  },
  warning: (key: KEYS, duration?: number, onClose?: OnClose) => {
    return message.warning(key, duration, onClose)
  },
  error: (key: KEYS, duration?: number, onClose?: OnClose) => {
    return message.error(key, duration, onClose)
  },
  loading: (key: KEYS, duration?: number, onClose?: OnClose) => {
    return message.loading(key, duration, onClose)
  }
}

export default i18n
