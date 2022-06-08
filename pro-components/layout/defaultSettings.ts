import type { MenuTheme } from 'ant-design-vue/es/menu'
import type { PropType } from 'vue'

export interface MenuDataItem {
  children?: MenuDataItem[]
  hideChildrenInMenu?: boolean
  hideInMenu?: boolean
  icon?: any
  locale?: string | false
  name?: string
  key?: string
  pro_layout_parentKeys?: string[]
  path?: string
  parentKeys?: string[]

  [key: string]: any
}

/**
 * 内容宽度
 * @type  'Fluid' | 'Fixed'
 */
export type ContentWidth = 'Fluid' | 'Fixed'

/**
 *  layout 的布局方式
 * @type  'side' | 'top' | 'mix'
 */
export type LayoutMode = 'side' | 'top' | 'mix'

export type RenderSetting = {
  headerRender?: false
  footerRender?: false
  menuRender?: false
  menuHeaderRender?: false
}

export type PureSettings = {
  /**
   * theme for nav menu
   *
   * @type  "light" | "dark" | "realDark"
   */
  navTheme?: MenuTheme | 'realDark' | undefined

  /**
   *  顶部菜单的颜色，mix 模式下生效
   * @type  "light" | "dark"
   */
  headerTheme?: MenuTheme
  /**
   *  customize header height
   * @example 顶栏高度修改为64 headerHeight={64}
   */
  headerHeight?: number
  /**
   *  layout 的布局方式
   * @type  'side' | 'top' | 'mix'
   *
   * @example 顶部菜单 layout="top"
   * @example 侧边菜单 layout="side"
   * @example 混合布局 既有顶部也有侧边 layout="mix"
   */
  layout?: LayoutMode
  /**  layout of content: `Fluid` or `Fixed`, only works when layout is top */
  contentWidth?: ContentWidth
  /**  sticky header */
  fixedHeader?: boolean
  /**  sticky siderbar */
  fixSiderbar?: boolean
  /**
   *  menu 相关的一些配置，可以配置菜单的行为
   *
   * @example 关闭菜单国际化  menu={{ locale: false }}
   * @example 默认打开所有的菜单 menu={{ defaultOpenAll:true }}
   * @example 让菜单处于loading 状态 menu={{ loading: true }}
   * @example 异步加载菜单数据 menu={{params:{ pathname } request: async (params) => { return [{name:"主页",path=params.pathname}]} }}
   * @example 使用 MenuGroup 来聚合菜单 menu={{ mode: 'group' }}
   * @example 取消自动关闭菜单 menu={{ autoClose: false }}
   * @example 忽略收起时自动关闭菜单 menu={{ ignoreFlatMenu: true }}
   */
  menu?: {
    /**
     *  菜单国际化的配置
     */
    locale?: boolean
    /**
     *  默认打开所有的菜单
     */
    defaultOpenAll?: boolean
    /**
     *  是否忽略用户手动折叠过的菜单状态，如选择忽略，折叠按钮切换之后也可实现展开所有菜单
     */
    ignoreFlatMenu?: boolean

    /**
     *  菜单的 loading 配置
     */
    loading?: boolean
    /**
     *  菜单的 loading 发生改变
     */
    onLoadingChange?: (loading?: boolean) => void

    /**
     *  菜单远程请求时用的参数，只有 params 变化才会重新触发 request
     *
     */
    params?: Record<string, any>

    /**
     *  菜单远程请求的方法，只有 params 变化才会重新触发 request
     */
    request?: (
      params: Record<string, any>,
      defaultMenuData: MenuDataItem[]
    ) => Promise<MenuDataItem[]>

    /**
     *  菜单聚合的模式
     */
    type?: 'sub' | 'group'
    /**
     *  取消自动关闭菜单
     */
    autoClose?: false
  }
  /**
   * 设置为 false，在 layout 中只展示 pageName，而不是 pageName - title
   *
   *  Layout 的 title，也会显示在浏览器标签上
   */
  title?: string | false
  /**
   * Your custom iconfont Symbol script Url eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
   * 注意：如果需要图标多色，Iconfont 图标项目里要进行批量去色处理 Usage: https://github.com/ant-design/ant-design-pro/pull/3517
   */
  iconfontUrl?: string
  /**  主色，需要配合 umi 使用 */
  primaryColor?: string
  /**  全局增加滤镜 */
  colorWeak?: boolean
  /**
   * 只在 mix 模式下生效
   *
   *  切割菜单
   */
  splitMenus?: boolean
}

export type ProSettings = PureSettings & RenderSetting

export const defaultSettings: ProSettings = {
  navTheme: 'dark',
  headerTheme: 'dark',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: false,
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

export const pureSettingsProps = {
  navTheme: {
    type: String as PropType<PureSettings['navTheme']>,
    default: defaultSettings.navTheme
  },
  headerTheme: {
    type: String as PropType<PureSettings['headerTheme']>,
    default: defaultSettings.headerTheme
  },
  headerHeight: {
    type: Number as PropType<PureSettings['headerHeight']>,
    default: defaultSettings.headerHeight
  },
  layout: {
    type: String as PropType<PureSettings['layout']>,
    default: defaultSettings.layout
  },
  contentWidth: {
    type: String as PropType<PureSettings['contentWidth']>,
    default: defaultSettings.contentWidth
  },
  fixedHeader: {
    type: Boolean as PropType<PureSettings['fixedHeader']>,
    default: defaultSettings.fixedHeader
  },
  fixSiderbar: {
    type: Boolean as PropType<PureSettings['fixSiderbar']>,
    default: defaultSettings.fixSiderbar
  },
  menu: {
    type: Object as PropType<PureSettings['menu']>,
    default: () => {
      return {
        locale: false
      }
    }
  },
  title: {
    type: String as PropType<PureSettings['title']>,
    default: () => defaultSettings.title
  },
  iconfontUrl: {
    type: String as PropType<PureSettings['iconfontUrl']>,
    default: () => defaultSettings.iconfontUrl
  },
  primaryColor: {
    type: String as PropType<PureSettings['primaryColor']>,
    default: () => defaultSettings.primaryColor
  },
  colorWeak: {
    type: Boolean as PropType<PureSettings['colorWeak']>,
    default: () => defaultSettings.colorWeak
  },
  splitMenus: {
    type: Boolean,
    default: false
  }
}
