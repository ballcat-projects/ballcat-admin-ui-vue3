import antdLocale from 'ant-design-vue/es/locale/zh_CN'
import 'dayjs/locale/zh-cn'

const messages: Record<string, unknown> = {
  antdLocale,
  'locale.language': 'zh-CN'
}

// 同步加载语言模块
const modules = import.meta.glob('./zh-CN/**/*.json', { eager: true })
for (const path in modules) {
  // @ts-ignore
  const json = modules[path].default
  for (const key in json) {
    messages[key] = json[key]
  }
}

export default messages
