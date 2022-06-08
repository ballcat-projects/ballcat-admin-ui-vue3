import type { BreadcrumbProps } from 'ant-design-vue'
// import type { BreadcrumbListReturn } from './utils/getBreadcrumbProps'
import type { PureSettings } from './defaultSettings'
import type { MenuDataItem } from './types'
import type { WaterMarkProps } from './components/WaterMark'
import type { InjectionKey } from 'vue'

export type RouteContextType = {
  // breadcrumb?: BreadcrumbListReturn
  menuData?: MenuDataItem[]
  isMobile?: boolean
  prefixCls?: string
  collapsed?: boolean
  hasSiderMenu?: boolean
  hasHeader?: boolean
  siderWidth?: number
  isChildrenLayout?: boolean
  hasFooterToolbar?: boolean
  hasFooter?: boolean
  setHasFooterToolbar?: (hasFooterToolbar: boolean) => void
  pageTitleInfo?: {
    title: string
    id: string
    pageName: string
  }
  matchMenus?: MenuDataItem[]
  matchMenuKeys?: string[]
  currentMenu?: PureSettings & MenuDataItem
  /** PageHeader 的 BreadcrumbProps 配置，会透传下去 */
  breadcrumbProps?: BreadcrumbProps
  waterMarkProps?: WaterMarkProps
} & Partial<PureSettings>

export const routeContextInjectKey = Symbol(
  'routeContextInjectKey'
) as InjectionKey<RouteContextType>

const defaultPrefixCls = 'ant'

export const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls
  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls
}
