import antdLocale from 'ant-design-vue/es/locale/en_US'
import 'dayjs/locale/en'

const messages: Record<string, unknown> = {
  antdLocale,
  'dayjs.language': 'en',
  'locale.language': 'en-US'
}

// 同步加载语言模块
const modules = import.meta.glob('./en-US/**/*.json', { eager: true })
for (const path in modules) {
  // @ts-ignore
  const json = modules[path].default
  for (const key in json) {
    messages[key] = json[key]
  }
}

export default messages
