import type { VueNodeOrRender } from '#/types'

export type WithFalse<T> = T | false

export type MenuDataItem = {
  /** 子菜单 */
  children?: MenuDataItem[]
  /** 在菜单中隐藏子节点 */
  hideChildrenInMenu?: boolean
  /** 在菜单中隐藏自己和子节点 */
  hideInMenu?: boolean
  /** 菜单的icon */
  icon?: VueNodeOrRender
  /** 自定义菜单的国际化 key */
  locale?: string | false
  /** 菜单的名字 */
  name?: string
  /** 用于标定选中的值，默认是 path */
  key?: string
  /** disable 菜单选项 */
  disabled?: boolean
  /** 路径,可以设定为网页链接 */
  path?: string
  /**
   * 当此节点被选中的时候也会选中 parentKeys 的节点
   *
   * 自定义父节点
   */
  parentKeys?: string[]
  /** 隐藏自己，并且将子节点提升到与自己平级 */
  flatMenu?: boolean
  /** 指定外链打开形式，同a标签 */
  target?: string
  [key: string]: any
}

export type MessageDescriptor = {
  id: any
  description?: string
  defaultMessage?: string
}
