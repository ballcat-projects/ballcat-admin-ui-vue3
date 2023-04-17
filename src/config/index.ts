import type { ProSettings } from '#/layout/defaultSettings'

export type LanguageInfo = {
  lang: string
  title: string
  symbol: string
}

export type SupportLanguage = Record<string, LanguageInfo>

// 项目标题
export const projectTitle = 'Ballcat Admin'
// 项目描述
export const projectDesc = 'Ballcat Admin 是一套简单好用的后台管理系统'

// Local Storage/ Session Storage 的 key 前缀 prefix
export const storageKeyPrefix = 'ballcat-admin/'

// 开启 websocket，开启此选项需要服务端同步支持 websocket 功能
// 若服务端不支持，则本地启动时，抛出 socket 异常，导致 proxyServer 关闭
export const enableWebsocket = true

// 开启布局设置
export const enableLayoutSetting = true

// 开启登录验证码
export const enableLoginCaptcha = true

// 是否开启国际化
export const enableI18n = true
// 项目默认语言
export const defaultLanguage = 'zh-CN'
// 支持的语言信息
export const supportLanguage: SupportLanguage = {
  'zh-CN': {
    lang: 'zh-CN',
    title: '简体中文',
    symbol: '🇨🇳'
  },
  'en-US': {
    lang: 'en-US',
    title: 'English',
    symbol: '🇺🇸'
  }
}

// 路由布局的组件名称
export const routerLayoutName = 'RouterLayout'
// 刷新时占位的空组件名
export const emptyNodeName = '_EmptyNode'
// 重定向的路由路径
export const redirectPath = '/redirect'
// 登录页的地址
export const loginPath = '/login'

/* 应用设置 */
export const appSettings: ProSettings = {
  navTheme: 'dark',
  headerTheme: 'dark',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  headerHeight: 48,
  iconfontUrl: '',
  primaryColor: '#1890ff',
  splitMenus: false,

  // 布局内容默认都渲染
  headerRender: undefined,
  footerRender: undefined,
  menuRender: undefined,
  menuHeaderRender: undefined
}
