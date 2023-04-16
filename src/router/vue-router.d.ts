import 'vue-router'
import type { VueNodeOrRender } from '#/types'

declare module 'vue-router' {
  interface RouteMeta {
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
    /** disable 菜单选项 */
    disabled?: boolean
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

    // 不在多页签中显示
    hideInTab?: boolean
    // 缓存组件数据
    keepAlive?: boolean
    // 允许匿名访问
    allowAnonymous?: boolean
    // 在 layout 布局之外的页面
    withoutLayout?: boolean
  }
}
