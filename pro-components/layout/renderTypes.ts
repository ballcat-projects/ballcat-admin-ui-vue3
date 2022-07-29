import type { VNode } from 'vue'
import type { PrivateSiderMenuProps, SiderMenuProps } from './components/SiderMenu/SiderMenu'
import type { HeaderViewProps } from './Header'
import type { MenuDataItem } from './types'
import type { BaseMenuProps } from './components/SiderMenu/BaseMenu'
import type { VueNode, VueNodeOrRender } from '#/types'

// 多页签的渲染
export type MultiTabRender = (props: HeaderViewProps) => VueNode

// 头部渲染器
export type HeaderRender = (props: HeaderViewProps, defaultDom: VueNodeOrRender) => VueNode
// 头部标题渲染器
export type HeaderTitleRender = (
  props: HeaderViewProps,
  logo?: VueNodeOrRender,
  title?: VueNodeOrRender
) => VueNode
// 头部内容渲染器
export type HeaderContentRender = (props: HeaderViewProps, defaultDom?: VueNodeOrRender) => VueNode
// 头部右侧内容渲染器
export type RightContentRender = (props: HeaderViewProps) => VueNode

// 处理父级菜单的 props，可以复写菜单的点击功能，一般用于埋点
export type SubMenuItemRender = (
  item: MenuDataItem & { isUrl: boolean },
  defaultDom: VueNodeOrRender,
  menuProps: BaseMenuProps
) => VueNode
// 子菜单的渲染器
export type MenuItemRender = (
  item: MenuDataItem & { isUrl: boolean; onClick: () => void },
  defaultDom: VueNodeOrRender,
  menuProps: BaseMenuProps & Partial<PrivateSiderMenuProps>
) => VueNode

// 菜单渲染器
export type MenuRender = (props: HeaderViewProps, defaultDom: VueNodeOrRender) => VueNode
// 菜单头部渲染器
export type MenuHeaderRender = (
  props: SiderMenuProps,
  logo: VueNodeOrRender,
  title: VueNodeOrRender
) => VueNode
// 菜单底部渲染器
export type MenuFootRender = (props?: SiderMenuProps) => VueNode
// 菜单内容渲染器
export type MenuContentRender = (props: SiderMenuProps, defaultDom: VueNodeOrRender) => VueNode
// 菜单在 logo 和 content 之间的扩展区域渲染器，一般用来放搜索框
export type MenuExtraReander = (props: SiderMenuProps) => VueNode
// 菜单折叠按钮的渲染器
export type CollapsedButtonRender = (collapsed?: boolean) => VueNode

// 整体布局的底部渲染器
export type FooterRender = (props: HeaderViewProps, defaultDom: VNode) => VueNode
